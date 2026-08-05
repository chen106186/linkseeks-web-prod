import { StyleProps } from './base'
import { GodIconProps } from './icon'

export interface ImageInfo {
  path: string
  size: number
  originalFileObj?: any
}
export interface UploadCardProps extends UploadProps {
  multiple?: boolean
  max?: number
  /**
   * 单次选择最多图片张数
   */
  pickerMax?: number

  /**
   * 图标属性
   */
  iconProps?: GodIconProps
}

export type ImageInfoWith = Partial<ImageInfo> & { id?: string; _id?: string; fileName?: string; status: string }

export interface UploadProps {
  actions(...args): Promise<any>
  containerStyle?: StyleProps
  onCameraSuccess?(result: any): void
  onPhotoLibrarySuccess?(result: any): void
  value?: string[]
  onChange?(value: string): void
  pickerMax?: number
  name?: string
  fileList?: Partial<ImageInfo>[]
  setFileList?(list: ImageInfoWith[]): void
  visible?: boolean
  setVisible?(state: boolean): void
  /**
   * 是否将imagepicker选择器完全受控
   */
  isControlPicker?: boolean

  childRef?: any
  mode?: 'sheet' | 'actionSheet'
  onSelect?(): void
  children?: React.ReactNode
  chooseFile?: boolean
}
