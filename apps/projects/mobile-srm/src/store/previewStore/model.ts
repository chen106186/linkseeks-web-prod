import { ReactNode } from 'react'

export interface PreviewStoreModel {
  images: any[]
  visible: boolean
  current: number
  setPreviewImages: (data: string) => void
  setPreviewCurrent: (data: number) => void
  setPreviewVisible: (data: boolean) => void
}
