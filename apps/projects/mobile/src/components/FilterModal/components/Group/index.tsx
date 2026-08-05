/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-06 11:41:45
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-10 18:42:52
 * @Description: 豆腐组
 */
import React from 'react'
import { View } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import './index.scss'

export interface DataSourceItem {
  /**
   * 名称
   */
  name: string
  /**
   * 值
   */
  value: number | string
}

interface IProps {
  /**
   * 组名
   */
  title?: string
  /**
   * 数据
   */
  dataSource: DataSourceItem[]
  /**
   * 列数，默认 3列
   */
  column?: number
  /**
   * 当前选中值
   */
  value: number | string
  /**
   * 子项点击触发事件
   */
  onClick?: (value: number | string) => void
}

const Group: React.FC<IProps> = (props: IProps) => {
  const { title, dataSource, column = 3, value, onClick } = props

  const itemWidth = +(100 / column).toFixed(3)

  const handleItemClick = (next: number | string) => {
    if (onClick) {
      onClick(next)
    }
  }

  return (
    <View className="filter-query-group">
      {title ? <View className="filter-query-group-title">{title}</View> : null}
      <View
        className="filter-query-group-content"
        style={{
          paddingTop: pxTransform(title ? 0 : 18),
        }}
      >
        {dataSource.map((item) => (
          <View
            key={item.value}
            className="filter-query-group-item"
            style={{
              width: `${itemWidth}%`,
            }}
            onClick={() => handleItemClick(item.value)}
          >
            <View
              className={`filter-query-group-item-main ${
                value === item.value && 'filter-query-group-item-main__active'
              }`}
            >
              <View
                className={`filter-query-group-item-txt ${
                  value === item.value && 'filter-query-group-item-txt__active'
                }`}
              >
                {item.name}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

Group.defaultProps = {
  title: '',
  column: 3,
  onClick: undefined,
}

export default Group
