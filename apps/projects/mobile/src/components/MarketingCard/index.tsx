import React, { useMemo } from 'react'
import { View } from '@apps/mobile-ui'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import Header from './Header'
import CommonContainer from './CommonContainer'
import CollageContainer from './CollageContainer'
import PackageContainer from './PackageContainer'
import GiveContainer from './GiveContainer'
import './index.scss'

export interface MarketingCardProps {
  layoutType?: LAYOUT_TYPE
  color?: string
  shopColorType?: number
  // 活动类型
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
  // 自定title
  title?: any
  // 自定info
  explain?: any
  // 自定icon
  icon?: any
  // 内容
  details: any
}

const MarketingCard: React.FC<MarketingCardProps> = (props: MarketingCardProps) => {
  const { type, title, explain, icon, details, layoutType, shopColorType, color } = props
  const _container = useMemo(() => {
    if (!details) {
      return null
    }
    if (type === 8 || type === 9) {
      return <GiveContainer details={details} type={type} />
    }
    if (type === 13) {
      return <CollageContainer details={details} layoutType={layoutType} />
    }
    if (type === 18) {
      return <PackageContainer details={details} />
    }
    return <CommonContainer type={type} childType="goods" details={details} layoutType={layoutType} />
  }, [type, details])
  return (
    <View className="marketingCard-container">
      <Header
        type={type}
        title={title}
        explain={explain}
        icon={icon}
        shopColorType={shopColorType}
        color={color}
        layoutType={layoutType}
      />
      <View className="marketingCard-container-wrap">{_container}</View>
    </View>
  )
}

MarketingCard.defaultProps = {
  title: '',
  explain: '',
  icon: '',
  layoutType: LAYOUT_TYPE.client,
}

export default MarketingCard
