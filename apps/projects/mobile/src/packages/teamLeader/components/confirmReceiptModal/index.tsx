import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import uploadFileRequest from '@/utils/uploadFileRequest'
import { ActionSheet, View, Upload, Image, Icons } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import styles from './index.module.scss'

interface ConfirmReceiptModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
}

const ConfirmReceiptModal = ({ visible, onClose, onConfirm }: ConfirmReceiptModalProps) => {
  const intl = useIntl()
  const [uploadData, setUploadData] = useState<any>([])

  // 图片上传
  const uploadFile = async (result) => {
    const uploadResult = await uploadFileRequest([result[0]])
    setUploadData(uploadResult)
    return uploadResult
  }

  const toConfirm = () => {
    // if (uploadData.length === 0) {
    //   Taro.showToast({ title: '请先上传收货回单', icon: 'none' })
    //   return
    // }
    // const imageUrls = uploadData.map((item) => item.url)
    onConfirm()
  }

  return (
    <ActionSheet
      isOpened={visible}
      onClose={onClose}
      customStyle={{ borderTopLeftRadius: pxTransform(16), borderTopRightRadius: pxTransform(16) }}
    >
      <View className={styles['ActionSheet-warp']}>
        <View className={styles['ActionSheet-header']}>
          <View className={styles['ActionSheet-header-view']}></View>
          <View className={styles['ActionSheet-title']}>
            {intl.formatMessage({ id: 'teamLeader.shifouquerenshouhuo', defaultMessage: '是否确认取货' })}
          </View>
          <View className={styles['ActionSheet-header-view']} onClick={onClose}>
            <Icons name="Close" size={24} color="#91959B" />
          </View>
        </View>
        {/* <View className={styles['ActionSheet-content']}>
          <View className={styles['ActionSheet-tip']}>
            {intl.formatMessage({ id: 'teamLeader.shangchuanshouhuohuidan', defaultMessage: '上传收货回单' })}
          </View>
          <Upload actions={(e) => uploadFile(e)} pickerMax={1}>
            {uploadData.length > 0 ? (
              <View className={styles['img-wrapper']}>
                <Image
                  className={styles['Img']}
                  src={uploadData[0]?.url}
                  mode="aspectFill"
                  onClick={(e) => {
                    e.stopPropagation() // 阻止冒泡，避免触发上传
                    Taro.previewImage({
                      current: uploadData[0]?.url,
                      urls: [uploadData[0]?.url],
                    })
                  }}
                />
                <View
                  className={styles['delete-icon']}
                  onClick={(e) => {
                    e.stopPropagation()
                    setUploadData([])
                  }}
                >
                  <Icons name="Close" size={16} color="#fff" />
                </View>
              </View>
            ) : (
              <View className={styles['ActionSheet-view']}>
                <Icons name="Plus" size={24} color="#91959B" />
                <View className={styles['ActionSheet-view-text']}>
                  {intl.formatMessage({
                    id: 'teamLeader.dianjishangchuanshouhuohuidan',
                    defaultMessage: '点击上传收货回单',
                  })}
                </View>
              </View>
            )}
          </Upload>
        </View> */}
        <View onClick={toConfirm} className={styles['btn-text']}>
          {intl.formatMessage({ id: 'teamLeader.queren', defaultMessage: '确认' })}
        </View>
      </View>
    </ActionSheet>
  )
}

export default ConfirmReceiptModal
