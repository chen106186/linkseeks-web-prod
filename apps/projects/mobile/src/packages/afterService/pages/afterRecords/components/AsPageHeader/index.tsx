/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-31 13:43:23
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 13:59:05
 * @Description: 详情页面公共头部
 */
import React, { useState } from 'react'
import { getSystemInfoSync, createAnimation, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, ScrollView } from '@apps/mobile-ui'
import NavBar from '@/components/NavBar'
import './index.scss'

const MAX_UNRESERVED_HEIGHT = 140 // opacity 变化到 1 的最大滚动距离

const WINDOW_HEIGHT = getSystemInfoSync().windowHeight

interface AsPageHeaderProps {
  /**
   * 标题
   */
  title: React.ReactNode
  /**
   * 额外的左侧内容
   */
  extra?: string
  /**
   * 自定义渲染 title，非 GlobalHeader 中的 title
   */
  customRenderTitle?: React.ReactNode

  children?: React.ReactNode
}

const AsPageHeader: React.FC<AsPageHeaderProps> = (props: AsPageHeaderProps) => {
  const { title, extra, customRenderTitle, children } = props

  const [animationData, setAnimationData] = useState<any>()

  const handleScroll = (evt: any) => {
    const offsetY = evt.detail.scrollTop

    const animation = createAnimation({
      duration: 0,
      timingFunction: 'ease',
      delay: 0,
    })

    animation.opacity(offsetY <= MAX_UNRESERVED_HEIGHT ? offsetY / MAX_UNRESERVED_HEIGHT : 1).step()
    setAnimationData(animation.export())
  }

  const renderAsPageHeader = () => (
    <View id="pageHeaderWrap">
      <View className="as-page-header-nav-bar">
        <NavBar customClassName="as-page-header-nav" title="" />
        <View animation={animationData} className="as-page-header-nav-wrap__fix">
          <NavBar title={title} />
        </View>
      </View>
      <View className="as-page-header-head">
        <View className="as-page-header-head-left">
          {!customRenderTitle ? <Text className="as-page-header-title">{title}</Text> : customRenderTitle}
        </View>
        {extra ? (
          <View className="as-page-header-head-right">
            <Text className="as-page-header-extra">{extra}</Text>
          </View>
        ) : null}
      </View>
    </View>
  )

  return (
    <View className="as-page-header">
      {renderAsPageHeader()}
      <View className="as-page-header-scroll-wrap">
        <ScrollView className="as-page-header-scroll" onScroll={handleScroll}>
          <View
            className="as-page-header-clone"
            style={{
              marginBottom: pxTransform(24),
            }}
          >
            {renderAsPageHeader()}
          </View>
          {children}
          {/* 安全距离 */}
          <View
            style={{
              paddingTop: `${MAX_UNRESERVED_HEIGHT}PX`,
            }}
          />
        </ScrollView>
      </View>
    </View>
  )
}

AsPageHeader.defaultProps = {
  extra: undefined,
  children: null,
}

export default AsPageHeader
