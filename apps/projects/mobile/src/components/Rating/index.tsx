import React, { CSSProperties, useEffect, useState } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Icons } from '@apps/mobile-ui'

export interface RatingProps {
  /** 评分数量 */
  count?: number

  /** 默认值 */
  defaultValue?: number

  // /** 当前值, 传入该字段后会导致该组件变为受控组件 */
  // value?: number,

  // /** 改变的回调, 会返回改变后的值, 和改变前的值 */
  // onChange?(value: number, prevValue?: number),

  // /** 是否禁用该组件 */
  // disabled?: boolean,

  /** 当前星级的大小, 未设置外部容器的情况下， size的大小也会决定容器的高度 */
  size?: number
  style?: CSSProperties
  /**
   * 给单项设置样式, 每一项都会继承
   */
  itemStyle?: CSSProperties

  /**
   * 间距
   */
  betweenSize?: number
}

const Rating: React.FC<RatingProps> = (props) => {
  const {
    size = 40,
    count = 5,
    defaultValue = 1,
    style = {},
    // disabled = false,
    itemStyle,
    betweenSize = 5,
  } = props

  const [starList, setStarList] = useState<boolean[]>([])

  useEffect(() => {
    setStarList(() => {
      return new Array(count).fill(true).map((_, i) => i < defaultValue)
    })
  }, [defaultValue])

  const renderChildren = starList.map((v, i) => (
    <View style={{ marginRight: pxTransform(betweenSize), ...itemStyle }} key={i}>
      <Icons name="StarFill" size={size} color={v ? '#ffb347' : '#ccc'} />
    </View>
  ))

  return <View style={{ ...style }}>{renderChildren}</View>
}

Rating.defaultProps = {}

export default Rating
