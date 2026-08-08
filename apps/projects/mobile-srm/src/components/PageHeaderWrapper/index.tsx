/*
 * @Description: 带导航的详情页容器组件
 */
import React, { useRef, useState } from 'react'
import { createAnimation, usePageScroll } from '@apps/mobile-services/utils/taro'
import { View } from '@tarojs/components'
import PageLayout from '../PageLayout'
import NavBar from '../NavBar'
import './index.scss'

interface PageHeaderWrapperProps {
  /**
   * 导航标题
   */
  navTitle?: string

  children?: React.ReactNode
}

const MAX_UNRESERVED_HEIGHT = 140 // opacity 变化到 1 的最大滚动距离

const PageHeaderWrapper: React.FC<PageHeaderWrapperProps> = (props: PageHeaderWrapperProps) => {
  const { navTitle, children } = props

  const [animationData, setAnimationData] = useState<any>()

  const animation = useRef(
    createAnimation({
      duration: 0,
      timingFunction: 'ease',
      delay: 0,
    }),
  )

  usePageScroll((res) => {
    const offsetY = res.scrollTop

    animation.current.opacity(offsetY <= MAX_UNRESERVED_HEIGHT ? offsetY / MAX_UNRESERVED_HEIGHT : 1).step()
    setAnimationData(animation.current.export())
  })

  return (
    <PageLayout
      renderHeader={
        <>
          <View className="page-header-nav">
            <NavBar title="" />
          </View>
          <View className="page-header-nav page-header-nav__fixed" animation={animationData}>
            <NavBar title={navTitle} />
          </View>
        </>
      }
    >
      <View className="page-header-poster">
        <View className="page-header-poster-title">{`${navTitle ? navTitle + '>' : ''} `}</View>
      </View>
      <View className="page-header-section">{children}</View>
    </PageLayout>
  )
}

export default PageHeaderWrapper
