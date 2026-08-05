/**
 * 订单能力 - 送货通知单管理 - 新增待提交送货通知单SRM
 * @author: Gavin
 * @description: 与B2B内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import React, { useRef } from 'react'
import { useQuery } from '@linkseeks/router-core'
import AddEditContent from './components/AddEditContent'

const DeliveryNoticeManagementAwaitSRMAdd: React.FC = () => {
  const { time } = useQuery()

  const planData = JSON.parse(window.localStorage.getItem('NOTICE_PATH'))?.[time as string]

  return <AddEditContent type="add" planData={planData} btnCode="deliveryNoticeAwaitSRM.submit" />
}

export default DeliveryNoticeManagementAwaitSRMAdd
