import React, { useEffect } from 'react'
import cx from 'classnames'
import { PlusOutlined } from '@ant-design/icons'

import styles from './index.less'

interface ItemsProps {
  children?: React.ReactNode[]
  className?: any
  // 名称
  title?: string
  // 说明
  explain?: string
  type?: any
  column?: number
  // 显示数量
  num?: number
  // 是否激活
  active?: boolean
  isnull?: boolean
  // 下标
  index: any
  visible?: boolean
  //点击方法
  tab?: (index: any) => void
  setBotChild?: (children: any) => void
}

const Items: React.FC<ItemsProps> = (props: ItemsProps) => {
  const {
    children,
    className,
    title,
    explain,
    active,
    index,
    visible = true,
    tab,
    setBotChild,
    isnull = true,
    ...other
  } = props
  const _other: any = { ...other }

  if (!visible) return null

  useEffect(() => {
    if (active) {
      let _child: any
      if (children && !children.length) {
        _child = children ? [children] : []
      } else {
        _child = children
      }
      setBotChild?.(_child)
    }
  }, [active, children])

  if (isnull) {
    return (
      <div
        className={cx(
          styles['lingxi-suggestProduct-items-null'],
          active && styles['active'],
          className,
        )}
        {...other}
        onClick={(e) => {
          tab?.(index)
          _other.onClick?.(e)
        }}
      >
        <PlusOutlined />
      </div>
    )
  } else {
    return (
      <div
        className={cx(
          styles['lingxi-suggestProduct-items'],
          active && styles['active'],
          className,
        )}
        {...other}
        onClick={(e) => {
          tab?.(index)
          _other.onClick?.(e)
        }}
      >
        <div className={styles['lingxi-suggestProduct-items-wrap']}>
          <div className={styles['lingxi-suggestProduct-items-wrap-title']}>
            {title}
          </div>
          <div className={styles['lingxi-suggestProduct-items-wrap-explain']}>
            {explain}
          </div>
        </div>
      </div>
    )
  }
}

Items.defaultProps = {
  column: 2,
}

export default Items
