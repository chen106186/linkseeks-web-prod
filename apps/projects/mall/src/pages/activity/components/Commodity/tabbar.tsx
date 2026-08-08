import React from 'react'
import cx from 'classnames'
import styles from './tabbar.module.less'

interface Iprops {
  tabProps: any
  isMeal?: boolean
  onChange?: (key: string) => void
}

const Tabbar: React.FC<Iprops> = (props: Iprops) => {
  const { tabProps, isMeal = false, onChange } = props
  const tabInfo = tabProps?.panes?.map((_item: { key: any; props: any }) => {
    const { key, props: _itemProps } = _item
    return {
      tab: _itemProps.tab,
      key,
    }
  })

  const handleChange = (key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(key)
  }

  return (
    <div className={styles.customizeTabBar}>
      {tabInfo?.map((_item: any) => {
        return (
          <span
            onClick={(e) => handleChange(_item.key, e)}
            key={_item.key}
            className={cx(styles.tabbarItem, {
              [styles.mealTab]: isMeal,
              [styles.activeTabbar]: _item.key === tabProps.activeKey,
            })}
          >
            {_item.tab}
          </span>
        )
      })}
    </div>
  )
}

export default Tabbar
