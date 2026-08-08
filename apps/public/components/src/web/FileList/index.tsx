import React, { useMemo, Fragment } from 'react'
import type { ImageProps } from 'antd'
import { Image } from '@linkseeks/ui'
import { TrashIcon } from '@linkseeks/icons'
import Photo from './icons/Photo.svg'
import Video from './icons/Video.svg'
import PDF from './icons/PDF.svg'
import PPT from './icons/PPT.svg'
import Doc from './icons/Doc.svg'
import Excel from './icons/Excel.svg'
import Zip from './icons/Zip.svg'
import Others from './icons/Others.svg'
import cx from 'classnames'
import './index.less'
import { isEmpty } from 'lodash'

interface FileItemProps {
  className?: string
  style?: React.CSSProperties
  file: string
  imageProps?: ImageProps
  imagePreview?: boolean
  deleteAble?: boolean
}

interface FileListProps {
  className?: string
  style?: React.CSSProperties
  fileList: string[]
  imageProps?: ImageProps
  imagePreview?: boolean
  deleteAble?: boolean
}

const IMAGE_FILE_TYPE = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp', 'svg']
const PPT_FILE_TYPE = ['ppt', 'pptx']
const EXCEL_FILE_TYPE = ['xls', 'xlsx']
const DOC_FILE_TYPE = ['doc', 'docx']
const PDF_FILE_TYPE = ['pdf']
const VIDEO_FILE_TYPE = ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', '3gp', 'mpeg', 'mpg', 'qt']
const COMPRESS_FILE_TYPE = ['zip', 'rar', '7z', 'tar']

const getFileType = (fileLink: string) => {
  // 使用正则表达式匹配链接中的文件扩展名
  const regex = /\.([0-9a-z]+)(?:[\?#]|$)/i
  const match = fileLink.match(regex)

  if (match) {
    // 如果匹配成功，返回文件扩展名（不包括点）
    return match[1].toLowerCase()
  } else {
    // 如果无法匹配扩展名，默认返回未知
    return 'unknown'
  }
}

const getFileNameFromUrl = (fileUrl: string) => {
  // 使用字符串的 split 方法将链接分割成数组
  const parts = fileUrl.split('/')
  // 从数组中获取最后一个部分，即文件名
  const fileName = parts[parts.length - 1]
  return fileName
}

const FileTypeIcon = ({ file }: { file: string }) => {
  const fileType = getFileType(file)
  const iconProps = {
    style: {
      width: 16,
      height: 16,
    },
  }
  if (IMAGE_FILE_TYPE.includes(fileType)) {
    return <img src={Photo} {...iconProps} />
  }
  if (PPT_FILE_TYPE.includes(fileType)) {
    return <img src={PPT} {...iconProps} />
  }
  if (EXCEL_FILE_TYPE.includes(fileType)) {
    return <img src={Excel} {...iconProps} />
  }
  if (DOC_FILE_TYPE.includes(fileType)) {
    return <img src={Doc} {...iconProps} />
  }
  if (PDF_FILE_TYPE.includes(fileType)) {
    return <img src={PDF} {...iconProps} />
  }
  if (VIDEO_FILE_TYPE.includes(fileType)) {
    return <img src={Video} {...iconProps} />
  }
  if (COMPRESS_FILE_TYPE.includes(fileType)) {
    return <img src={Zip} {...iconProps} />
  }

  return <img src={Others} {...iconProps} />
}

export const FileItem: React.FC<FileItemProps> = (props) => {
  const { className, style, file, imageProps, deleteAble = false, imagePreview } = props

  const renderByFileType = useMemo(() => {
    if (isEmpty(file)) return undefined
    // const fileType = getFileType(file)
    if (imagePreview) {
      return (
        <Image
          width={64}
          height={64}
          src={file}
          fallback="data:image/png;base64,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"
          style={{
            objectFit: 'contain',
          }}
          {...imageProps}
        />
      )
    }
    return (
      <div className="file-list-item-main">
        <FileTypeIcon file={file} />
        <a className="file-list-item-filename" href={file} target="_blank">
          {getFileNameFromUrl(file)}
        </a>
      </div>
    )
  }, [file])

  return (
    <div className={cx('file-list-item', className)} style={style}>
      {renderByFileType}
      {deleteAble && <TrashIcon size={14} className="file-list-item-btn-del" />}
    </div>
  )
}

const FileList: React.FC<FileListProps> & { Item: typeof FileItem } = (props) => {
  const { className, style, fileList } = props

  return (
    <div className={cx('file-list', className)} style={style}>
      {fileList &&
        fileList.length > 0 &&
        fileList.map((file, index) => <FileItem key={`'file-list-item'-${index}`} file={file} {...props} />)}
    </div>
  )
}

FileList.Item = FileItem

export default FileList
