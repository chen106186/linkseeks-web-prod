import { ImageCompressOptions } from '@linkseeks/tools'
import { UploadFile, message } from 'antd'
import { ReactNode, useRef } from 'react'
import { BaseUpload, BaseUploadProps, UploadFileType } from './BaseUpload'
import React from 'react'
import { useWebIntl } from '@apps/locales'

export interface StandardUploadProps extends BaseUploadProps {
  /** 单个上传图片回显url */
  imgUrl?: string
  fileMaxSize?: number
  maxSize?: number // 图片大小(默认单位：MB)
  /** picture-card类型 是否显示上传尺寸和大小提示 */
  showDesc?: boolean
  /** 上传尺寸提示 */
  size?: string
  /** picture-card类型下上传组件大小 */
  btnSize?: number
  btnText?: string
  /** 最大图片数量 */
  filelistLength?: number
  disabled?: boolean
  large?: boolean
  /** 是否开启图片压缩，默认是 */
  compress?: boolean
  compressOptions?: ImageCompressOptions
  onChange?: (value: any, file?: UploadFile, fileList?: UploadFile[]) => void
  initValue?: any
  children?: ReactNode
  loading?: boolean
  toggleLoading?(target?: boolean): void
}

export const StandardUpload = (props: StandardUploadProps) => {
  const { onChange, maxSize = 10, loading = false, toggleLoading, ...resetProps } = props
  const uploadImageListRef = useRef<any>([])
  const translate = useWebIntl()

  const handleChange = (e) => {
    const { file, fileList } = e
    if (fileList) {
      if (file.status === 'uploading') {
        toggleLoading && toggleLoading(true)
        if (loading) {
          return false
        }
      }

      if (file.status === 'done') {
        toggleLoading && toggleLoading(false)
      }
      if (file?.response?.data) {
        const index = uploadImageListRef.current.findIndex((v) => v.uid === file.uid)
        uploadImageListRef.current[index] = file?.response?.data
      }
      if (uploadImageListRef.current.every((v) => !v.uid)) {
        onChange && onChange(uploadImageListRef.current)
      }
    }
  }

  const beforeUpload = (file, fileList) => {
    uploadImageListRef.current = fileList

    let { size } = file

    let fileSizeOutcome = size / 1024 / 1024 <= maxSize

    // 图片大小校验
    if (!fileSizeOutcome) {
      message.error(`${translate('web.common.shangchuantupianbuchaoguo')}${maxSize} MB!`)
    }

    return fileSizeOutcome
  }
  return <BaseUpload onChange={handleChange} beforeUpload={beforeUpload} {...resetProps} />
}

StandardUpload.UploadFileType = UploadFileType
