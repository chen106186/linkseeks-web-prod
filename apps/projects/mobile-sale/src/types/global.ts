import { CSSProperties } from 'react'
import { File } from '@apps/mobile-ui/packages/types/image-picker'

export type ViewStyle = string | CSSProperties

export type ImagePickerFilesItem = File & {
  response: {
    name: string
    status: string
    thumbUrl: string
    url: string
  }
}
