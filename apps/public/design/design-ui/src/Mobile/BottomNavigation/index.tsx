import React, { useMemo, useState } from 'react'
import cx from 'classnames'

import Items from './Items'

import styles from './index.less'

interface BottomNavigationProps {
  children?: React.ReactNode[]
  className?: any
  [key: string]: any
}

type ItemProps = {
  Items: typeof Items
}

const BottomNavigation: React.FC<BottomNavigationProps> & ItemProps = (
  props: BottomNavigationProps,
) => {
  const { children, className, ...other } = props
  const [tabIndex, setTabIndex] = useState<any>()
  const _children = useMemo(() => {
    if (children && !children.length) {
      return children ? [children] : []
    } else {
      return children
    }
  }, [children])

  const _tabs = (index: string) => {
    setTabIndex(index)
  }
  return (
    <div
      className={cx(styles['lingxi-bottomNavigation'], className)}
      {...other}
    >
      {_children?.map((child: any, childIndex: any) => {
        return child
          ? React.cloneElement(child, {
              active: tabIndex === childIndex,
              index: childIndex,
              tab: _tabs,
            })
          : null
      })}
    </div>
  )
}

BottomNavigation.Items = Items

export default BottomNavigation
