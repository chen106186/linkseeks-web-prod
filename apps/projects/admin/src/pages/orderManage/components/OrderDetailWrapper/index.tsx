import React from 'react'
import style from './index.less'

export interface OrderDetailWrapperProps {}

const OrderDetailWrapper: React.FC<OrderDetailWrapperProps> = (props) => {
  return <div className={style.wrapper}>{props.children}</div>
}

OrderDetailWrapper.defaultProps = {}

export default OrderDetailWrapper
