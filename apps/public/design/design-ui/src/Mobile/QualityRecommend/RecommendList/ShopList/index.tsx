import React from 'react'
import cx from 'classnames'
import ShopItem from './item'
import styles from '../index.less'

export interface ShopListProps {
  className: string
  activeType?: number
}

type ItemProps = {
  Item: typeof ShopItem
}

const ShopList: React.FC<ShopListProps> & ItemProps = (props) => {
  const { children, activeType, className, ...others } = props
  const classNameString = cx(styles['recommend_shop_list'], className)

  return activeType === 2 ? (
    <div className={classNameString} {...others}>
      {children &&
        React.Children.map(children, (child: any) => {
          return (
            <div className={styles['recommend_shop_list_item']}>{child}</div>
          )
        })}
    </div>
  ) : null
}

ShopList.Item = ShopItem

export default ShopList
