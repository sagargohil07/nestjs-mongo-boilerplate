import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UploadDocument = UploadModel & Document;

export interface UploadAttributes {
  id: string;
  file: string;
  mimeType?: string;
  isVideo: boolean;
  is_deleted?: boolean | null;
  created_at: Date;
}

@Schema({ 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'upload'
})
export class UploadModel {
  @Prop({ required: true })
  file: string;

  @Prop()
  mimeType: string;

  @Prop({ default: false, required: true })
  isVideo: boolean;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const UploadSchema = SchemaFactory.createForClass(UploadModel);
