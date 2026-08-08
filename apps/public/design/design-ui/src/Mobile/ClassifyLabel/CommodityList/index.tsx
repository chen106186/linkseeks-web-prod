import React from 'react'
import cx from 'classnames'
import styles from './index.less'

export interface CommodityListProps {
  className: string
  activeType: number
  clientWidth: number
}

/**
 * 分类标签-商品列表
 * @param props
 * @returns
 */
const CommodityList: React.FC<CommodityListProps> = (props) => {
  const { activeType, className, clientWidth, ...others } = props

  const classNameString = cx(styles['commodity-list'], className)

  return activeType === 1 ? (
    <div className={classNameString} style={{ width: clientWidth }} {...others}>
      CommodityList
    </div>
  ) : null
}

export default CommodityList
