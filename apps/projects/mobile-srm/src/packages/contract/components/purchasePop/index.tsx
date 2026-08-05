import React, { memo } from 'react'
import { View, Text } from '@apps/mobile-ui'
import Popup from '@/components/Popup'
import styles from './index.module.scss'

export type PropsType = {
  visible: boolean
  onClose: Function
  purchaseData: any
}

const MaterialPopup: React.FC<PropsType> = (props: PropsType) => {
  const { visible, onClose, purchaseData } = props

  const data = purchaseData?.list?.map((i) => {
    return {
      list: [
        { title: '请购单号', text: i.requisitionNo },
        { title: '请购单摘要', text: i.digest },
        { title: '供应会员', text: i.vendorMemberName },
        { title: '请购部门', text: i.department },
        { title: '请购人', text: i.requisitioner },
        { title: '预交日期', text: i.advanceDeliveryDate },
        { title: '配送方式', text: i.deliveryMethodName },
        { title: '配送地址', text: i.deliveryAddress },
        { title: '物料编号', text: purchaseData?.materielNo },
        { title: '物料名称', text: purchaseData?.materielName },
        { title: '请购数量', text: i.quantity },
      ],
    }
  })

  return (
    <Popup
      title={'关联请购单'}
      closeable
      visible={visible}
      onClose={() => onClose?.()}
      customStyle={{ height: '70vh' }}
    >
      <View className={styles['materialPopup']}>
        <View className={styles['materialPopup-container']}>
          {data?.map((i, k) => (
            <View className={styles['materialPopup-container-item']} key={k.toString()}>
              {i.list?.map((item, index) => (
                <View key={index.toString()} className={styles['materialPopup-container-item-row']}>
                  <Text className={styles['materialPopup-container-item-row-label']}>{item.title}</Text>
                  <Text className={styles['materialPopup-container-item-row-text']}>{item.text}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </Popup>
  )
}

MaterialPopup.defaultProps = {
  visible: false,
  purchaseData: {},
}

export default memo(MaterialPopup)
