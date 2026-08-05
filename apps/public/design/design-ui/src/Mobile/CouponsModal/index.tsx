import React, { useMemo } from 'react'
import cx from 'classnames'
import bg from '../../img/red_package.png'
import styles from './index.less'

import CouponsItem from './CouponsItem'

interface CouponsModalProps {
  children?: React.ReactNode[]
  title?: string
  className?: any
}

type ItemProps = {
  CouponsItem: typeof CouponsItem
}

const CouponsModal: React.FC<CouponsModalProps> & ItemProps = (
  props: CouponsModalProps,
) => {
  const { children, title, className, ...other } = props
  const _children = useMemo(() => {
    if (children && !children.length) {
      return [children]
    } else {
      return children
    }
  }, [children])
  return (
    <div className={cx(styles['lingxi-couponsModal'], className)} {...other}>
      <div
        className={styles['lingxi-couponsModal-bg']}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={bg} />
      </div>
      <div className={styles['lingxi-couponsModal-title']}>{title}</div>
      <div
        className={styles['lingxi-couponsModal-container']}
        onClick={(e) => e.stopPropagation()}
      >
        {_children}
      </div>
    </div>
  )
}

CouponsModal.CouponsItem = CouponsItem

export default CouponsModal
