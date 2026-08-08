import React from 'react'
import cx from 'classnames'
import styles from './index.less'

export interface BrandListProps {
  className: string
  activeType: number
}

/**
 * 分类标签-品牌列表
 * @param props
 * @returns
 */
const BrandList: React.FC<BrandListProps> = (props) => {
  const { activeType, className, ...others } = props

  const classNameString = cx(styles['brand-list'], className)

  return activeType === 3 ? (
    <div className={classNameString} {...others}>
      BrandList
    </div>
  ) : null
}

export default BrandList
