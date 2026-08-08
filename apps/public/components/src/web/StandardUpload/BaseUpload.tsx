import { Upload, UploadProps } from '@linkseeks/ui'
import { defaultConfig } from './config'
import React from 'react'
import cn from 'classnames'
export enum BaseUploadType {}

export enum UploadFileType {
  IMAGE = 'image',
  VIDEO = 'video',
  IMAGE_AND_VIDEO = 'imageAndvideo',
}

export const UPLOAD_FILE_ACCEPT = {
  [UploadFileType.IMAGE]: ['image/*'],
  [UploadFileType.VIDEO]: ['video/*'],
  [UploadFileType.IMAGE_AND_VIDEO]: ['image/*', 'video/*'],
}

export const UPLOAD_FILE_TYPE_LIST = {
  [UploadFileType.IMAGE]: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  [UploadFileType.VIDEO]: ['video/mp4', 'video/mkv', 'video/mov', 'video/avi', 'video/wmv', 'video/WebM', 'video/ogg'],
  [UploadFileType.IMAGE_AND_VIDEO]: [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/mkv',
    'video/mov',
    'video/avi',
    'video/wmv',
    'video/WebM',
    'video/ogg',
  ],
}

export interface BaseUploadProps extends UploadProps {
  /**
   * 文件类型限制
   */
  fileType?: UploadFileType
}

export const BaseUpload = (props: BaseUploadProps) => {
  const { fileType = UploadFileType.IMAGE, ...resetProps } = props
  const uploadProps: UploadProps = {
    ...defaultConfig,
    accept: UPLOAD_FILE_ACCEPT[fileType]?.join(','),
    headers: {
      // 需要token
    },
    ...resetProps,
  }

  return <Upload {...uploadProps} />
}

export const MimeTypes = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  bmp: 'image/bmp',
  webp: 'image/webp',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  csv: 'text/csv',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  zip: 'application/zip',
  xzip: 'application/x-zip-compressed',
  rar: 'application/rar',
  xrar: 'application/x-rar-compressed',
  // 添加更多扩展名和 MIME 类型
}
// 1. 单个图片 2. 多张图片 3. 自定义内容
