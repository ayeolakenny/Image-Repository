import * as AWS from "aws-sdk";
import { ClientConfiguration } from "aws-sdk/clients/s3";
import { awsCredentials } from "../config/aws.config";
import { formatFilename } from "./formatFilename";

export const getS3signedUrl = (
  filename: string,
  filedirectory: string,
  filetype: string
) => {
  AWS.config.update({ credentials: awsCredentials });

  const s3 = new AWS.S3({
    signatureVersion: "v4",
    region: process.env.S3_BUCKET_REGION,
  });

  let formattedFilename = formatFilename(filename);

  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${filedirectory}/${formattedFilename}`,
    Expires: 120,
    ContentType: filetype,
    ACL: "public-read",
  } as ClientConfiguration;

  const signedRequest = s3.getSignedUrl("putObject", s3Params);
  const url = `https://s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${process.env.S3_BUCKET_NAME}/${filedirectory}/${formattedFilename}`;

  return {
    signedRequest,
    url,
  };
};
