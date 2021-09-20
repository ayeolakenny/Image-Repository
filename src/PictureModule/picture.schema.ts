import {
  getModelForClass,
  modelOptions,
  prop as Property,
  Severity,
} from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { ObjectId } from "mongodb";
import { User } from "../UserModule/user.schema";
import { Ref } from "../types";

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@ObjectType()
export class Picture {
  @Field(() => ID)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true, unique: true })
  imageUrl: string;

  @Field(() => [String])
  @Property({ required: true })
  tag: string[];

  @Field(() => String)
  @Property({ required: true })
  imageKey: string;

  @Field(() => Boolean)
  @Property({ required: true })
  privateImage: boolean;

  @Field(() => User)
  @Property({ ref: User, required: true })
  user: Ref<User>;

  @Field()
  @Property({ default: new Date(), required: true })
  createdAt: Date;

  @Field()
  @Property({ default: new Date(), required: true })
  updatedAt: Date;
}

export const PictureModel = getModelForClass(Picture);
