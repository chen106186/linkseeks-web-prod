import React from 'react'
import { View, Text, ScrollView, Icons } from '@apps/mobile-ui'
import Overlays from '@/components/Overlay'

import CouponItem from './CouponItem'
import styles from './index.module.scss'

interface CouponModalProps {
  visible: boolean
  onClose: () => void
  data: any
  title?: any
  storeId?: number
}

const CouponModal: React.FC<CouponModalProps> = (props: CouponModalProps) => {
  const { visible, onClose, data = [], title = '', storeId } = props
  const _renderItem = ({ item, index }: any) => (
    <CouponItem {...item} key={index} storeId={storeId} closeModal={onClose} />
  )

  return (
    <Overlays visible={visible} position="center" onClick={onClose}>
      <View className={styles['container']}>
        <View className={styles['package']}>
          {/* <Text className={styles['title']}>{title}</Text> */}
          <ScrollView className={styles['list']} data={data} renderItem={_renderItem} />
        </View>
        <View className={styles['closeBtn']} onClick={onClose}>
          <Icons name="CloseCircle" size={36} color="#fff" />
        </View>
      </View>
    </Overlays>
  )
}

export default CouponModal
