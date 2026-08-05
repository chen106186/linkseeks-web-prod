import React from 'react'
import { View } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import styles from './index.module.scss'
import cx from 'classnames'

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
    <View className={styles['filter-query-group']}>
      {title ? <View className={styles['filter-query-group-title']}>{title}</View> : null}
      <View
        className={styles['filter-query-group-content']}
        style={{
          paddingTop: pxTransform(title ? 0 : 18),
        }}
      >
        {dataSource.map((item) => (
          <View
            key={item.value}
            className={styles['filter-query-group-item']}
            style={{
              width: `${itemWidth}%`,
            }}
            onClick={() => handleItemClick(item.value)}
          >
            <View
              className={cx(styles['filter-query-group-item-main'], value === item.value && styles['filter-query-group-item-main__active'])}
            >
              <View
                className={cx(styles['filter-query-group-item-txt'], value === item.value && styles['filter-query-group-item-txt__active'])}
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
