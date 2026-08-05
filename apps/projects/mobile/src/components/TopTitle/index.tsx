/*
 * @Author: Crayon
 * @Date: 2021-11-03 10:25:21
 * @LastEditTime: 2021-11-05 15:09:34
 * @LastEditors: Crayon
 * @Description: 自定义头部
 * @FilePath: \lingxi-mobile\src\components\TopTitle\index.tsx
 */
import React, { useEffect, useState, CSSProperties } from 'react'
import { View, Icons, Text } from '@apps/mobile-ui'
import { getSystemInfo, pxTransform } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { COLOR, PRIMARY } from '@/constants/theme'
import './index.scss'

interface TopTitleProps {
  title?: string
  goBack?: () => void
  fontColor?: string
  bgColor?: string
  iconSize?: number
  iconColor?: string
  style?: CSSProperties
}

const TopTitle: React.FC<TopTitleProps> = (props) => {
  const { title, goBack, fontColor, bgColor, iconSize, iconColor, style } = props

  const [navHeight, setNavHeight] = useState<number>(0)

  const handleBack = () => {
    goBack ? goBack() : Router.navigateBack()
  }

  useEffect(() => {
    getSystemInfo().then((res) => {
      let statusBarHeight = res.statusBarHeight || 0
      setNavHeight(statusBarHeight)
    })
  }, [])

  return (
    <View style={{ paddingBottom: pxTransform(navHeight + 42), ...style }}>
      <View
        className="top-title"
        style={{ height: pxTransform(navHeight + 44), paddingTop: pxTransform(navHeight), backgroundColor: bgColor }}
      >
        <View className="icon-back" onClick={handleBack}>
          <Icons size={iconSize} name="ChevronLeft" color={iconColor} />
        </View>
        <Text style={{ color: fontColor }}>{title}</Text>
      </View>
    </View>
  )
}

TopTitle.defaultProps = {
  fontColor: '#FFF',
  bgColor: COLOR[PRIMARY],
  iconSize: 20,
  iconColor: '#FFF',
  style: {},
}

export default TopTitle
