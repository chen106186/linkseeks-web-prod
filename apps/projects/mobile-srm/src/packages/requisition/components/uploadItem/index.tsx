import React from 'react'
import { previewImage, downloadFile } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, Image } from '@apps/mobile-ui'
import cx from 'classnames'
import useStores from '@/store/useStores'
import XlsIcon from '@/assets/images/Excel.svg'
import DocIcon from '@/assets/images/Doc.svg'
import PhotoIcon from '@/assets/images/photo_icon.svg'
import OthersIcon from '@/assets/images/others_icon.svg'
import styles from './index.module.scss'

interface UploadItemProps {
  data: any
  deleteFunc?: (data?: any) => void
  chooseFunc?: () => void
  type?: 1 | 2
  editAble?: boolean
}

const UploadItem: React.FC<UploadItemProps> = (props: UploadItemProps) => {
  const { data, type = 1, editAble, deleteFunc, chooseFunc } = props
  const {
    previewStore: { setPreviewImages, setPreviewVisible },
  } = useStores()

  const handleOpenDocument = (file: { name: string; url: string }) => {
    const fileType = file?.name?.substring(file.name.lastIndexOf('.') + 1)?.toLowerCase() || ''
    const imgType = ['jpg', 'png', 'gif', 'svg', 'jpeg']
    if (imgType.indexOf(fileType) !== -1) {
      previewImage({ urls: [file.url] })
    } else {
      downloadFile({ url: file.url })
    }
    // setPreviewImages(PATH);
    // setPreviewVisible(true);
    // downloadFile({
    //   url: PATH,
    //   success: function (res) {
    //     var filePath = res.tempFilePath
    //     openDocument({
    //       filePath: filePath,
    //       success: function (resolve) {
    //         console.log('打开文档成功')
    //       }
    //     })
    //   }
    // })
  }

  const getIcon = (fileName: string) => {
    const fileType = fileName.substring(fileName.lastIndexOf('.') + 1) || ''
    const typeObj = {
      Doc: ['doc', 'docx'],
      Xls: ['xls', 'xlsx'],
      Img: ['jpg', 'png', 'gif', 'svg', 'jpeg'],
    }
    const type = fileType?.toLowerCase() || ''
    if (typeObj.Doc.indexOf(type) !== -1) {
      return DocIcon
    } else if (typeObj.Xls.indexOf(type) !== -1) {
      return XlsIcon
    } else if (typeObj.Img.indexOf(type) !== -1) {
      return PhotoIcon
    }
    return OthersIcon
  }

  const getName = (fileName: string) => {
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

  return (
    <View className={`${styles.uploadItem} ${type == 2 && styles.uploadFile}`}>
      <View className={styles['uploadItem-top']}>
        <View className={styles['uploadItem-top-info']} onClick={() => handleOpenDocument(data)}>
          <Image className={styles.icon} src={getIcon(data.name)} />
          <Text className={styles['uploadItem-top-info-name']}>{getName(data.name)}</Text>
        </View>
        {editAble && (
          <Icons
            name="Trash"
            color="#C8CACD"
            className={styles['uploadItem-top-trash']}
            size={16}
            onClick={() => {
              deleteFunc?.()
            }}
          />
        )}
      </View>
      {type === 1 ? (
        data.goodsName && <Text className={styles['uploadItem-bottom']}>关联物料：{data.goodsName}</Text>
      ) : (
        <View className={styles['uploadItem-editBottom']}>
          <Text className={styles['uploadItem-editBottom-left']}>关联物料</Text>
          <View className={styles['uploadItem-editBottom-right']} onClick={chooseFunc}>
            <Text
              className={cx(
                styles['uploadItem-editBottom-right-name'],
                data?.goodsName ? styles['uploadItem-editBottom-right-nameFull'] : '',
              )}
            >
              {data?.goodsName || '(选填)请选择'}
            </Text>
            <Icons name="ChevronRight" color="#C8CACD" size={16} />
          </View>
        </View>
      )}
    </View>
  )
}

export default UploadItem
