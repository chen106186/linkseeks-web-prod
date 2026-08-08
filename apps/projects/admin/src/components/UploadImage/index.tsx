import React, { useState, Fragment, forwardRef, PropsWithChildren } from 'react'
import { Upload, UploadProps, message, Button, Modal } from 'antd'
import { LoadingOutlined, PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload/interface'
import { UPLOAD_TYPE } from '@/constants/index'
import cx from 'classnames'
import { authService } from '@apps/services'
import { FileProcessorFactory, FileType, ImageCompressOptions } from '@linkseeks/tools'
import styles from './index.less'

interface UploadImagePorpsType {
  imgUrl?: string
  size?: string
  onChange: Function
  disabled?: boolean
  large?: boolean
  fileMaxSize?: number
  showDesc?: boolean
  listType?: 'picture-card' | 'text'
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
    compress = true,
    compressOptions,
  } = props
  const auth = authService.getAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState(false)
  const FILTER_TYPE_LIMIT = [
    'txt',
    'doc',
    'docx',
    'jpg',
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

  const beforeUpload = (file: File) => {
    const fileType = file.type.split('/')[1]
    if (!FILTER_TYPE_LIMIT.includes(fileType)) {
      message.error(`不支持的文件类型`)
      return false
    }

    let isSizeLimit = (file?.size || 0) / 1024 < fileMaxSize
    if (!isSizeLimit) {
      message.error(`上传图片不超过${fileMaxSize}K!`)
      return false
    }

    if (isSizeLimit) {
      if (compress) {
        return new Promise<any>(async (resolve) => {
          const result = await imageFile.compress(file, compressOptions)
          console.log(result.file)
          resolve(result.file)
        })
      }
    }
    return Upload.LIST_IGNORE
  }

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/support/file/upload',
    accept: '.txt,.doc,.docx,.jpg,.png,.gif,.mp4,.avi,.wmv,.wma,.xls,.xlsx,.ppt,.pdf,.zip,.rar',
    headers: {
      accessToken: auth?.accessToken,
    },
    data: {
      fileType: UPLOAD_TYPE,
    },
    disabled: loading || disabled,
    showUploadList: false,
    onChange(info: UploadChangeParam) {
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
    },
    beforeUpload,
  }

  const clearImage = () => {
    onChange('')
  }

  const uploadButton = (
    <Fragment>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <p>上传图片</p>
    </Fragment>
  )

  const handleToggle = (flag: boolean) => {
    setVisible(flag)
  }

  const renderUploadComponentByListType = () => {
    switch (listType) {
      case 'picture-card':
        return (
          <div className={styles.upload_image_wrap}>
            <div className={styles.upload_wrap}>
              <Upload {...uploadProps}>
                {
                  <div className={cx(styles.upload_btn, !imgUrl ? styles.isAdd : '', large ? styles.large : '')}>
                    {imgUrl ? <img src={imgUrl} /> : uploadButton}
                  </div>
                }
              </Upload>
              {imgUrl && (
                <div className={styles.delete_wrap}>
                  <div className={styles.container}>
                    <a className={styles.view_btn} onClick={() => handleToggle(true)}>
                      <EyeOutlined />
                    </a>
                    <Button onClick={clearImage} className={styles.delete_btn} type="text" icon={<DeleteOutlined />} />
                  </div>
                </div>
              )}
            </div>
            {showDesc && (
              <div className={styles.size_require}>
                <p>
                  支持JPG/PNG/JPEG， <br />
                  最大不超过 {fileMaxSize}K， <br />
                  尺寸：{size}
                </p>
              </div>
            )}
          </div>
        )
      case 'text':
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
})

UploadImage.displayName = 'UploadImage'

export default UploadImage
