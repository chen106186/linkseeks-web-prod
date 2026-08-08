import React, { useMemo, useCallback } from 'react'
import { View, ScrollView } from '@apps/mobile-ui'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { getSystemInfoSync, pxTransform } from '@apps/mobile-services/utils/taro'

import Coupon from '../../Coupon'

import GoodsItem from '../GoodsItem'

import './index.scss'

interface CommonContainerProps {
  // 活动类型
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
  childType?: 'goods' | 'coupons'
  details: any
  layoutType?: LAYOUT_TYPE
}

const CommonContainer: React.FC<CommonContainerProps> = (props: CommonContainerProps) => {
  const { layoutType, childType = 'goods', details } = props
  const windowWidth = getSystemInfoSync().windowWidth

  const _childWitdh = useMemo(() => {
    if (childType === 'goods') {
      return (windowWidth - 16 - 16 - 24) / 3
    }
    return (windowWidth - 16 - 16 - 24) / 2.4
  }, [windowWidth, childType])

  const _childRender = useCallback(
    (item) => {
      if (childType === 'goods') {
        return <GoodsItem {...item} childWitdh={_childWitdh} layoutType={layoutType} />
      }
      return <Coupon data={{ ...item }} size="small" customStyle={{ width: _childWitdh }} />
    },
    [childType, _childWitdh],
  )

  return (
    <ScrollView
      horizontal={layoutType !== LAYOUT_TYPE.shop}
      className=".marketingCard-commonContainer-container"
      key="CommonContainer"
      keyExtractor={(item) => item.id}
      data={details}
      renderItem={({ item, index }) => (
        <View
          key={index}
          style={{
            width: layoutType !== LAYOUT_TYPE.shop ? _childWitdh : '100%',
            marginLeft: index !== 0 && layoutType !== LAYOUT_TYPE.shop ? pxTransform(12) : pxTransform(0),
          }}
        >
          {_childRender(item)}
        </View>
      )}
    />
  )
}

CommonContainer.defaultProps = {
  childType: 'goods',
}

export default CommonContainer
