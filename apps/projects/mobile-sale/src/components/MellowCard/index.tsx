/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-30 15:35:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-11 11:23:45
 * @Description: 圆润的卡片
 */

import React, { CSSProperties } from 'react'
import { View, Text } from '@apps/mobile-ui'
import classNames from 'classnames'
import './index.scss'

interface MellowCardProps {
  /**
   * 外部标题
   */
  outerTitle?: React.ReactNode
  /**
   * 标题
   */
  title?: React.ReactNode
  /**
   * 标题右侧部分
   */
  extra?: React.ReactNode
  /**
   * 自定义外部标题样式
   */
  outerTitleStyle?: CSSProperties
  /**
   * 自定义样式
   */
  style?: CSSProperties
  /**
   * 自定义className
   */
  className?: string
  /**
   * head 自定义样式
   */
  headStyle?: CSSProperties
  /**
   * body 自定义样式
   */
  bodyStyle?: CSSProperties
  /**
   * 标题左侧边框
   */
  ribbon?: boolean

  children?: React.ReactNode
}

const MellowCard: React.FC<MellowCardProps> = (props: MellowCardProps) => {
  const { outerTitle, title, extra, outerTitleStyle, style, headStyle, bodyStyle, ribbon, children, className } = props

  // 这里包括一层，方便控制样式，如果传入的是非 string，则需要在外边自己编写样式
  const contentNode = typeof children !== 'object' ? <Text>{children}</Text> : children

  const titleNode = typeof title !== 'object' ? <Text className="mellow-card-head-title">{title}</Text> : title

  const outerTitleNode =
    typeof outerTitle !== 'object' ? (
      <Text className="mellow-card-outerTitle" style={outerTitleStyle}>
        {outerTitle}
      </Text>
    ) : (
      outerTitle
    )

  return (
    <>
      {outerTitle ? <View className="mellow-card-outerTitleWrap">{outerTitleNode}</View> : null}
      <View className={classNames('mellow-card', className)} style={style}>
        {(title || extra) && (
          <View
            className="mellow-card-head"
            style={{
              ...headStyle,
            }}
          >
            <View className="mellow-card-head-titleWrap">
              {ribbon && <View className="mellow-card-head-ribbon" />}
              {titleNode}
            </View>
            <View className="mellow-card-head-extra">{extra}</View>
          </View>
        )}
        <View
          className="mellow-card-body"
          style={{
            ...bodyStyle,
          }}
        >
          {contentNode}
        </View>
      </View>
    </>
  )
}

MellowCard.defaultProps = {
  outerTitle: null,
  title: null,
  extra: null,
  outerTitleStyle: {},
  style: {},
  headStyle: {},
  bodyStyle: {},
  ribbon: false,
  children: null,
}

export default MellowCard
