/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-23 11:47:15
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-23 18:37:36
 * @Description: 场景组件项
 */
import React, { useMemo, useContext, useEffect } from 'react'
import { nextTick, createSelectorQuery, pxTransform } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import { SceneContext, KeyType } from './index'
import './index.scss'

interface SceneItemProps {
  /**
   * 唯一标识，只支持 number | string
   */
  itemKey: KeyType
  /**
   * 点击触发事件
   */
  onClick?: () => void
  /**
   * 是否在点击项的时候触发滑动，true
   */
  slideOnClick?: boolean
  /**
   * 自定义外部容器className
   */
  customClassName?: string
  /**
   * 自定义内容容器className
   */
  customContentClassName?: string

  children?: React.ReactNode
}

const SceneItem: React.FC<SceneItemProps> = (props) => {
  const { itemKey, onClick, slideOnClick, customClassName, customContentClassName, children } = props

  const sceneContext = useContext(SceneContext)

  // 生成一个随机key 作为获取元素的标记
  const classKey = useMemo(() => `scene-item-${Math.random().toFixed(16).slice(2, 10)}`, [children])

  const calculateItemWidth = () => {
    nextTick(() => {
      const query = createSelectorQuery()
      query
        .select(`.${classKey}`)
        .boundingClientRect((res) => {
          if (res && sceneContext.ready) {
            sceneContext.ready({ itemKey, width: Math.ceil(res.width) })
          }
        })
        .exec()
    })
  }

  useEffect(() => {
    if (children) {
      calculateItemWidth()
    }
  }, [children])

  useEffect(() => {
    if (sceneContext.call) {
      sceneContext.call({ itemKey })
    }
  }, [])

  const handleSlide = () => {
    if (itemKey === undefined) {
      return
    }
    onClick?.()
    if (slideOnClick) {
      sceneContext?.slideTo?.(itemKey)
    }
  }

  return (
    <View
      className={classNames('scene-item', classKey, customClassName)}
      style={{
        padding: sceneContext?.gutter ? pxTransform(Math.ceil(sceneContext.gutter / 2)) : 0,
      }}
      onClick={handleSlide}
    >
      <View
        className={classNames(
          'scene-item-content',
          {
            'scene-item-content__active': itemKey === sceneContext?.active,
          },
          customContentClassName,
        )}
      >
        {children}
      </View>
    </View>
  )
}

SceneItem.defaultProps = {
  slideOnClick: true,
  customClassName: '',
  customContentClassName: '',
}

export default SceneItem
