import React, { useMemo } from 'react'
import cx from 'classnames'

import styles from './index.less'

interface GiveContainerProps {
  children?: React.ReactNode[]
  className?: string
}

const GiveContainer: React.FC<GiveContainerProps> = (
  props: GiveContainerProps,
) => {
  const { children = [], className, ...other } = props
  const _children = useMemo(() => {
    if (children && !children.length) {
      return [children]
    } else {
      return children
    }
  }, [children])
  return (
    <div
      className={cx(styles[`lingxi-marketingCard-GiveContainer`], className)}
      {...other}
    >
      {_children}
    </div>
  )
}

export default GiveContainer
