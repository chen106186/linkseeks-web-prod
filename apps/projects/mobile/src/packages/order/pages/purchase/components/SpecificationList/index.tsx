import React, { useEffect, useState } from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import SimpleSteps, { StepsItem } from '@/components/ProductSpecPopup/SimpleSteps'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'

const VIP_IMG = getOssUrlPath('/miniprogram/assets/images/vip-tag.png')

/**
 * 商户下 商品下 对应选购的规格列表
 */

interface Iprops {
  count: number
  newAction: number
  unitPrice: any
  unitName: string
  isMemberPrice: boolean
  memberParameter: null | number
  ladderVisible: boolean
}

const SpecificationList: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { count, unitPrice, unitName, isMemberPrice, memberParameter, ladderVisible, newAction } = props
  const [ladderData, setLadderData] = useState<any[]>([])
  const [ladderActive, setLadderActive] = useState<number>(0)
  const stepPrice = (unitPrice && Object.keys(unitPrice)) || null
  const isSetStepPrice = stepPrice && stepPrice[0] !== '0-0'

  const _calc = () => {
    const ladder: any[] = []
    // 获取 keys 并对 起始价从小到大的排序
    const objKeys = Object.keys(unitPrice).sort((a, b) => parseFloat(a) - parseFloat(b))
    let minData: number = unitPrice[objKeys[0]]
    objKeys.forEach((key, index) => {
      // “-” 分割 起始价 跟 结束价
      const section = key.split('-')
      const value = unitPrice[key]

      const star = section[0] ? +section[0] : 0
      const end = section[1] ? +section[1] : 0

      const ladderItem = {
        id: key,
        price: value,
        memberPrice: (isMemberPrice && memberParameter && +(memberParameter * value * 100).toFixed(2) / 100) || value,
        star,
        end,
        // eslint-disable-next-line no-nested-ternary
        minimum:
          index === 0
            ? intl.formatMessage({ id: 'purchase_components_specificationList_ladderItem_1', star, unitName })
            : index === objKeys.length - 1
            ? intl.formatMessage({ id: 'purchase_components_specificationList_ladderItem_2', star, unitName })
            : intl.formatMessage({ id: 'purchase_components_specificationList_ladderItem_3', star, end, unitName }),
      }
      // 赋值阶梯价格中的最低价
      if (value < minData) {
        minData = value
      }
      ladder.push(ladderItem)
    })
    return {
      stepData: ladder,
    }
    // atom.minPrice = min;
  }

  useEffect(() => {
    if (isSetStepPrice) {
      const { stepData } = _calc()
      setLadderData(stepData)
    }
  }, [unitPrice])

  useEffect(() => {
    if (!isSetStepPrice || ladderData.length === 0) {
      return
    }
    let active = 0
    for (let i = 0; i < ladderData.length; i += 1) {
      const { star, end } = ladderData[i]
      if (i === ladderData.length - 1 && count >= end) {
        active = i
        break
      }
      if (count >= star && count <= end) {
        active = i
        break
      }
    }
    setLadderActive(active)
  }, [count, ladderData])

  const renderLadderPriceItem = (item: any, isActive: boolean) => (
    <View className={styles['spec-ladder']}>
      <View className={styles['spec-ladder-price-wrap']}>
        <Text className={`${styles['spec-ladder-price']} ${isActive ? styles['spec-ladder-price__active'] : ''}`}>
          {item.text}
        </Text>
        <Text className={styles['spec-ladder-desc']}>{item.extra?.minimum}</Text>
      </View>
      <View className={styles['spec-ladder-vip']}>
        <Image src={VIP_IMG} style={{ width: pxTransform(24), height: pxTransform(16) }} />
        <Text className="spec-ladder-vip-price">{item.extra?.vip}</Text>
      </View>
    </View>
  )

  return (
    <View>
      {/* 阶梯价格线 */}
      {ladderVisible && (
        <View className={styles['timeline']}>
          <SimpleSteps
            steps={ladderData.map((ladderItem) => ({
              text: `${intl.formatMessage({ id: 'currency' })}${ladderItem.price}`,
              extra: {
                minimum: ladderItem.minimum,
                vip: `${intl.formatMessage({ id: 'currency' })}${ladderItem.memberPrice}`,
              },
            }))}
            active={newAction}
            customText={renderLadderPriceItem}
          />
        </View>
      )}
    </View>
  )
}

export default observer(SpecificationList)
