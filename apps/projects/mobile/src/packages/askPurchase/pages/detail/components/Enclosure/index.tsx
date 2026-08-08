import React from 'react'
import { View, Image, Text } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import PdfIcon from '@/assets/file/PDF.svg'
import XlsIcon from '@/assets/file/Excel.svg'
import DocIcon from '@/assets/file/Doc.svg'
import PhotoIcon from '@/assets/file/photo_icon.svg'
import OthersIcon from '@/assets/file/others_icon.svg'
import { downloadFile, openDocument, previewImage } from '@apps/mobile-services/utils/taro'
import MellowCard from '@/components/MellowCard'
import styles from '../../index.module.scss'

interface IProps {
  enclosureUrls:
    | {
        name: string
        url: string
      }[]
    | undefined
}

export const getIcon = (fileName: string) => {
  const fileType = fileName.substring(fileName.lastIndexOf('.') + 1) || ''
  const typeObj = {
    Pdf: ['pdf'],
    Doc: ['doc', 'docx'],
    Xls: ['xls', 'xlsx'],
    Img: ['jpg', 'png', 'gif', 'svg', 'jpeg'],
  }
  const type = fileType?.toLowerCase() || ''
  if (typeObj.Doc.indexOf(type) !== -1) {
    return DocIcon
  } else if (typeObj.Xls.indexOf(type) !== -1) {
    return XlsIcon
  } else if (typeObj.Pdf.indexOf(type) !== -1) {
    return PdfIcon
  } else if (typeObj.Img.indexOf(type) !== -1) {
    return PhotoIcon
  }
  return OthersIcon
}

export const getName = (fileName: string) => {
  const reg = /[\u4E00-\u9FA5]/g //解决中文问题
  const length = fileName?.replace(reg, 'aa').length
  if (length > 30) {
    const name = fileName.match(reg)
      ? `${fileName.substring(0, 9)}...${fileName.substring(fileName.length - 6)}`
      : `${fileName.substring(0, 24)}...${fileName.substring(fileName.length - 6)}`
    return name
  }
  return fileName
}

export const handleOpenDocument = (file: { name: string; url: string }) => {
  const fileType = file?.name?.substring(file.name.lastIndexOf('.') + 1)?.toLowerCase() || ''
  const imgType = ['jpg', 'png', 'gif', 'svg', 'jpeg']
  if (imgType.indexOf(fileType) !== -1) {
    previewImage({ urls: [file.url] })
  } else {
    downloadFile({
      url: file.url,
      success: function (res) {
        var filePath = res.tempFilePath
        openDocument({
          filePath: filePath,
          success: function () {
            console.log('打开文档成功')
          },
        })
      },
    })
  }
}

const Enclosure: React.FC<IProps> = ({ enclosureUrls }) => {
  const intl = useIntl()

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'inquiry.fujian', defaultMessage: '附件' })}
      className={styles['inquiryDetailContainer-customStyle']}
      bodyStyle={{
        padding: 0,
      }}
    >
      <View className={styles['inquiryDetailContainer-uploadBox']}>
        {(enclosureUrls || []).map((item: any, index: number) => (
          <View
            className={styles['inquiryDetailContainer-uploadBoxItem']}
            key={`${index}_${item.name}`}
            onClick={() => handleOpenDocument(item)}
          >
            <Image className={styles.icon} src={getIcon(item.url)} />
            <Text className={styles['file-name']}>{getName(item.name)}</Text>
          </View>
        ))}
      </View>
    </MellowCard>
  )
}

export default Enclosure
