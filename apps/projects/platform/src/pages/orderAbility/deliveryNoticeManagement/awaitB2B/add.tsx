/**
 * 订单能力 - 送货通知单管理 - 新增待提交送货通知单B2B
 * @author: Gavin
 */
import React, { useRef } from 'react'
import { useQuery } from '@linkseeks/router-core'
import AddEditContent from './components/AddEditContent'

const DeliveryNoticeManagementAwaitB2BAdd: React.FC = () => {
  const { time } = useQuery()

  const planData = JSON.parse(window.localStorage.getItem('NOTICE_PATH'))?.[time as string]

  return <AddEditContent type="add" planData={planData} btnCode="deliveryNoticeAwaitB2B.submit" />
}

export default DeliveryNoticeManagementAwaitB2BAdd
