import React from 'react'
import { Image, Button } from 'antd'
import { downloadFile } from '@apps/utils'
import { getWebIntl } from '@apps/locales'
import XlsIcon from './imgs/Excel.svg'
import DocIcon from './imgs/Doc.svg'
import VideoIcon from './imgs/Video.svg'
import OthersIcon from './imgs/others_icon.svg'
import PDFIcon from './imgs/PDF.svg'
import styles from './index.less'

interface IProps {
  fileList: string[]
  download?: boolean
  fileWidth?: number
  fileHeight?: number
}

const StandardFileList: React.FC<IProps> = (props) => {
  const { fileList, download = true, fileWidth = 64, fileHeight = 64 } = props
  const translate = getWebIntl()

  const getIcon = (fileName: string) => {
    const fileType = fileName.substring(fileName.lastIndexOf('.') + 1) || ''
    const typeObj = {
      Video: ['mp4', 'avi', 'mpg', 'mov', 'wmv'],
      PDF: ['pdf'],
      Doc: ['doc', 'docx'],
      Xls: ['xls', 'xlsx'],
      Img: ['jpg', 'png', 'gif', 'svg', 'jpeg'],
    }
    const type = fileType?.toLowerCase() || ''
    if (typeObj.Doc.indexOf(type) !== -1) {
      return DocIcon
    } else if (typeObj.Video.indexOf(type) !== -1) {
      return VideoIcon
    } else if (typeObj.PDF.indexOf(type) !== -1) {
      return PDFIcon
    } else if (typeObj.Xls.indexOf(type) !== -1) {
      return XlsIcon
    } else if (typeObj.Img.indexOf(type) !== -1) {
      return fileName
    }
    return OthersIcon
  }

  const getFileName = (fileUrl: string) => {
    const match = fileUrl.match(/\/([^\/?#]+)[^\/]*$/)
    return match ? match[1] : fileUrl
  }

  return (
    <div className={styles['standard-fileList']}>
      {Array.isArray(fileList) &&
        fileList.length > 0 &&
        fileList.map((file, fileIndex) => (
          <div className={styles['standard-fileList-item']} key={`file-${fileIndex}`}>
            <Image
              className={styles['standard-fileList-icon']}
              width={fileWidth}
              height={fileHeight}
              src={getIcon(file)}
            />
            {download && (
              <Button
                type="link"
                className={styles['standard-fileList-item-download']}
                onClick={() => downloadFile(file, getFileName(file))}
              >
                {translate('web.common.download')}
              </Button>
            )}
          </div>
        ))}
    </div>
  )
}

export default StandardFileList
