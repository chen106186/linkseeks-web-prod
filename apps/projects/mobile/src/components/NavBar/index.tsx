/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-09 09:59:00
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-19 11:49:51
 * @Description: 导航栏
 */
import React, { useState, useEffect } from 'react'
import { View, Icons } from '@apps/mobile-ui'
import { getMenuButtonBoundingClientRect, getCurrentPages } from '@apps/mobile-services/utils/taro'
import classNames from 'classnames'
import { useStatusBarHeight } from '@apps/mobile-services'
import Router from '../../utils/router'
import './index.scss'
import { IS_WEB } from '@/constants'
import { THEME_COLORS } from '@/constants/theme'

interface NavBarProps {
  /**
   * 自定义渲染左侧内容
   */
  customRenderLeft?: React.ReactNode
  /**
   * 标题
   */
  title?: React.ReactNode
  /**
   * 右侧拓展内容
   */
  extra?: React.ReactNode
  /**
   * 自定义外部容器 className
   */
  customClassName?: string
  /**
   * 自定义外部容器 style
   */
  customStyle?: string | React.CSSProperties
  /**
   * 默认中间内容部分是平分的，如果想中间内容部分的大小能够占满剩下（不包括右侧胶囊的空间）空间，可开启该属性
   */
  greedy?: boolean
  /**
   * 返回事件
   */
  back?: Function
  /**
   * 标题颜色
   */
  titleColor?: string
  /**
   * 返回icon，默认 ChevronLeft
   */
  backIconName?: string
  /**
   * 返回icon，默认 #252D37
   */
  backIconColor?: string
  /** 显示返回按钮 */
  showBack?: boolean
  /** 显示右侧 Extra */
  showExtra?: boolean
}

const NavBar: React.FC<NavBarProps> = (props: NavBarProps) => {
  const {
    customRenderLeft,
    title,
    extra,
    customClassName,
    customStyle,
    greedy,
    back,
    titleColor,
    backIconName,
    backIconColor,
    showBack,
    showExtra,
  } = props
  const [menuRect, setMenuRect] = useState<Taro.getMenuButtonBoundingClientRect.Rect>({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
  })
  const { statusBarHeight } = useStatusBarHeight()

  const getMenuRect = () => {
    const res = getMenuButtonBoundingClientRect()
    setMenuRect(res)
  }

  useEffect(() => {
    getMenuRect()
  }, [])

  const navBarCls = classNames('nav-bar', customClassName, {
    'nav-bar__greedy': greedy,
  })

  const navHeight = statusBarHeight + menuRect.height + (menuRect.top - statusBarHeight) * 2

  const handleBack = () => {
    if (back) {
      back()
      return
    }
    if (IS_WEB) {
      window.history.back()
    } else {
      Router.navigateBack()
    }
  }

  return (
    <View
      className={navBarCls}
      style={`padding-top: ${statusBarHeight + 'PX'};height: ${navHeight + 'PX'};${customStyle}`}
    >
      <View className="nav-bar-left-view">
        {showBack && (
          <>
            {!customRenderLeft ? (
              <View className="nav-bar-left-arrow" hoverClass="nav-bar-left-arrow__hover" onClick={handleBack}>
                <Icons name={backIconName} size={24} color={backIconColor} />
              </View>
            ) : (
              customRenderLeft
            )}
          </>
        )}
        <View className="nav-bar-title" style={{ color: titleColor }}>
          {title}
        </View>
      </View>
      {showExtra && <View className="nav-bar-right-view">{extra}</View>}
    </View>
  )
}

NavBar.defaultProps = {
  customRenderLeft: undefined,
  title: undefined,
  extra: undefined,
  customClassName: '',
  customStyle: '',
  greedy: false,
  backIconName: 'ChevronLeft',
  backIconColor: THEME_COLORS.title,
  showBack: true,
  showExtra: true,
}

export default NavBar
