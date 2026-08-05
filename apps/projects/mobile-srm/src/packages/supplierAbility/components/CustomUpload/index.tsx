/*
 * @Description: Upload上传组件，只限单张
 */
import React, { useState, useEffect } from 'react'
import { showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { ImagePicker, View } from '@apps/mobile-ui'
import { ImagePickerFilesItem } from '@/types/global'
import classNames from 'classnames'
import uploadFileRequest from '@/utils/uploadFileRequest'
import './index.scss'

type UploadValueType = string | string[]

interface CustomUploadProps {
  value?: UploadValueType
  onChange?: (value: UploadValueType) => void
  disabled?: boolean
  /**
   * 最多可上传张数
   */
  max?: number
  /**
   * 是否是上传多张的，默认 false
   */
  multiple?: boolean
}

const CustomUpload: React.FC<CustomUploadProps> = (props) => {
  const { value, onChange, disabled, max, multiple = false } = props

  const [fileList, setFileList] = useState<ImagePickerFilesItem[]>([])

  const provideMax = max !== undefined ? max : !multiple ? 1 : undefined

  useEffect(() => {
    if ('value' in props) {
      const arrValue = multiple ? (value as string[]) || [] : Array.isArray(value) ? value : value ? [value] : []
      const normalizedValue: ImagePickerFilesItem[] = arrValue.map((item) => ({
        url: item,
        response: {
          url: item,
          name: item ? item.split('/').slice(-1)[0] : '',
          status: 'done',
          thumbUrl: item,
        },
      }))
      setFileList(normalizedValue)
    }
  }, [value])

  const triggerChange = (next: UploadValueType) => {
    onChange?.(next)
  }

  const handleFileListChange = async (value: ImagePickerFilesItem[]) => {
    showLoading()
    const filtered = value.filter((item) => !fileList.find((file) => file.url === item.url))
    if (filtered.length) {
      const uploadResult = await uploadFileRequest(filtered.map((item) => ({ ...item, path: item.url })))
      if (uploadResult.every((item) => item.status === 'done')) {
        const mergedFiles = [
          ...filtered.map((item, index) => ({ ...item, response: uploadResult[index] })),
          ...fileList,
        ]
        if (!('value' in props)) {
          setFileList(mergedFiles)
        }
        const mergedValue = !multiple ? mergedFiles[0]?.response.url : mergedFiles.map((item) => item.response.url)
        triggerChange(mergedValue)
      }
      hideLoading()
      return
    }
    if (!('value' in props)) {
      setFileList(value)
    }
    const mergedValue = !multiple ? '' : value.map((item) => item.response.url)
    triggerChange(mergedValue)
    hideLoading()
  }

  return (
    <View
      className={classNames('custom-upload', {
        'custom-upload__multiple': multiple,
        'custom-upload__disabled': disabled,
      })}
    >
      <ImagePicker
        files={fileList}
        count={max !== undefined ? max - fileList.length : 1}
        showAddBtn={(!provideMax || fileList.length < provideMax) && !disabled}
        onChange={handleFileListChange}
        length={!multiple ? 1 : 4}
      />
    </View>
  )
}

export default CustomUpload
