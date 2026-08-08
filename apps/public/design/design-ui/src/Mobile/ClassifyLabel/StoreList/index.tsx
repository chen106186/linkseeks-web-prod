import React from 'react'
import cx from 'classnames'
import styles from './index.less'

export interface StoreListProps {
  className: string
  activeType: number
}

/**
 * 分类标签-店铺列表
 * @param props
 * @returns
 */
const StoreList: React.FC<StoreListProps> = (props) => {
  const { activeType, className, ...others } = props

  const classNameString = cx(styles['store-list'], className)

  return activeType === 2 ? (
    <div className={classNameString} {...others}>
      StoreList
    </div>
  ) : null
}

export default StoreList
