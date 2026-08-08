import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import cx from 'classnames'

import styles from './index.less'

interface ItemsProps {
  id?: string
  img?: any
  name?: any
  type?: any
  isnull?: boolean
  className?: string
  /** 显示状态 true: 显示，false: 隐藏 */
  status?: boolean
}

const Items: React.FC<ItemsProps> = (props: ItemsProps) => {
  const { img, className, status, isnull = true, ...other } = props

  if (!status) {
    return null
  }

  if (isnull) {
    return (
      <div
        className={cx(styles['lingxi-banner-items-null'], className)}
        {...other}
        style={{ display: 'flex' }}
      >
        <PlusOutlined />
      </div>
    )
  } else {
    return (
      <div className={cx(styles['lingxi-banner-items'], className)} {...other}>
        {img ? (
          <img className={styles['lingxi-banner-items-img']} src={img} />
        ) : (
          <PlusOutlined />
        )}
      </div>
    )
  }
}

Items.defaultProps = {
  status: true,
}

export default Items
