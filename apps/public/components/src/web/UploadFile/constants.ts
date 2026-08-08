export enum UploadFileType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum ShowType {
  // 卡片形式
  PICTURE_CARD = 'picture-card',

  TEXT = 'text',
}

export const UPLOAD_FILE_ACCEPT = {
  [UploadFileType.IMAGE]: ['image/*'],
  [UploadFileType.VIDEO]: ['video/*'],
}
