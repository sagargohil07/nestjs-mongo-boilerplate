import * as AWS from 'aws-sdk';
import { config } from 'dotenv';

config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export function getS3SignedUrl(path: string, filename: string, expiresIn = 86400): string | null {
  const fileKey = `${path}/${filename}`;
  if (!filename) return null;

  return s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Expires: expiresIn, // Default to 24 hours
  });
}
