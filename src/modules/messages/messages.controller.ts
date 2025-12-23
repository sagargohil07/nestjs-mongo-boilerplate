import { Body, Controller, forwardRef, Get, HttpCode, HttpStatus, Inject, Param, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Request } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ALLOWED_FILE_TYPES, AllowedMimeTypes, FILE_MODULES } from 'src/helpers/constant';
import { UploadService } from '../upload/upload.service';
import { InputReportMessageRequest } from './dto/input';
import { validateInput } from 'src/helpers/validation-helper';
import { messagesValidator } from 'src/validations/messages.validation';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('uploads')
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
    return this.uploadService.uploadMessageMultipleFiles(files, FILE_MODULES.MESSAGES.value);
  }
}
