import React, { PropsWithChildren } from 'react'
import style from './index.less'

export interface OrderDetailWrapperProps {}

const OrderDetailWrapper: React.FC<PropsWithChildren<OrderDetailWrapperProps>> = (props) => {
  return <div className={style.wrapper}>{props.children}</div>
}

OrderDetailWrapper.defaultProps = {}

export default OrderDetailWrapper
