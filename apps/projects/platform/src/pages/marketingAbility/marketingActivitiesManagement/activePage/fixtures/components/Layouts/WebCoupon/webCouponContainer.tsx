import React from 'react'
import Coupon from '.'
import WebCard from '../WebCard'
import styles from './index.less'
import classNames from 'classnames'

interface Iprops {
  title: string
  children: React.ReactNode
  visible: boolean
  /** 以下是装修容器提供的属性 */
  className: string
  onMouseOver: () => void
  onClick: () => void
}

const WebCouponContainer: React.FC<Iprops> = (props: Iprops) => {
  const { title, children, className, onMouseOver, onClick, visible } = props

  const designProps = {
    onMouseOver,
    onClick,
  }

  if (!visible) {
    return null
  }

  const renderChildren = () => {
    return React.Children.map(children, (_child: any, _index) => {
      return (
        <div className={styles.couponItem} key={_index}>
          {React.cloneElement(_child, { ..._child.props })}
        </div>
      )
    })
  }

  return (
    <div className={classNames(styles.container, className)} {...designProps}>
      <WebCard title={title}>
        <div className={styles.couponList}>{renderChildren()}</div>
      </WebCard>
    </div>
  )
}

export default WebCouponContainer
