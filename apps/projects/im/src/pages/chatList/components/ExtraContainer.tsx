import { Tabs } from '@linkseeks/ui'
import React from 'react'
import OrderSection from './OrderSection'
import CommoditySection from './CommoditySection'
import AfterSection from './AfterSection'
import { useUIKit, useUIManager } from '@/components/TUIKit'

const ExtraContainer = () => {
  const { conversation: contextConversation } = useUIManager('TUIChat')

  if (!contextConversation?.conversationID) {
    return <div>请先选择会话</div>
  }

  const items = [
    { label: '订单', key: '1', children: <OrderSection /> },
    { label: '商品', key: '2', children: <CommoditySection /> },
    { label: '售后', key: '3', children: <AfterSection /> },
  ]
  return <Tabs items={items} centered></Tabs>
}

export default ExtraContainer
