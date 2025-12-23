import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UserModel, UserSchema } from '../../models/users.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
