import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.getway';
import { MessagesController } from './messages.controller';
import { UserModel, UserSchema } from 'src/models/users.model';
import { UploadService } from '../upload/upload.service';
import { UploadModule } from '../upload/upload.module';
import { UploadModel, UploadSchema } from 'src/models/upload.models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
      { name: UploadModel.name, schema: UploadSchema },
    ]),
    forwardRef(() => UploadModule)
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway, UploadService],
})
export class MessagesModule {}
