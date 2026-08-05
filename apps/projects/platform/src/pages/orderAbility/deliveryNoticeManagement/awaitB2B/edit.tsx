/**
 * 订单能力 - 送货通知单管理 - 修改待提交送货通知单B2B
 * @author: Gavin
 */
import React, { useRef } from 'react'
import { useQuery } from '@linkseeks/router-core'
import AddEditContent from './components/AddEditContent'

const DeliveryNoticeManagementAwaitB2BEdit: React.FC = () => {
  const { id } = useQuery()

  return <AddEditContent type="edit" id={id as string} btnCode="deliveryNoticeAwaitB2B.submit" />
}

export default DeliveryNoticeManagementAwaitB2BEdit
