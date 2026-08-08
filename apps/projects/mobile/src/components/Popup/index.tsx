/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-14 17:26:29
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-09 18:29:24
 * @Description: 弹出层
 */
import React from 'react'
import { View, Icons } from '@apps/mobile-ui'
import classNames from 'classnames'
import { useTransition } from '@apps/mobile-services'
import Overlay from '../Overlay'
import './index.scss'

interface PopupProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 弹出位置，可选值为 top bottom right left
   */
  position?: 'top' | 'bottom' | 'right' | 'left' | 'center'
  /**
   * 是否显示圆角
   */
  round?: boolean
  /**
   * 点击遮罩是否关闭菜单
   */
  closeOnClickOverlay?: boolean
  /**
   * 是否显示关闭图标，默认 true
   */
  closeable?: boolean
  /**
   * 关闭图标名称或图片链接，默认 CloseFill
   * 图标链接 https://codesign.qq.com/workspace/icons/XMx86jzK19brz3e
   */
  closeIcon?: string
  /**
   * 关闭图标定位位置，可选值为 'top-left' | 'top-right'，默认 'top-right'
   */
  closeIconPosition?: 'top-left' | 'top-right'
  /**
   * 关闭事件
   */
  onClose?: () => void
  /**
   * 点击遮罩层时触发
   */
  onClickOverlay?: () => void
  /**
   * zIndex，默认 100
   */
  zIndex?: number
  /**
   * 动画时长, 默认 300ms
   */
  duration?: number
  /**
   * 标题
   */
  title?: string
  /**
   * 自定义标题样式
   */
  customTitleStyle?: React.CSSProperties
  /**
   * 自定义Popup容器 className
   */
  customClassName?: string
  /**
   * 自定义Popup容器 style
   */
  customStyle?: React.CSSProperties
  /**
   * 自定义遮罩层类名
   */
  overlayClass?: string
  /**
   * 自定义遮罩层样式
   */
  overlayStyle?: React.CSSProperties
  /**
   * 预加载内容
   */
  preload?: boolean
  /**
   * 关闭之后触发事件
   */
  onAfterClose?: () => void

  children?: React.ReactNode
}

const Popup: React.FC<PopupProps> = (props: PopupProps) => {
  const {
    visible,
    position,
    round,
    closeOnClickOverlay,
    closeable,
    closeIcon,
    closeIconPosition,
    onClose,
    onClickOverlay,
    zIndex,
    duration,
    title,
    customTitleStyle,
    customClassName,
    customStyle,
    overlayClass,
    overlayStyle,
    preload,
    onAfterClose,
    children,
  } = props

  const handleAfterClose = () => {
    onAfterClose?.()
  }

  const { display, classes, inited } = useTransition({
    visible,
    duration,
    name: position,
    onAfterClose: handleAfterClose,
  })

  const handleOverlayClick = () => {
    if (closeOnClickOverlay && onClose) {
      onClose()
    }
    if (onClickOverlay) {
      onClickOverlay()
    }
  }

  const handleCancel = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      <Overlay
        visible={visible}
        duration={duration}
        onClick={handleOverlayClick}
        customClassName={overlayClass}
        customStyle={overlayStyle}
      />
      {(inited || preload) && (
        <View
          className={classNames(
            'popup',
            customClassName,
            {
              popup__center: position === 'center',
              popup__top: position === 'top',
              popup__right: position === 'right',
              popup__bottom: position === 'bottom',
              popup__left: position === 'left',
              popup__round: round,
            },
            classes,
          )}
          style={{
            ...customStyle,
            display: display ? 'block' : 'none',
            transitionDuration: `${duration}ms`,
            zIndex: zIndex,
          }}
        >
          {title && (
            <View className="popup-title" style={customTitleStyle}>
              {title}
            </View>
          )}
          {closeable && (
            <View
              className={classNames('popup-close', `popup-close__${closeIconPosition}`)}
              style={{
                zIndex: zIndex,
              }}
              onClick={handleCancel}
            >
              <Icons name={closeIcon} color="#E3E4E5" size={24} />
            </View>
          )}
          {children}
        </View>
      )}
    </>
  )
}

Popup.defaultProps = {
  position: 'bottom',
  round: true,
  closeOnClickOverlay: true,
  title: undefined,
  customTitleStyle: {},
  onClose: undefined,
  onClickOverlay: undefined,
  closeable: true,
  closeIcon: 'CloseFill',
  closeIconPosition: 'top-right',
  zIndex: 100,
  duration: 300,
  customClassName: '',
  customStyle: {},
  preload: false,
  children: null,
}

export default Popup
