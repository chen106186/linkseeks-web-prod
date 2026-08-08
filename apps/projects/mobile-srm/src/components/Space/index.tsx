/*
 * @Description: Space 间距组件
 */

import React from 'react'
import { View } from '@apps/mobile-ui'
import Item from './Item'
import './index.scss'

export const SpaceContext = React.createContext({
  latestIndex: 0,
  horizontalSize: 0,
  verticalSize: 0,
})

export type SizeType = 'small' | 'middle' | 'large' | ({} & number)

export type AlignType = 'start' | 'end' | 'center' | 'baseline'

export type JustifyType = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'

export type DirectionType = 'vertical' | 'horizontal'

export interface SpaceProps {
  /**
   * 间距大小，默认 middle
   */
  size?: SizeType | SizeType[]
  /**
   * 垂直对齐方式
   */
  align?: AlignType
  /**
   * 水平排列方式
   */
  justify?: JustifyType
  /**
   * 间距方向，默认 horizontal
   */
  direction?: DirectionType
  /**
   * 是否自动换行，仅在 horizontal 时有效
   */
  wrap?: boolean

  children?: React.ReactNode
}

const SIZE_MAP: { [key in SizeType]: number } = {
  small: 8,
  middle: 12,
  large: 16,
}

const ALIGN_MAP: { [key in AlignType]: string } = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  baseline: 'baseline',
}

const JUSTIFY_MAP: { [key in JustifyType]: string } = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  'space-around': 'space-around',
  'space-between': 'space-between',
  'space-evenly': 'space-evenly',
}

const DIRECTION_MAP: { [key in DirectionType]: any } = {
  vertical: 'column',
  horizontal: 'row',
}

function getNumberSize(size: SizeType) {
  return typeof size === 'string' ? SIZE_MAP[size] : size || 0
}

const Space: React.FC<SpaceProps> = (props: SpaceProps) => {
  const { size = 'middle', align, justify, direction = 'horizontal', wrap = false, children } = props

  const [horizontalSize, verticalSize] = React.useMemo(
    () => ((Array.isArray(size) ? size : [size, size]) as [SizeType, SizeType]).map((item) => getNumberSize(item)),
    [size],
  )

  const mergedAlign = align === undefined && direction === 'horizontal' ? 'center' : align
  const mergedJustify = justify === undefined && direction === 'horizontal' ? 'flex-start' : justify

  const marginDirection = 'marginRight'

  let latestIndex = 0
  const childNodes = React.Children.map(children, (child, i) => {
    if (child !== null && child !== undefined) {
      latestIndex = i
    }
    if (React.isValidElement(child)) {
      const key = (child && child.key) || `${i}`
      return (
        <Item key={key} direction={direction} index={i} marginDirection={marginDirection} wrap={wrap}>
          {child}
        </Item>
      )
    }
  })

  const spaceContext = React.useMemo(
    () => ({ horizontalSize, verticalSize, latestIndex }),
    [horizontalSize, verticalSize, latestIndex],
  )

  if (!childNodes || childNodes.length === 0) {
    return null
  }

  const gapStyle: React.CSSProperties = {}
  if (wrap) {
    gapStyle.flexWrap = 'wrap'
    gapStyle.marginBottom = -verticalSize
  }
  gapStyle.flexDirection = DIRECTION_MAP[direction]
  gapStyle.alignItems = ALIGN_MAP[mergedAlign!]
  gapStyle.justifyContent = JUSTIFY_MAP[mergedJustify!]

  return (
    <View
      className="space"
      style={{
        ...gapStyle,
      }}
    >
      <SpaceContext.Provider value={spaceContext}>{childNodes}</SpaceContext.Provider>
    </View>
  )
}

export default Space
