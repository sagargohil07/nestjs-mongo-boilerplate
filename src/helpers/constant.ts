import { MESSAGES } from '@nestjs/core/constants';

export const PASSPORT_STRATEGIES = {
  LOCAL: 'local',
  JWT: 'jwt',
};

export const PUBLIC_ROUTE = 'isPublic';

export type ContentType = 'text' | 'image' | 'video' | 'pdf' | 'offer_accept' | 'offer_cancel' | 'offer_decline';
export enum ContentTypeEnum {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
  OFFER_ACCEPT = 'offer_accept',
  OFFER_CANCEL = 'offer_cancel',
  OFFER_DECLINE = 'offer_decline',
}

export type MessageActionType = 'requested' | 'accepted' | 'declined' | 'blocked' | 'cancelled' | 'reported' | 'deleted';

export enum MessageActionTypeEnum {
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
  REPORTED = 'reported',
  DELETED = 'deleted',
}

export enum AllowedMimeTypes {
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  MP4 = 'video/mp4',
  MKV = 'video/mkv',
  PDF = 'application/pdf',
}

export const ALLOWED_IMAGE_TYPES = [AllowedMimeTypes.JPEG, AllowedMimeTypes.JPG, AllowedMimeTypes.PNG];
export const ALLOWED_VIDEO_TYPES = [AllowedMimeTypes.MP4, AllowedMimeTypes.MKV];
export const ALLOWED_DOCUMENT_TYPES = [AllowedMimeTypes.PDF];
export const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_DOCUMENT_TYPES];

export type PaymentType = 'apple pay' | 'google pay';
export enum PaymentTypeEnum {
  APPE_PAY = 'apple pay',
  GOOGE_PAY = 'google pay',
}

export const SUCCESS = (data: object = {}) => ({
  statusCode: 200,
  status: 'SUCCESS',
  data: data,
});

export const FILE_MODULES = {
  USER_PROFILE: { value: 'profile-images' },
  MESSAGES: { value: 'messages' },
};
