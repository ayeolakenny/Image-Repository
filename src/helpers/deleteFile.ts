import * as dotenv from "dotenv";
import { PictureModel } from "../PictureModule/picture.schema";
import { s3 } from "../config/s3";

dotenv.config();

export const deleteFile = async (fileKeys: string[]) => {
  const bucketName: any = process.env.S3_BUCKET_NAME;
  const Objects: any[] = [];

  fileKeys.forEach((file) =>
    Objects.push({
      Key: file,
    })
  );

  await s3
    .deleteObjects({
      Bucket: bucketName,
      Delete: {
        Objects,
      },
    })
    .promise();

  await PictureModel.deleteMany({ imageKey: { $in: fileKeys } });

  return "Successfully deleted";
};
