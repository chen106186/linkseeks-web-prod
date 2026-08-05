import React from 'react'
import cx from 'classnames'
import BrandItem from './item'
import styles from '../index.less'

export interface BrandListProps {
  className: string
  activeType?: number
}

type ItemProps = {
  Item: typeof BrandItem
}

const BrandList: React.FC<BrandListProps> & ItemProps = (props) => {
  const { children, activeType, className, ...others } = props

  const classNameString = cx(styles['recommend_brand_list'], className)

  return activeType === 3 ? (
    <div className={classNameString} {...others}>
      {children &&
        React.Children.map(children, (child: any) => {
          return (
            <div className={styles['recommend_brand_list_item']}>{child}</div>
          )
        })}
    </div>
  ) : null
}

BrandList.Item = BrandItem

export default BrandList
