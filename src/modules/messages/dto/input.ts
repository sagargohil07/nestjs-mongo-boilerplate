import { ContentType } from 'src/helpers/constant';

export class CreateMessageDto {
  content: string;
  receiver_id: string;
  content_type: ContentType;
}

export interface InputAttachment {
  id: string;
  file_name: string;
  orignalFile: string;
  url: string;
  size: string;
  mimeType: string;
  isVideo: boolean;
}

export interface InputReportMessageRequest {
  reason: string;
}
