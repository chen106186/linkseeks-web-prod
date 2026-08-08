import React from 'react'
import { Commodity } from '@apps/design-ui'
import cs from 'classnames'
import styles from './index.less'

type CommodityType = React.ComponentProps<typeof Commodity>

type Iprops = Omit<CommodityType, 'mode'>

const Product: React.FC<Iprops> = (props: Iprops) => {
  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver, getOperateState, className, ...rest } =
    props as any
  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
  }
  const wrapClass = cs(className, styles.item)

  const isEmpty = typeof props.name === 'undefined' && typeof props.id === 'undefined'
  if (isEmpty) {
    return (
      <div className={wrapClass} {...divProps}>
        <Commodity mode="vertical" />
      </div>
    )
  }

  const commodityData = {
    name: props.name,
    image: props.mainPic,
    mode: 'vertical',
    tags: props.label,
    buyBtn: false,
    discountPrice: props.min,
  }

  return (
    <div className={wrapClass} {...divProps}>
      <Commodity {...commodityData} />
    </div>
  )
}

export default Product
