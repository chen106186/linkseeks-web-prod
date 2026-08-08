import React from 'react'
import { OrderDetailContext } from '../../_public/order/context'
import BasicInfoCardLayout from '../basicInfoCard'
import OrderMergeInfo from '../orderMergeInfo'
import OrderProductTable from '../orderProductTable'
import PaymentInfoCard from '../paymentInfoCard'

interface AddChangeCardProps {
  /**
   * 详情数据
   */
  formContext?: any
  /**
   * 变更数据
   */
  versionContext?: any
}

const AddChangeCard: React.FC<AddChangeCardProps> = (props) => {
  const { formContext, versionContext } = props
  return (
    <OrderDetailContext.Provider value={{ formContext, versionContext }}>
      <BasicInfoCardLayout />
      {versionContext?.detailBO?.paymentTypeNameChangeStatus ? <PaymentInfoCard /> : null}
      {!versionContext || versionContext?.detailBO?.productsChangeStatus ? (
        <OrderProductTable editable />
      ) : null}
      <OrderMergeInfo />
    </OrderDetailContext.Provider>
  )
}

export default AddChangeCard
