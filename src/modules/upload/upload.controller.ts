import { Controller, Get, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import * as multer from 'multer';
import { ALLOWED_FILE_TYPES, AllowedMimeTypes, FILE_MODULES } from 'src/helpers/constant';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file, FILE_MODULES.USER_PROFILE.value);
  }

  @Post('multiple')
  @Public()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 100 * 1024 * 1024, // 50MB max
      },
      fileFilter: (req, file, callback) => {
        const mimetype = file.mimetype as AllowedMimeTypes; // Explicit type assertion

        if (!ALLOWED_FILE_TYPES.includes(mimetype)) {
          return callback(new Error('Unsupported file type'), false);
        }

        if (mimetype.startsWith('image/') && file.size > 10 * 1024 * 1024) {
          return callback(new Error('Each image file must be less than 10MB'), false);
        }

        if (mimetype.startsWith('video/') && file.size > 50 * 1024 * 1024) {
          return callback(new Error('Each video file must be less than 50MB'), false);
        }

        if (mimetype === AllowedMimeTypes.PDF && file.size > 5 * 1024 * 1024) {
          return callback(new Error('Each PDF file must be less than 50MB'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadService.uploadMultipleFiles(files, FILE_MODULES.MESSAGES.value);
  }
}
