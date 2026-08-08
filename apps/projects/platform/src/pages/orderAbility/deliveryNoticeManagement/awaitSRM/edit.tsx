/**
 * 订单能力 - 送货通知单管理 - 修改待提交送货通知单SRM
 * @author: Gavin
 * @description: 与B2B内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import React, { useRef } from 'react'
import { useQuery } from '@linkseeks/router-core'
import AddEditContent from './components/AddEditContent'

const DeliveryNoticeManagementAwaitSRMEdit: React.FC = () => {
  const { id } = useQuery()

  return <AddEditContent type="edit" id={id as string} btnCode="deliveryNoticeAwaitSRM.submit" />
}

export default DeliveryNoticeManagementAwaitSRMEdit
