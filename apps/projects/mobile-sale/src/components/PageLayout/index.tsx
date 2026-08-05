/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-12 15:25:31
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-23 16:48:51
 * @Description: 页面布局组件
 */
import React, { CSSProperties, useEffect, useState, useRef } from 'react'
import { nextTick, createSelectorQuery } from '@apps/mobile-services/utils/taro'
import { View } from '@tarojs/components'
import './index.scss'

interface PageLayoutProps {
  /**
   * 页面头部渲染
   */
  renderHeader?: React.ReactNode
  /**
   * 自定义外部className
   */
  className?: string
  /** 自定义style */
  style?: CSSProperties

  children?: ((offetTop: number) => React.ReactNode) | React.ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = (props: PageLayoutProps) => {
  const { renderHeader, className, children, style } = props

  const [headerHeight, setHeaderHeight] = useState(48)

  const headRef = useRef<HTMLDivElement | null>(null)

  const calculateHeaderHeight = () => {
    if (process.env.TARO_ENV === 'h5') {
      setTimeout(() => {
        if (headRef.current?.offsetHeight) {
          setHeaderHeight(headRef.current?.offsetHeight)
        }
      }, 20)
      return
    }
    nextTick(() => {
      const query = createSelectorQuery()
      query
        .select('#pageHeader')
        .boundingClientRect((res) => {
          if (res && res.height) {
            setHeaderHeight(res.height)
          }
        })
        .exec()
    })
  }

  useEffect(() => {
    if (renderHeader) {
      calculateHeaderHeight()
    } else {
      setHeaderHeight(0)
    }
  }, [renderHeader])

  const renderChildren = () => {
    return typeof children === 'function' ? children?.(headerHeight) : children
  }

  return (
    <View className={`page-layout ${className}`} style={style}>
      {renderHeader && process.env.TARO_ENV === 'weapp' ? (
        <View className="page-layout-head" id="pageHeader">
          {renderHeader}
        </View>
      ) : null}
      {renderHeader && process.env.TARO_ENV === 'h5' ? (
        <div className="page-layout-head" ref={headRef}>
          {renderHeader}
        </div>
      ) : null}
      <View style={{ marginTop: `${headerHeight}PX` }} className="page-layout-content-wrap">
        {renderChildren()}
      </View>
    </View>
  )
}

PageLayout.defaultProps = {
  className: '',
}

export default PageLayout
