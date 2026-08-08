import React, { useMemo } from 'react'
import { chunk } from 'lodash'
import classNames from 'classnames'
import { ScrollView as TaroScrollView, View } from '@tarojs/components'
import { GodScrollViewProps } from '../../types/scroll-view'

const ScrollView: React.FC<GodScrollViewProps> = (props: GodScrollViewProps) => {
  const {
    listEmptyComponent,
    listFooterComponent,
    listHeaderComponent,
    itemSeparatorComponent,
    horizontal,
    refreshing,
    children,
    data,
    onEndReachedThreshold,
    numColumns = 1,
    columnWrapperStyle,
    contentContainerStyle,
    className,
    renderItem,
    keyExtractor,
    onEndReached,
    onRefresh,
    ...other
  } = props
  const gridGroup = useMemo(() => chunk(data, numColumns), [data, numColumns])
  const rootCls = classNames('at-scroll-view', className)
  const childNodes = React.Children.map(children, (child: any) => {
    if (child && horizontal) {
      const childProps = child.props || {}
      return React.cloneElement(child, {
        ...childProps,
        style: { ...childProps.style, ...{ display: 'inline-block' } },
      })
    }
    return child
  })
  return (
    <TaroScrollView
      className={rootCls}
      scrollX={horizontal}
      scrollY={!horizontal}
      refresherTriggered={refreshing}
      lowerThreshold={onEndReachedThreshold || 50}
      onScrollToLower={onEndReached}
      refresherEnabled={!!onRefresh}
      onRefresherRefresh={onRefresh}
      {...other}
    >
      {/* {listHeaderComponent && !horizontal ? (typeof listHeaderComponent === 'function' ? listHeaderComponent?.() : listHeaderComponent) : null} */}
      <View style={{ display: 'flex', flexDirection: horizontal ? 'row' : 'column', ...contentContainerStyle }}>
        {listHeaderComponent &&
          (typeof listHeaderComponent === 'function' ? listHeaderComponent?.() : listHeaderComponent)}
        {gridGroup?.map((_groupItem: any, _groupIndex: any, arr) => {
          return (
            <View className="at-scroll-view-group" style={columnWrapperStyle} key={`_groupIndex_${_groupIndex}`}>
              <View className="at-scroll-view-group-row">
                {_groupItem?.map((_item, _index) => {
                  const _childIndex = Number(_groupIndex) * numColumns + Number(_index)
                  const _key = keyExtractor ? keyExtractor(_item, _childIndex) : _item?.key ?? _childIndex
                  return React.cloneElement(renderItem?.({ item: _item, index: _childIndex }) || <View />, {
                    key: _key,
                  })
                })}
              </View>
              {itemSeparatorComponent &&
                _groupIndex !== arr.length - 1 &&
                (typeof itemSeparatorComponent === 'function' ? itemSeparatorComponent?.() : itemSeparatorComponent)}
            </View>
          )
        })}
        {children && childNodes}
        {!data?.length
          ? listEmptyComponent && typeof listEmptyComponent === 'function'
            ? listEmptyComponent?.()
            : listEmptyComponent
          : null}
        {listFooterComponent &&
          (typeof listFooterComponent === 'function' ? listFooterComponent?.() : listFooterComponent)}
      </View>
      {/* {listFooterComponent && !horizontal ? (typeof listFooterComponent === 'function' ? listFooterComponent?.() : listFooterComponent) : null} */}
    </TaroScrollView>
  )
}

ScrollView.defaultProps = {
  horizontal: false,
  numColumns: 1,
}

export default ScrollView
