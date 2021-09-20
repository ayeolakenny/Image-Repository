import { FileUpload } from "graphql-upload";
import { s3 } from "../config/s3";
import { formatFilename } from "./formatFilename";
import * as dotenv from "dotenv";

dotenv.config();

export const uploadFile = async (pictures: FileUpload[]) => {
  const bucketName: any = process.env.S3_BUCKET_NAME;
  let uploadLinks: { imageKey: string; url: string }[] = [];

  for (let i = 0; i < pictures.length; i++) {
    let picture = pictures[i];

    let { createReadStream, filename, mimetype } = await picture;

    let stream = createReadStream();

    stream.on("error", (error) => console.log(error));

    const formattedFilename = formatFilename(filename);

    const { Location } = await s3
      .upload({
        Body: stream,
        Key: formattedFilename,
        ContentType: mimetype,
        Bucket: bucketName,
      })
      .promise();

    uploadLinks.push({
      imageKey: formattedFilename,
      url: Location,
    });
  }

  return uploadLinks;
};
