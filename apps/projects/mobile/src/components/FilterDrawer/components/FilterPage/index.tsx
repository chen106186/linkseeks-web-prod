/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-28 15:42:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-10-28 16:46:02
 * @Description: 过滤页面容器组件
 */
import React from 'react'
import { getSystemInfoSync } from '@apps/mobile-services/utils/taro'
import { IS_WEB } from '@/constants'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import { themeLayout } from '@/constants/theme'
import { useTransition } from '@apps/mobile-services'
import './index.scss'

interface FilterPageProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 关闭时销毁 FilterPage 里的子元素，待实现
   */
  destroyOnClose?: boolean

  children?: React.ReactNode
}

const FilterPage: React.FC<FilterPageProps> = (props: FilterPageProps) => {
  const { visible, children } = props
  const { display, classes, inited } = useTransition({
    visible,
    duration: 300,
    name: 'right',
    classPrefix: 'filter-page',
  })

  const safeBottom = getSystemInfoSync().safeArea?.bottom || 0
  const screenHeight = getSystemInfoSync().screenHeight

  const safePadding = IS_WEB ? 0 : screenHeight - safeBottom

  return (
    <>
      {inited && (
        <View
          className={classNames('filter-page', 'filter-page__right', classes)}
          style={{
            display: display ? 'block' : 'none',
            paddingBottom: safePadding ? `${safePadding}PX` : themeLayout['padding-xs'],
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
          }}
          catchMove
        >
          {children}
        </View>
      )}
    </>
  )
}

FilterPage.defaultProps = {
  children: null,
  destroyOnClose: false,
}

export default FilterPage
