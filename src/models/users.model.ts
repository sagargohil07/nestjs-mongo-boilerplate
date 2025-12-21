import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = UserModel & Document;

export interface UserAttributes {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_deleted?: boolean | null;
  created_at?: Date;
  updated_at?: Date | null;
}

@Schema({ 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'users',
  _id: true,
})
export class UserModel {
  @Prop({ 
    type: String, 
    default: () => uuidv4(),
    unique: true,
    required: true,
    index: true,
  })
  id: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);


