import React, { ComponentClass,CSSProperties } from 'react'

import GodComponent from './base'
import { ScrollViewProps } from '@tarojs/components/types/ScrollView'

export interface GodScrollViewProps extends GodComponent, ScrollViewProps {
  // 列表为空时渲染该组件。可以是 React Component, 也可以是一个 render 函数，或者渲染好的 element
  listEmptyComponent?: Function  | React.ReactElement | null,
  // 尾部组件。可以是 React Component, 也可以是一个 render 函数，或者渲染好的 element
  listFooterComponent?: Function | React.ReactElement | null,
  // 头部组件。可以是 React Component, 也可以是一个 render 函数，或者渲染好的 element
  listHeaderComponent?: Function | React.ReactElement | null,
  // 行与行之间的分隔线组件。不会出现在第一行之前和最后一行之后
  itemSeparatorComponent?: Function | React.ReactElement | null,
  // 设置为 true 则变为水平布局模式
  horizontal?: boolean,
  data?: any[],
  children?: React.ReactNode[] | React.ReactElement,
  // 在等待加载新数据时将此属性设为 true，列表就会显示出一个正在加载的符号
  refreshing?: boolean,
  // 决定当距离内容最底部还有多远时触发onEndReached回调 距离为像素
  onEndReachedThreshold?: number,
  numColumns?: number,
  // 如果设置了多列布局（即将numColumns值设为大于 1 的整数），则可以额外指定此样式作用在每行容器上
  columnWrapperStyle?: string | CSSProperties,
  // 这些样式会应用到一个内层的内容容器上，所有的子视图都会包裹在内容容器内
  contentContainerStyle?: CSSProperties,
  // 从data中挨个取出数据并渲染到列表中
  renderItem?: ({item,index}:{item:any,index:any}) => React.ReactElement | null,
  // 此函数用于为给定的 item 生成一个不重复的 key
  keyExtractor?: (item: any,index:number) => string | null,
  // 当列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用
  onEndReached?: () => void,
  // 下拉刷新
  onRefresh?: () => void,
}

declare const GodScrollView: ComponentClass<GodScrollViewProps>

export default GodScrollView
