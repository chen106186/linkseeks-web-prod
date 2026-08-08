import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import cx from 'classnames'

import styles from './index.less'

interface ItemsProps {
  name?: string
  defaultIcon?: any
  selectIcon?: any
  active?: boolean
  isnull?: boolean
  className?: any
  index?: any
  visible?: boolean
  tab?: (index: string) => void
}

const Items: React.FC<ItemsProps> = (props: ItemsProps) => {
  const {
    name,
    defaultIcon,
    selectIcon,
    active,
    className,
    isnull = true,
    visible = true,
    index,
    tab,
    ...other
  } = props
  const _other: any = { ...other }

  if (!visible) return null

  if (isnull) {
    return (
      <div
        className={cx(styles['lingxi-bottomNavigation-items-null'], className)}
        {...other}
        onClick={(e) => {
          tab && tab(index)
          _other.onClick(e)
        }}
      >
        <PlusOutlined />
      </div>
    )
  } else {
    return (
      <div
        className={cx(styles['lingxi-bottomNavigation-items'], className)}
        {...other}
        onClick={(e) => {
          tab && tab(index)
          _other.onClick(e)
        }}
      >
        <img src={active ? selectIcon : defaultIcon} />
        <div
          className={cx(
            styles['lingxi-bottomNavigation-items-title'],
            active ? styles.active : {},
          )}
        >
          {name}
        </div>
      </div>
    )
  }
}

export default Items
