import React, { useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import cx from 'classnames'

import styles from './index.less'

interface CollageContainerItemProps {
  // 详情数据
  detail: any
  // 是否激活
  active: boolean
  // 是否为空状态
  isnull?: boolean
  tab?: (detail: any) => void
  className?: string
}

const CollageContainerItem: React.FC<CollageContainerItemProps> = (
  props: CollageContainerItemProps,
) => {
  const { detail, active, isnull = true, tab, className, ...other } = props
  const _other: any = { ...other }

  useEffect(() => {
    tab?.(detail)
  }, [active])

  if (isnull) {
    return (
      <div
        className={cx(
          styles[`lingxi-marketingCard-collageContainer-item-null`],
          className,
        )}
        {...other}
      >
        <PlusOutlined />
      </div>
    )
  } else {
    return (
      <div
        className={cx(
          styles[`lingxi-marketingCard-collageContainer-item`],
          className,
        )}
        style={
          active
            ? { padding: 0, border: '1px solid #c1c1c1', borderRadius: 4 }
            : {}
        }
        {...other}
      >
        <img src={detail.img} />
      </div>
    )
  }
}

export default CollageContainerItem
