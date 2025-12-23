import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from 'src/models/users.model';
import { MessagesGateway } from './messages.getway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    @Inject(forwardRef(() => MessagesGateway)) private readonly messagesGateway: MessagesGateway,
  ) {}

  async createMessage() {
    console.log('\n--- ~ MessagesService ~ INSIDE ~ createMessage::\n');
    try {      
      return { };
    } catch (error) {
      console.log('\n--- ~ MessagesService ~ createMessage ~ error::\n', error);
      const message = error?.message || 'Failed to create message';
      return { error: message };
    }
  }
}
