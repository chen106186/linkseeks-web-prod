import React from 'react'
import style from './index.less'

export interface BillDetailWrapperProps {}

const BillDetailWrapper: React.FC<BillDetailWrapperProps> = (props) => {
  return <div className={style.wrapper}>{props.children}</div>
}

BillDetailWrapper.defaultProps = {}

export default BillDetailWrapper
