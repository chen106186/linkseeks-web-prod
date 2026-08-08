/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-04 14:47:43
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-10-26 17:08:57
 * @Description: 遮罩层
 */
import React from 'react'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import { useTransition } from '@apps/mobile-services'
import './index.scss'

interface OverlayProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 内容定位，可选值为 top center bottom，如果设置为 center 是水平跟垂直都是居中的
   */
  position?: 'top' | 'center' | 'bottom'
  /**
   * 点击事件
   */
  onClick?: () => void
  /**
   * zIndex，默认 99
   */
  zIndex?: number
  /**
   * 动画时长, 默认 300ms
   */
  duration?: number
  /**
   * 自定义外部容器 className
   */
  customClassName?: string
  /**
   * 自定义外部容器 style
   */
  customStyle?: React.CSSProperties

  children?: React.ReactNode
}

const Overlay: React.FC<OverlayProps> = (props: OverlayProps) => {
  const { visible, position, onClick, zIndex = 1, children, duration, customClassName, customStyle } = props
  const { display, classes } = useTransition({ visible, duration, name: 'fade' })

  const handleClick = () => {
    onClick?.()
  }

  return (
    <View
      className={classNames('overlay', classes, customClassName)}
      style={{
        zIndex: zIndex,
        ...customStyle,
        display: display ? 'block' : 'none',
        transitionDuration: `${duration}ms`,
      }}
    >
      <View
        className={classNames('overlay-content', {
          'overlay-content__center': position === 'center',
          'overlay-content__top': position === 'top',
          'overlay-content__bottom': position === 'bottom',
        })}
      >
        <View className={classNames('overlay-content-mask')} onClick={handleClick} />
        {children}
      </View>
    </View>
  )
}

Overlay.defaultProps = {
  onClick: undefined,
  position: 'center',
  customClassName: '',
  customStyle: {},
  duration: 300,
  zIndex: 99,
  children: null,
}

export default Overlay
