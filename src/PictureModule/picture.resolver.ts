import { FileUpload, GraphQLUpload } from "graphql-upload";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { uploadFile } from "../helpers/uploadFile";
import { Picture, PictureModel } from "./picture.schema";
import { DeleteResponse, PictureResponse } from "./picture.types";
import { ObjectIdScalar } from "../objectId.scalar";
import { ObjectId } from "mongodb";
import { deleteFile } from "../helpers/deleteFile";

@Resolver(() => Picture)
export class PictureResolver {
  // creating a new image(s)
  @Mutation(() => PictureResponse)
  async addPicture(
    @Arg("pictures", () => [GraphQLUpload])
    pictures: FileUpload[],
    @Arg("tag", () => [String]) tag: string[],
    @Ctx() { req }: MyContext,
    @Arg("privateImage", { nullable: true }) privateImage?: boolean
  ): Promise<PictureResponse> {
    if (!req.session.userId) {
      return {
        errors: [
          {
            field: "auth",
            message: "kindly signup or login to add an image",
          },
        ],
      };
    }

    if (pictures.length === 0) {
      return {
        errors: [
          {
            field: "picture",
            message: "No image was uploaded, pls try again",
          },
        ],
      };
    }

    if (tag.length === 0) {
      return {
        errors: [
          {
            field: "tag",
            message: "add words that describes your image(s)",
          },
        ],
      };
    }

    const pictureData = await uploadFile(pictures);

    const result = [];

    for (let i = 0; i < pictureData.length; i++) {
      const newPic = await new PictureModel({
        imageUrl: pictureData[i].url,
        tag,
        imageKey: pictureData[i].imageKey,
        privateImage: privateImage ? privateImage : false,
        user: req.session.userId,
      }).save();
      result.push(newPic);
    }

    return { result };
  }

  // getting all images
  @Query(() => [Picture])
  async pictures(): Promise<Picture[]> {
    return await PictureModel.find({ privateImage: false }).populate({
      path: "user",
    });
  }

  // getting a picture
  @Query(() => Picture, { nullable: true })
  async picture(
    @Arg("id", () => ObjectIdScalar) id: ObjectId
  ): Promise<Picture | null> {
    return await PictureModel.findOne({ _id: id }).populate({ path: "user" });
  }

  // get a user uploaded image
  @Query(() => [Picture])
  async getUserPictures(
    @Arg("id", () => ObjectIdScalar) id: ObjectId
  ): Promise<Picture[]> {
    return await PictureModel.find({ user: id }).populate({
      path: "user",
    });
  }

  // Delete image(s)
  @Mutation(() => DeleteResponse)
  async deletePicture(
    @Arg("id", () => [ObjectIdScalar]) id: ObjectId[],
    @Ctx() { req }: MyContext
  ): Promise<DeleteResponse> {
    if (!req.session.userId) {
      return {
        errors: [
          {
            field: "auth",
            message: "kindly signup or login to delete an image",
          },
        ],
      };
    }

    const fileKeys: string[] = [];

    for (let i = 0; i < id.length; i++) {
      const pictureId: ObjectId = id[i];
      const picture = await PictureModel.findOne({
        _id: pictureId,
        user: req.session.userId,
      });
      if (!picture) {
        return {
          errors: [
            {
              field: "picture",
              message: "you can only delete pictures created by you",
            },
          ],
        };
      }
      fileKeys.push(picture.imageKey);
    }

    const result = await deleteFile(fileKeys);

    return { result };
  }

  // Search image(s) by tag
  @Query(() => [Picture])
  async searchByTag(
    @Arg("tag", () => [String]) tag: string[]
  ): Promise<Picture[]> {
    const pictureTag = tag;
    return await PictureModel.find({ tag: { $in: pictureTag } }).populate({
      path: "user",
    });
  }
}
