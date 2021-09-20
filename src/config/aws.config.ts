import * as dotenv from "dotenv";
import * as AWS from "aws-sdk";
dotenv.config();

export const awsS3Config = {
  s3: {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.S3_BUCKET_REGION,
    params: {
      ACL: "public-read",
      Bucket: process.env.S3_BUCKET_NAME,
    },
  } as AWS.S3.Types.ClientConfiguration,
  app: {
    storageDir: "shopify",
  },
};
