import React, { useMemo } from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import cx from 'classnames'
import defaultConfig from './config'
import './index.scss'

interface HeaderProps {
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
  // 倒计时数组[时,分,秒]
  countDown?: string[]
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { type, title, explain, icon, layoutType, shopColorType, color } = props
  const _title = useMemo(() => title || defaultConfig[type]?.title || '', [type, title])

  const _explain = useMemo(() => explain || defaultConfig[type]?.explain || '', [type, explain])

  const _icon = useMemo(() => {
    if (icon) {
      return <Image src={icon} className="marketingCard-header-container-titleContainer-icon" />
    }
    return <Image src={defaultConfig[type].icon} className="marketingCard-header-container-titleContainer-icon" />
  }, [type, icon])

  const _renderHeader = useMemo(() => {
    if (layoutType === LAYOUT_TYPE.client) {
      return (
        <View className="marketingCard-header-container">
          <View className="marketingCard-header-container-titleContainer">
            {_icon}
            <Text className="marketingCard-header-container-titleContainer-title">{_title}</Text>
          </View>
          <Text className="marketingCard-header-container-explain">{_explain}</Text>
        </View>
      )
    }
    if (layoutType === LAYOUT_TYPE.own || layoutType === LAYOUT_TYPE.channel) {
      return (
        <View className="marketingCard-header-container">
          <View className="marketingCard-header-container-shopTitleContainer">
            <Text className="marketingCard-header-container-shopTitleContainer-shopTitle">{_title}</Text>
            <Text className="marketingCard-header-container-shopTitleContainer-shopExplain">{_explain}</Text>
          </View>
        </View>
      )
    }
    if (layoutType === LAYOUT_TYPE.shop) {
      return (
        <View
          className={cx('marketingCard-shop-header-container', shopColorType && `shop-color-type-${shopColorType}`)}
          style={color ? { backgroundColor: color } : {}}
        >
          <View className="marketingCard-shop-header-container-shopTitleContainer">
            {_icon}
            <Text className="marketingCard-shop-header-container-shopTitleContainer-shopTitle">{_title}</Text>
          </View>
        </View>
      )
    }
    return null
  }, [layoutType])

  return _renderHeader
}

Header.defaultProps = {
  title: '',
  explain: '',
  icon: '',
  countDown: [],
}

export default Header
