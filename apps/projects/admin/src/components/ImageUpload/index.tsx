import React, { useState, useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Upload, message, UploadProps, Modal } from 'antd'

export interface IProps extends Omit<UploadProps, 'onChange' | 'value'> {
  maxSize?: number // 图片大小(默认单位：KB)
  fileType?: Array<'image/jpeg' | 'image/png' | 'image/jpg'> // 图片类型(暂时写这几种)
  unit?: 'MB' | 'KB' // 图片大小单位
  onChange?: (x: string[] | string, y?: any[]) => void // 结果回调
  value?: string[] | string // 值
  tips?: string // 上传提示
  valueType?: 'String' | 'Array' // 值类型，仅针对图片最大数量为 1 的时候
}

/**
 * 图片上传
 * @param {number} maxSize 图片大小(默认单位：MB)
 * @param {string[]} fileType 图片类型, 默认 ['image/jpeg', 'image/png', 'image/jpg']
 * @param {'MB' | 'KB'} unit 图片大小单位
 * @param {(x: string[], y: any[]) => void} onChange 结果回调
 * @param {'String' | 'Array'} valueType 值类型，仅针对图片最大数量为 1 的时候
 * @returns
 */
const ImageUpload = (props: IProps, ref: any) => {
  const {
    maxCount = 1,
    maxSize = 200,
    unit = 'KB',
    fileType = ['image/jpeg', 'image/png', 'image/jpg'], // 图片类型
    onChange,
    tips,
    value,
    valueType = 'Array',
    ...rest
  } = props

  const [fileList, setFileList] = useState<any[]>([])
  const [showImage, setShowImage] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<string>()

  // 图片上传限制验证
  const beforeUpload = (file: any) => {
    let { type, size } = file
    let fileTypeOutcome = fileType.includes(type)
    let fileTypeTips = fileType.map((item) => item.replace('image/', '').toLocaleUpperCase()).join('/')
    let fileSizeOutcome = unit === 'MB' ? size / 1024 / 1024 <= maxSize : size / 1024 <= maxSize
    // 图片类型校验
    if (!fileTypeOutcome) {
      message.error(`仅支持上传 ${fileTypeTips} 类型!`)
    }
    // 图片大小校验
    if (!fileSizeOutcome) {
      message.error(`上传图片不超过 ${maxSize} ${unit}!`)
    }
    return fileTypeOutcome && fileSizeOutcome
  }

  // 上传结果回调
  const handleChange = ({ file, fileList }: any) => {
    // 若上传受条件限制，则不做数据存储
    if (!file.status) return
    // upload受控模式需始终setState fileList, 保证所有状态同步到upload
    setFileList(fileList)

    if (file.status === 'error') {
      return message.error(`文件上传失败`)
    }

    if (file.status === 'done') {
      let imgData: string[] = []
      fileList.map((item: any) => {
        if (item.url || (item.response && item.response.data)) {
          imgData.push(item.url || item.response.data)
        }
      })
      onChange && onChange(valueType === 'String' && maxCount === 1 ? imgData[0] : imgData, fileList)
    }
  }

  // 查看图片
  const handlePreview = (file: any) => {
    if (file.status === 'done') {
      setPreviewImage(file.url || file.response.data)
      setShowImage(true)
    }
  }

  // 上传框按钮样式
  const uploadButtonElement = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">上传</div>
    </div>
  )

  useEffect(() => {
    if (value) {
      const newValue = valueType === 'String' && maxCount === 1 ? [value] : value
      const newFileList =
        (newValue as string[]).map((item, index) => {
          return {
            uid: `uid${index}`,
            name: 'image.png',
            status: 'done',
            url: item,
          }
        }) || []
      setFileList(newFileList)
    }
  }, [value])

  return (
    <>
      <Upload
        name="file"
        action="/api/support/file/upload"
        headers={{ token: localStorage.getItem('token') || '' }}
        data={{ fileType: 1 }}
        listType="picture-card"
        maxCount={maxCount}
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onPreview={handlePreview}
        {...rest}
      >
        {fileList.length >= maxCount ? null : uploadButtonElement}
      </Upload>
      {tips && <div style={{ color: '#666' }}>{tips}</div>}

      <Modal visible={showImage} footer={null} onCancel={() => setShowImage(false)}>
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}

export default ImageUpload
