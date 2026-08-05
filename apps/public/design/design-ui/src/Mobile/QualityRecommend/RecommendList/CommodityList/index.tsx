import React from 'react'
import cx from 'classnames'
import CommodityItem, { CommodityItemProps, EmptyCommodityItem } from './item'
import styles from '../index.less'

export interface CommodityListProps {
  className: string
  activeType?: number
  dataList: CommodityItemProps[]
}

type ItemProps = {
  Item: typeof CommodityItem
}

const CommodityList: React.FC<CommodityListProps> & ItemProps = (props) => {
  const { children, dataList, activeType, className, ...others } = props

  const classNameString = cx(styles['recommend_commodity_list'], className)

  return activeType === 1 ? (
    <div className={classNameString} {...others}>
      {children ? (
        React.Children.map(children, (child: any) => {
          return (
            <div className={styles['recommend_commodity_list_item']}>
              {child}
            </div>
          )
        })
      ) : dataList && dataList.length > 0 ? (
        dataList.map((item, index) => (
          <div
            className={styles['recommend_commodity_list_item']}
            key={`${item.name}-${index}`}
          >
            <CommodityItem {...item} />
          </div>
        ))
      ) : (
        <div className={styles['recommend_commodity_list_item']}>
          <EmptyCommodityItem />
        </div>
      )}
    </div>
  ) : null
}

CommodityList.Item = CommodityItem

export default CommodityList
