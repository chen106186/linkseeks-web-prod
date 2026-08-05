import React, { useMemo } from 'react'
import { MarketingCard } from '@apps/design-ui'
import cx from 'classnames'
import styles from './index.less'
import { Tooltip } from 'antd'

const { CouponsItem } = MarketingCard

interface Iprops {
  children: React.ReactNode
  className: string
  /** 控制显示隐藏 */
  visible: boolean
  onClick: () => void
  onMouseOver: () => void
  getOperateState: any
}

const Coupon: React.FC<Iprops> & { Item: typeof CouponItem } = (props: Iprops) => {
  const { children, className, visible = true, ...other } = props
  const classNameStr = cx(styles.container, className)
  const { onClick, onMouseOver, getOperateState } = other

  const divProps = {
    onClick,
    onMouseOver,
  }
  return (
    <>
      {(!!visible && (
        <Tooltip placement="topLeft" title="优惠券" arrowPointAtCenter>
          <div {...divProps} className={classNameStr}>
            {children}
          </div>
        </Tooltip>
      )) ||
        null}
    </>
  )
}

interface ItemIprops {
  children: React.ReactNode
  className: string
  onClick: () => void
  onMouseOver: () => void
  draggable?: false
  getOperateState: any
  belongName?: string
  belongType?: number
  denomination?: number
  getWay?: number
  getWayName?: string
  id?: number
  /** 1 => 平台， 2 商家  */
  type?: 1 | 2 | (number & {})
  typeName?: string
  useConditionMoney?: number
}

const CouponItem: React.FC<ItemIprops> = (props: ItemIprops) => {
  const { children, className, ...other } = props
  const { onClick, onMouseOver, getOperateState, ...rest } = other
  const { denomination, tag, useConditionMoney, typeName } = rest as any
  const divProps = {
    onClick,
    onMouseOver,
  }
  const isNotNull = useMemo(() => rest?.id && true, [rest])
  return (
    <div className={cx(styles.item)}>
      <div {...divProps} className={className}>
        <CouponsItem
          money={denomination}
          isnull={!isNotNull}
          typeName={typeName}
          tag={tag}
          info={`满${useConditionMoney}可用`}
          className={styles.couponItem}
        />
      </div>
    </div>
  )
}

Coupon.Item = CouponItem

export default Coupon
