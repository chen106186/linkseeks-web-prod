import React, { useState, PropsWithChildren, Fragment } from 'react'
import cx from 'classnames'
import { Button, Upload, UploadProps, message, Modal } from '@linkseeks/ui'
import { FileProcessorFactory, FileType, ImageCompressOptions } from '@linkseeks/tools'
import { UploadChangeParam } from 'antd/lib/upload/interface'
import { authService } from '@apps/services'
import { DeleteOutlined, EyeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import './index.less'

export enum UploadListTypeEum {
  text = 'text',
  picture = 'picture',
  'picture-card' = 'picture-card',
}
export interface UploadImageProps extends UploadProps {
  /** 单个上传图片回显url */
  imgUrl?: string
  fileMaxSize?: number
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
  onChange: (value: any) => void
}

const imageFile = FileProcessorFactory.createFileStrategy(FileType.Image)
const FILTER_TYPE_LIMIT = [
  'txt',
  'doc',
  'docx',
  'jpg',
  'jpeg',
  'png',
  'gif',
  'mp4',
  'avi',
  'wmv',
  'wma',
  'xls',
  'xlsx',
  'ppt',
  'pdf',
  'zip',
  'rar',
]

/**
 * 图片上传组件，可自动压缩
 */
const UploadImage = (props: PropsWithChildren<UploadImageProps>) => {
  const {
    imgUrl,
    children,
    listType = UploadListTypeEum['picture-card'],
    size,
    btnSize,
    btnText,
    showDesc = true,
    showUploadList = false,
    fileMaxSize = 2048,
    disabled = false,
    compress = true,
    large = false,
    fileList = [],
    filelistLength = 3,
    compressOptions,
    onChange,
    beforeUpload,
    ...resetProps
  } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState(false)
  const { accessToken } = authService.getAuth() || {}
  const intl = useIntl()

  const handleBeforeUpload = (files: File) => {
    const nameSplit = files.name.split('.')
    const fileType = nameSplit[nameSplit.length - 1]

    if (!FILTER_TYPE_LIMIT.includes(fileType)) {
      message.error(
        intl.formatMessage({
          id: 'common.file.type.nosupport',
          defaultMessage: '不支持的文件类型',
        }),
      )
      return Upload.LIST_IGNORE
    }
    // 如果需要图片压缩，则压缩后再判断图片大小
    if (compress && files.type.indexOf('image') > -1) {
      return new Promise<any>(async (resolve) => {
        const result = await imageFile.compress(files, compressOptions)
        console.log(`对图片进行压缩 => 原图：${files.size / 1024}; 压缩图：${result.file?.size / 1024}`)
        const isSizeLimit = (result.file?.size || 0) / 1024 < fileMaxSize
        if (!isSizeLimit) {
          message.error(
            `${intl.formatMessage({
              id: 'components.shangchuantupianbuchaoguo',
              defaultMessage: '上传图片不超过',
            })}${showFileSize()}!`,
          )
          return false
        }
        resolve(result.file)
      })
    }

    const isSizeLimit = (files?.size || 0) / 1024 < fileMaxSize
    if (!isSizeLimit) {
      message.error(
        `${intl.formatMessage({
          id: 'components.shangchuantupianbuchaoguo',
          defaultMessage: '上传图片不超过',
        })}${showFileSize()}!`,
      )
      return false
    }

    return isSizeLimit
  }

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/support/file/upload',
    headers: { accessToken },
    accept: '.txt,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.wmv,.wma,.xls,.xlsx,.ppt,.pdf,.zip,.rar',
    data: {
      fileType: 1,
    },
    disabled: loading || disabled,
    showUploadList: showUploadList,
    onChange(info: UploadChangeParam) {
      // 非列表上传
      if (!showUploadList) {
        if (info.file.status === 'uploading') {
          setLoading(true)
          return
        }
        if (info.file.status === 'done') {
          // 图片回显
          const { code, data } = info.file.response
          if (code === 1000) {
            onChange(data)
          }
          setLoading(false)
        }
      } else {
        onChange(info)
      }
    },
    beforeUpload: beforeUpload || handleBeforeUpload,
    ...resetProps,
  }

  const showFileSize = () => {
    if (fileMaxSize >= 1024) {
      return `${fileMaxSize / 1024}M`
    }

    return `${fileMaxSize}k`
  }

  const clearImage = () => {
    onChange('')
  }

  const uploadButton = (
    <Fragment>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <p>{btnText}</p>
    </Fragment>
  )

  const uploadListButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">{btnText}</div>
    </div>
  )

  const handleToggle = (flag: boolean) => {
    setVisible(flag)
  }

  const renderUploadComponentByListType = () => {
    switch (listType) {
      case UploadListTypeEum['picture-card']:
        return !showUploadList ? (
          // 单个待删除
          <div
            className="upload_image_wrap"
            style={btnSize ? { width: btnSize, height: btnSize } : large ? { height: '120px' } : {}}
          >
            <div
              className={cx('upload_wrap', large ? 'large' : '')}
              style={btnSize ? { width: btnSize, height: btnSize } : {}}
            >
              <Upload {...uploadProps}>
                {
                  <div
                    className={cx('upload_btn', !imgUrl ? 'isAdd' : '', large ? 'large' : '')}
                    style={btnSize ? { width: btnSize, height: btnSize } : {}}
                  >
                    {imgUrl ? <img src={imgUrl} /> : uploadButton}
                  </div>
                }
              </Upload>
              {imgUrl && !uploadProps.disabled && (
                <div className="delete_wrap">
                  <div className="container">
                    <Button
                      onClick={() => handleToggle(true)}
                      className="view_btn"
                      type="text"
                      icon={<EyeOutlined />}
                    />
                    <Button onClick={clearImage} className="delete_btn" type="text" icon={<DeleteOutlined />} />
                  </div>
                </div>
              )}
            </div>
            {showDesc && (
              <div className="size_require">
                <p>
                  {intl.formatMessage({ id: 'components.zhichiJPGPNGJPEG', defaultMessage: '支持JPG/PNG/JPEG' })}，{' '}
                  <br />
                  {intl.formatMessage({ id: 'components.zuidabuchaoguo', defaultMessage: '最大不超过' })}{' '}
                  {showFileSize()}， <br />
                  {intl.formatMessage({ id: 'components.chicun', defaultMessage: '尺寸' })}：{size}
                </p>
              </div>
            )}
          </div>
        ) : (
          // 多个列表
          <Upload listType="picture-card" className="avatar-uploader" fileList={fileList} {...uploadProps}>
            {fileList.length >= filelistLength ? null : uploadListButton}
          </Upload>
        )
      case UploadListTypeEum.text:
        return <Upload {...uploadProps}>{children}</Upload>
      default:
        return null
    }
  }

  return (
    <div>
      {renderUploadComponentByListType()}
      <Modal open={visible} title={''} footer={null} onCancel={() => handleToggle(false)}>
        <img style={{ width: '100%' }} src={imgUrl} />
      </Modal>
    </div>
  )
}

export default UploadImage
