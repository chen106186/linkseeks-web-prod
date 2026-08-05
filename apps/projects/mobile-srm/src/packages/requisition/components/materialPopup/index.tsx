import React, { memo } from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import Popup from '@/components/Popup'
import defaultImage from '@/assets/images/default_img.png'
import { formatDecimal } from '@/utils/numberFormat'

import MaterialItems from './item'
import styles from './index.module.scss'

export type PropsType = {
  visible: boolean
  onClose: Function
  materialData: any
}

const MaterialPopup: React.FC<PropsType> = (props: PropsType) => {
  const { visible, onClose, materialData } = props

  const _childList = [
    {
      title: '预估金额',
      text: (
        <Text style={{ fontSize: 14, color: '#EF3346' }}>
          <Text style={{ fontSize: 12 }}>¥</Text>
          {formatDecimal(materialData?.amount ?? 0)}
        </Text>
      ),
    },
    { title: '请购数量', text: materialData.quantity },
    { title: '预估单价', text: materialData.price },
    { title: '物料编号', text: materialData.productNo },
    { title: '物料组', text: materialData.goodsGroup },
    { title: '单位', text: materialData.unit },
    { title: '品类', text: materialData.category },
    { title: '品牌', text: materialData.brand },
    { title: '已转合同数量', text: materialData.quantity },
    { title: '已转订单数量', text: materialData.transferQuantity },
    { title: '备注', text: materialData.remark },
  ]

  return (
    <Popup title={'物料信息'} closeable visible={visible} onClose={() => onClose?.()} customStyle={{ height: '70vh' }}>
      <View className={styles['materialPopup']}>
        <View className={styles['materialPopup-container']}>
          <View className={styles['materialPopup-container-head']}>
            <Image
              className={styles['materialPopup-container-head-image']}
              src={materialData?.goodsPic?.[0] ?? defaultImage}
            />
            <View className={styles['materialPopup-container-head-info']}>
              <Text className={styles['materialPopup-container-head-info-title']}>{materialData.name}</Text>
              <Text className={styles['materialPopup-container-head-info-spec']}>{materialData.spec}</Text>
            </View>
          </View>
          {_childList.map((item, index) => (
            <MaterialItems {...item} key={`MaterialItems_${index}`} />
          ))}
        </View>
      </View>
    </Popup>
  )
}

MaterialPopup.defaultProps = {
  visible: false,
  materialData: {},
}

export default memo(MaterialPopup)
