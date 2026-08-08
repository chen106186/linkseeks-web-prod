import React from 'react';
import { View, Text, ScrollView } from '@apps/mobile-ui';
import classNames from 'classnames';
import { CommonEvent } from '@tarojs/components';
import './index.scss';


export interface TabItem {
  /**
   * 标题
   */
  title: string | React.ReactNode
}

export interface TabsProps {
  /**
  * 当前选中的标签索引值，从 0 计数，开发者需要通过 onClick 事件来改变 current，从而切换 tab
  * @default 0
  */
  current: number,
  /**
   * tab 列表
   */
  tabList: TabItem[],
  /**
  * 是否滚动，当标签太多时，建议使用。否则会出现部分标签被隐藏
  * @default false
  */
  scroll?: boolean,
  /**
   * 点击或滑动时触发事件
   */
  onClick: (index: number, event: CommonEvent) => void,
  height?: string,
}

const Tabs: React.FC<TabsProps> = (props) => {
  const { current, tabList, scroll, onClick, height, children } = props;
  const heightStyle = { height }
  const handleClick = (index: number, event: CommonEvent): void => {
    onClick(index, event)
  }

  const tabItems = tabList.map((item, idx) => {
    const itemCls = classNames({
      'tabs__item': true,
      'tabs__item--active': current === idx,
      'tabs__item--show': scroll,
    })

    return (
      <View
        className={itemCls}
        id={`tab-${idx}`}
        key={`tabs-item-${idx}`}
        onClick={(e) => handleClick(idx, e)}
      >
        {item.title}
        <View className='tabs__item-underline'></View>
      </View>
    )
  })

  return (
    <View className='tabs' style={heightStyle}>
      {scroll ? (
        <ScrollView
          horizontal
          className='tabs__header'
          style={heightStyle}
          scrollWithAnimation
        >
          {tabItems}
        </ScrollView>
      ) : (
        <View className='tabs__header'>
          {tabItems}
        </View>
      )}
      <View
        className='tabs__body'
      >
        <View
          className='tabs-transform'
          style={heightStyle}
        >
          <View className='tabs__underline' style={{ height: '1PX', width: `${tabList.length * 100}%` }}></View>
          {children}
        </View>
      </View>
    </View>
  )
}

Tabs.defaultProps = {
  current: 0,
  scroll: false,
  tabList: [],
  onClick: (): void => { }
}

export default Tabs;
