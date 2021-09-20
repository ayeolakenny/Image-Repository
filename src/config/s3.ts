import * as AWS from "aws-sdk";
import { awsS3Config } from "./aws.config";

export const s3 = new AWS.S3(awsS3Config.s3);
