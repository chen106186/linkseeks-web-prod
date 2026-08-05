import React from 'react'
import ShopCommodityItem from './item'
import styles from './index.less'

type ItemProps = {
  Item: typeof ShopCommodityItem
}

interface ShopCommodityProps {
  style?: React.CSSProperties
}

const ShopCommodity: React.FC<ShopCommodityProps> & ItemProps = (props) => {
  const { children, style } = props

  return (
    <div className={styles['shop-commodity']} style={style}>
      {children}
    </div>
  )
}

ShopCommodity.Item = ShopCommodityItem

export default ShopCommodity
