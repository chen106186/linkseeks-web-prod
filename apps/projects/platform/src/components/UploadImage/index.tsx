import React, { useState, Fragment, forwardRef, PropsWithChildren } from 'react'
import { Upload, message, Button, UploadProps } from 'antd'
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload/interface'
import { FileProcessorFactory, FileType, ImageCompressOptions } from '@linkseeks/tools'
import { UPLOAD_TYPE } from '@/constants/index'
import cx from 'classnames'
import styles from './index.less'
import { authService } from '@apps/services'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

interface UploadImagePorpsType {
  /** 单个上传图片回显url */
  imgUrl?: string
  size?: string
  onChange: any
  disabled?: boolean
  large?: boolean
  fileMaxSize?: number
  showDesc?: boolean
  listType?: 'picture-card' | 'text'
  /** 上传模式配置 */
  showUploadList?: object | boolean
  beforeUpload?: any
  /** 多张上传图片列表 */
  fileList?: any
  /** 最大图片数量 */
  filelistLength?: number
  btnSize?: number
  btnText?: string
  /** 是否开启图片压缩，默认是 */
  compress?: boolean
  compressOptions?: ImageCompressOptions
}

const imageFile = FileProcessorFactory.createFileStrategy(FileType.Image)

const UploadImage: React.FC<PropsWithChildren<UploadImagePorpsType>> = forwardRef((props, ref) => {
  const {
    children,
    imgUrl,
    onChange,
    showDesc = true,
    size = '386x256',
    disabled = false,
    large = false,
    fileMaxSize = 200,
    listType = 'picture-card',
    showUploadList = false,
    beforeUpload,
    fileList = [],
    filelistLength = 3,
    btnSize,
    btnText = intl.formatMessage({ id: 'components.shangchuantupian' }),
    compress = true,
    compressOptions,
    ...restProps
  } = props

  const [loading, setLoading] = useState<boolean>(false)
  const { accessToken } = authService.getAuth() || {}

  const innerBeforeUpload = (file: File) => {
    const isSizeLimit = (file?.size || 0) / 1024 < fileMaxSize
    if (!isSizeLimit) {
      message.error(`${intl.formatMessage({ id: 'components.shangchuantupianbuchaoguo' })}${showFileSize()}!`)
    }

    if (isSizeLimit) {
      if (compress) {
        return new Promise<any>(async (resolve) => {
          const result = await imageFile.compress(file, compressOptions)
          resolve(result.file)
        })
      }
    }
    return Upload.LIST_IGNORE
  }

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/support/file/upload',
    headers: { accessToken: accessToken || '' },
    accept: '.txt,.doc,.docx,.jpg,.png,.gif,.mp4,.avi,.wmv,.wma,.xls,.xlsx,.ppt,.pdf,.zip,.rar',
    data: {
      fileType: UPLOAD_TYPE,
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
            console.log('upload success')
            onChange(data)
          }
          setLoading(false)
        }
      } else {
        onChange(info)
      }
    },
    beforeUpload: beforeUpload ? beforeUpload : innerBeforeUpload,
    ...restProps,
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

  const showFileSize = () => {
    if (fileMaxSize >= 1024) {
      return `${fileMaxSize / 1024} M`
    }

    return `${fileMaxSize}k`
  }

  const renderUploadComponentByListType = () => {
    switch (listType) {
      case 'picture-card':
        return !showUploadList ? (
          // 单个待删除
          <div
            className={styles.upload_image_wrap}
            style={btnSize ? { width: btnSize, height: btnSize } : large ? { height: '120px' } : {}}
          >
            <div
              className={cx(styles.upload_wrap, large ? styles.large : '')}
              style={btnSize ? { width: btnSize, height: btnSize } : {}}
            >
              <Upload {...uploadProps}>
                {
                  <div
                    className={cx(styles.upload_btn, !imgUrl ? styles.isAdd : '', large ? styles.large : '')}
                    style={btnSize ? { width: btnSize, height: btnSize } : {}}
                  >
                    {imgUrl ? <img src={imgUrl} /> : uploadButton}
                  </div>
                }
              </Upload>
              {imgUrl && !uploadProps.disabled && (
                <div className={styles.delete_wrap}>
                  <Button onClick={clearImage} className={styles.delete_btn} type="text" icon={<DeleteOutlined />} />
                </div>
              )}
            </div>
            {showDesc && (
              <div className={styles.size_require}>
                <p>
                  {intl.formatMessage({ id: 'components.zhichiJPGPNGJPEG' })}， <br />
                  {intl.formatMessage({ id: 'components.zuidabuchaoguo' })} {showFileSize()}， <br />
                  {intl.formatMessage({ id: 'components.chicun' })}：{size}
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
      case 'text':
        return <Upload {...uploadProps}>{children}</Upload>
      default:
        return null
    }
  }

  return renderUploadComponentByListType()
})

UploadImage.displayName = 'UploadImage'

export default UploadImage
