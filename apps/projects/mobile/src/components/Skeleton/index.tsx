import React, { CSSProperties, useMemo } from 'react'
import { View } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { ViewStyle } from '@/types/global'
import './index.scss'

interface SkeletonType {
  Avatar: typeof Avatar
  List: typeof List
  Vertical: typeof Vertical
  Card: typeof Card
}

interface SkeletonPropsType {
  style?: ViewStyle
  width?: number | string
  height?: number
  borderRadius?: number
  animation?: boolean
}

interface SkeletonListPropsType {
  wrapStyle?: ViewStyle
  style?: ViewStyle
  column: number
  row: number
  item: any
}

interface VerticalPropsType {
  style?: ViewStyle
}

/** Card */
interface ICardProps {
  row?: number
}

const Skeleton: SkeletonType & React.FC<SkeletonPropsType> = (props) => {
  const { children, style, height, borderRadius, animation = true } = props

  const mergeStyle = Object.assign(
    {
      height,
      borderRadius,
    },
    style,
  )

  return (
    <View style={mergeStyle} className={`skeleton-item ${animation ? 'animation' : ''}`}>
      {children}
    </View>
  )
}

const Avatar: React.FC<SkeletonPropsType> = (props) => {
  const { children, style, width, height, borderRadius } = props

  const mergeStyle: ViewStyle = Object.assign(
    {
      width,
      height,
      borderRadius,
    },
    style,
  )
  return (
    <View style={mergeStyle} className="skeleton-avatar">
      {children}
    </View>
  )
}

const Vertical: React.FC<VerticalPropsType> = (props) => {
  const { children, style } = props

  const mergeStyle: ViewStyle = Object.assign(
    {
      flexDirection: 'column',
    },
    style,
  )

  return <View style={mergeStyle}>{children}</View>
}

const List: React.FC<SkeletonListPropsType> = (props) => {
  const { column, row, item, style, wrapStyle } = props
  const dataList: number[] = []
  for (let i = 0; i < column * row; i += 1) {
    dataList.push(i)
  }
  const itemWidth = Math.floor(100 / column)

  const mergeStyle: ViewStyle = Object.assign(
    {
      width: `${itemWidth}%`,
    },
    style,
  )

  return (
    <View className={`skeleton-list`} style={wrapStyle}>
      {dataList.map((dataItem) => (
        <View key={`skeleton_list_item_${dataItem}`} className="skeletonlist-item" style={mergeStyle}>
          {item}
        </View>
      ))}
    </View>
  )
}

const Card: React.FC<ICardProps> = (props: ICardProps) => {
  const { row = 1 } = props
  const rowsData = useMemo(() => new Array(row).fill(0), [row])

  return (
    <View className="card">
      <View className="card-title" />
      <View className="card-content">
        {rowsData.map((_item, _index) => (
          <View className="item" key={_item + _index}>
            <View className="image" />
            <View className="info">
              <View className="text" style={{ width: '85%' }} />
              <View className="text" style={{ width: '45%' }} />
              <View className="text" style={{ width: '75%', marginTop: pxTransform(24) }} />
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

Skeleton.Avatar = Avatar
Skeleton.List = List
Skeleton.Vertical = Vertical
Skeleton.Card = Card

Skeleton.defaultProps = {
  height: 32,
  borderRadius: 0,
}

Avatar.defaultProps = {
  height: 48,
  width: 48,
  borderRadius: 0,
}

export default Skeleton
