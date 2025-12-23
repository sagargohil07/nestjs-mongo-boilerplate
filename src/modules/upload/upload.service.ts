import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadModel } from 'src/models/upload.models';
import * as AWS from 'aws-sdk';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { getS3SignedUrl } from 'src/helpers/s3SignedUrl';
import { FILE_MODULES } from 'src/helpers/constant';
import { handleServiceError } from 'src/helpers/error-handler';

@Injectable()
export class UploadService {
  AWS_S3_BUCKET = process.env.AWS_BUCKET_NAME;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  constructor(@InjectModel(UploadModel.name) private readonly uploadModel: Model<UploadModel>) {}

  async uploadFile(file: Express.Multer.File, path: string) {
    console.log('\n--- ~ UploadService ~ INSIDE ~ uploadFile::\n');
    try {
      const filename = this.generateFilename(file);
      const fileKey = `${path}/${filename}`;
      const { Location } = await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, fileKey, file.mimetype);

      return await this.uploadModel.create({
        file: Location,
        mimeType: file.mimetype,
        isVideo: file.mimetype.startsWith('video'),
      });
    } catch (error) {
      console.log('\n--- ~ UploadService ~ uploadFile ~ error::\n', error);
      handleServiceError(error);
    }
  }

  async uploadMultipleFiles(files: Express.Multer.File[], path: string) {
    console.log('\n--- ~ UploadService ~ INSIDE ~ uploadMultipleFiles::\n');
    try {
      const uploadPromises = files.map(async (file) => {
        const filename = this.generateFilename(file);
        const fileKey = `${path}/${filename}`;
        await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, fileKey, file.mimetype);
        return this.uploadModel.create({
          file: filename,
          mimeType: file.mimetype,
          isVideo: file.mimetype.startsWith('video'),
        });
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.log('\n--- ~ UploadService ~ uploadMultipleFiles ~ error::\n', error);
      handleServiceError(error);
    }
  }

  async uploadMessageMultipleFiles(files: Express.Multer.File[], path: string) {
    console.log('\n--- ~ UploadService ~ INSIDE ~ uploadMessageMultipleFiles::\n');
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided for upload.');
      }
      const uploadPromises = files.map(async (file) => {
        const filename = this.generateFilename(file);
        const fileKey = `${path}/${filename}`;
        const uploadResponse = await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, fileKey, file.mimetype);
        if (!uploadResponse || !uploadResponse.Location) {
          throw new Error('S3 upload failed or returned an invalid response.');
        }

        return {
          id: randomUUID(),
          file: filename,
          orignalFile: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: getS3SignedUrl(FILE_MODULES.MESSAGES.value, filename),
          isVideo: file.mimetype.startsWith('video'),
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      return uploadedFiles.filter((file) => file !== null); // Remove failed uploads
    } catch (error) {
      console.log('\n--- ~ UploadService ~ uploadMessageMultipleFiles ~ error::\n', error);
      handleServiceError(error);
    }
  }

  private generateFilename(file: Express.Multer.File): string {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`;
  }

  private async s3_upload(file: Buffer, bucket: string, name: string, mimetype: string) {
    const params = {
      Bucket: bucket,
      Key: name,
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      return await this.s3.upload(params).promise();
    } catch (error) {
      console.log('\n--- ~ UploadService ~ s3_upload ~ error::\n', error);
      handleServiceError(error);
    }
  }

  async getSignedUrl(path: string, filename: string, expiresIn = 86400): Promise<string> {
    const fileKey = `${path}/${filename}`;
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: fileKey,
      Expires: expiresIn, // URL expires in 24 hour (86400 seconds)
    };

    return this.s3.getSignedUrlPromise('getObject', params);
  }
}
