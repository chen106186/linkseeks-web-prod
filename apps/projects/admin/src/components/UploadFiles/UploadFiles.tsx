import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { UploadProps, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { UPLOAD_TYPE } from '@/constants'
import { Upload, Progress, Button, message } from 'antd'
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons'
import pdfIcon from '@/assets/pdf_icon.png'
import { authService } from '@apps/services'
import styles from './UploadFiles.less'

type PickProps = 'headers' | 'action' | 'accept' | 'beforeUpload' | 'onChange' | 'fileList'

interface PickUploadProps extends Pick<UploadProps, PickProps> {
  containerStyle?: React.CSSProperties
  /**
   * 表示当前上传组件的order值， 越大越后， 即flex-order
   */
  uploadOrder?: number
  children?: React.ReactNode
  disabled?: boolean
  mode?: 'text' | 'link' | 'ghost' | 'default' | 'primary' | 'dashed'
  buttonText?: string
  fileContainerClassName?: string
  customizeItemRender?: ((files: UploadFile[], handleRemove: (fileItem: UploadFile) => void) => React.ReactNode) | null
  onRemove?: ((fileItem: UploadFile) => void) | null
  /** 是否显示文件 */
  showFiles?: boolean
  /**
   * 上传最大数
   */
  maxCount?: number
  /**
   * 自定义渲染child
   */
  renderUploadChild?: (fileList: any[]) => React.ReactNode
}

const UploadFiles: React.FC<PickUploadProps> = (props: PickUploadProps) => {
  const {
    uploadOrder,
    containerStyle,
    headers,
    action,
    accept,
    beforeUpload,
    onChange,
    children,
    customizeItemRender,
    onRemove,
    disabled,
    mode,
    buttonText,
    fileContainerClassName,
    showFiles,
    renderUploadChild,
    maxCount,
  } = props
  const hasFileListProps = 'fileList' in props
  const hasMaxCount = typeof maxCount !== 'undefined' ? { maxCount } : {}
  const auth = authService.getAuth()
  const [files, setFiles] = useState<UploadFile[]>(() => props.fileList || [])
  // const renderFiles = hasFileListProps ? props.fileList : files;
  useEffect(() => {
    if (!hasFileListProps) {
      return
    }
    setFiles(props.fileList)
  }, [props.fileList])

  const filesContainerCs = cx(
    {
      [styles.fileEmpty]: files.length === 0,
    },
    styles.renderFileContainer,
    fileContainerClassName,
  )

  const uploadProps = {
    disabled: disabled,
    name: 'file',
    fileList: files,
    accept: accept,
    action: action,
    headers: { ...headers, accessToken: auth?.accessToken },
    data: {
      fileType: UPLOAD_TYPE,
    },
    // disabled: loading || disabled,
    showUploadList: false,
    onChange(info: UploadChangeParam) {
      if (info.file.status === 'error' || (info.file.status === 'done' && info.file.response?.code !== 1000)) {
        message.error(info.file.response?.message || '上传失败, 请检查上传接口')
        return
      }
      // 如果不存在fileList, 只存在onChange 那么也要改变组件的file
      if (!('fileList' in props)) {
        const fileList = info.fileList
        const newList = fileList.map((file) => {
          return {
            name: file.name,
            url: file.url || file.response?.data,
            uid: file.uid,
            status: file.status,
            percent: file.percent,
            size: file.size,
            type: file.type,
          }
        })
        setFiles(newList)
      }
      if (onChange) {
        onChange(info)
      }
    },
    beforeUpload,
    ...hasMaxCount,
  }

  const handleRemove = (fileItem: UploadFile) => {
    if (disabled) {
      return
    }
    if (onRemove) {
      onRemove(fileItem)
    }
    if (!hasFileListProps) {
      const newFileList = files.filter((_item) => _item.url !== fileItem.url)
      setFiles(newFileList)
    }
  }
  const renderFileItem = () => {
    return (
      <div className={filesContainerCs} style={{ order: 1 }}>
        {files.map((_item: UploadFile, key) => {
          return (
            <div className={styles.renderFileItemContainer} key={key}>
              {_item.status === 'uploading' && (
                <div className={styles.uploadProgress}>
                  <Progress percent={_item.percent} status="active" size="small" showInfo={false} />
                </div>
              )}
              <div className={styles.renderFileItem}>
                <div className={styles['fileItem-left']}>
                  <img className={styles.img} src={pdfIcon} />
                  <a
                    className={cx({ [styles.error]: _item.status === 'error' || !_item.url })}
                    href={_item.url}
                    target="_blank"
                    title={_item.name}
                    rel="noreferrer"
                  >
                    {_item.name}
                  </a>
                </div>
                {!disabled && <DeleteOutlined onClick={() => handleRemove(_item)} />}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderFileContainer = () => {
    if (!showFiles) {
      return null
    }
    return customizeItemRender ? customizeItemRender(files, handleRemove) : renderFileItem()
  }

  return (
    <div style={containerStyle}>
      {renderFileContainer()}
      {
        <div style={{ order: uploadOrder }} className={styles.uploadContainer}>
          <Upload {...uploadProps}>
            {renderUploadChild?.(files)}
            {typeof children !== 'undefined' ? (
              children
            ) : (
              <Button type={mode} icon={<CloudUploadOutlined />}>
                {buttonText}
              </Button>
            )}
          </Upload>
        </div>
      }
    </div>
  )
}

UploadFiles.defaultProps = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'column',
  },
  uploadOrder: 2,
  action: '/api/support/file/upload',
  headers: {},
  beforeUpload: (file: UploadFile) => {
    if (file.size > 20 * 1024 * 1024) {
      message.error('上传文件不能大于20m')
      return Upload.LIST_IGNORE
    }
    return true
  },
  onChange: (file: UploadChangeParam) => {},
  customizeItemRender: null,
  onRemove: null,
  disabled: false,
  mode: 'default',
  buttonText: '上传文件',
  fileContainerClassName: '',
  showFiles: true,
  // fileList: []
}

export default UploadFiles
