import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModel, UploadSchema } from 'src/models/upload.models';

@Module({
  imports: [MongooseModule.forFeature([{ name: UploadModel.name, schema: UploadSchema }])],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
