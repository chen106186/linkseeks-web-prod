import React, { memo } from 'react'
import { View, Text, Image, Icons } from '@apps/mobile-ui'
import Popup from '@/components/Popup'
import defaultImage from '@/assets/images/default_img.png'
import { formatDecimal } from '@/utils/numberFormat'
import styles from './index.module.scss'

export type PropsType = {
  visible: boolean
  onClose: Function
  materialData: any
  sourceType: string | number
  handlePurchaseClick: (materialData) => void
}

const MaterialPopup: React.FC<PropsType> = (props: PropsType) => {
  const { visible, onClose, materialData, handlePurchaseClick, sourceType } = props
  const prpIds = materialData?.purchaseRequisitionIds
  const _childList = [
    { title: '物料编号', text: materialData.materielNo },
    { title: '单位', text: materialData.unit },
    { title: '品类', text: materialData.category },
    { title: '品牌', text: materialData.brand },
    { title: '关联报价商品', text: materialData.associatedGoods },
    { title: '单价(含税)', text: materialData.price },
    { title: '税率', text: materialData.taxRate },
    { title: '询价数量', text: materialData.purchaseCount },
    { title: '合同数量', text: materialData.bidCount },
    {
      title: '合同金额',
      text: <Text style={{ fontSize: 14, color: '#EF3346' }}>{formatDecimal(materialData?.bidAmount ?? 0)}</Text>,
    },
    {
      title: '关联单据',
      text:
        sourceType == 4 ? (
          <Text>
            查看关联请购单 <Icons name="ChevronRight" size={15} color="#c9cacc" />
          </Text>
        ) : (
          <></>
        ),
    },
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
              <Text className={styles['materialPopup-container-head-info-title']}>{materialData.materielName}</Text>
              <Text className={styles['materialPopup-container-head-info-spec']}>
                {' '}
                <Text className={styles['materialPopup-container-head-info-spec-text']}>{materialData.type}</Text>{' '}
              </Text>
            </View>
          </View>
          {_childList.map((item: any, index) => (
            <View className={styles['materialDataRow']} key={`MaterialItems_${index}`}>
              <Text className={styles['materialDataRow-label']}>{item.title}</Text>
              <Text
                className={styles['materialDataRow-text']}
                onClick={() => (item.title == '关联单据' ? handlePurchaseClick(materialData) : {})}
              >
                {item.text}
              </Text>
            </View>
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
