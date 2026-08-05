import React, { memo } from 'react'
import { View, Text, ScrollView, Image } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import Popup from '@/components/Popup'

import styles from './index.module.scss'

export type PropsType = {
  visible: boolean
  onChoose: Function
  onClose: Function
  materialData: any
  value?: string
}

const RelationMaterialPopup: React.FC<PropsType> = (props: PropsType) => {
  const { visible, onClose, onChoose, materialData, value } = props
  const { safeBottomHeight } = useSafeArea()

  const handleCheck = (item) => {
    onChoose(item)
    onClose()
  }

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View
        className={styles['relationMaterialPopup-flatList-item']}
        onClick={() => {
          handleCheck(item)
        }}
      >
        <Text className={styles['relationMaterialPopup-flatList-item-name']}>{item.name}</Text>
        <Image
          className={styles['relationMaterialPopup-flatList-item-right']}
          src={
            item['productId'] == value
              ? require('@/assets/images/Checked-@2x.png')
              : require('@/assets/images/Default@2x.png')
          }
        />
      </View>
    )
  }

  return (
    <Popup title={'关联物料'} closeable visible={visible} onClose={() => onClose?.()} customStyle={{ height: '70vh' }}>
      <View
        className={styles['relationMaterialPopup']}
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
      >
        <ScrollView
          className={styles['relationMaterialPopup-flatList']}
          renderItem={renderItem}
          data={materialData}
          keyExtractor={(item: any) => `scrollItem${item.productId}`}
          onEndReachedThreshold={50}
          horizontal={false}
        />
      </View>
    </Popup>
  )
}

RelationMaterialPopup.defaultProps = {
  visible: false,
  materialData: {},
}

export default memo(RelationMaterialPopup)
