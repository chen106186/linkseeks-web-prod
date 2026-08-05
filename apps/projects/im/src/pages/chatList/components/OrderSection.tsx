import React, { useEffect, useMemo, useRef, useState } from 'react'
import { LineTitle } from '@apps/components'
import './index.less'
import { Button, Descriptions } from '@linkseeks/ui'
import { useRequestApi } from '@linkseeks/hooks'
import { getOrderBuyerPage, getOrderVendorPage } from '@apps/apis'
import { sendCustomMessage } from '../sendCustomMessage'
import { isPC, useUIKit, useUIManager } from '../../../components/TUIKit'
import { useInfiniteScroll } from './useInfiniteScroll'
import { authService } from '@apps/services'

const OrderSection = (props) => {
  const { isModal = false, onSubmit } = props || {}
  const { findUserProfileByUserId } = useUIKit()
  const { conversation: contextConversation } = useUIManager('TUIChat')
  const auth = authService.getAuth()
  const roleType = auth.roleTag
  const memberId = findUserProfileByUserId(contextConversation?.userProfile?.userID)?.userProfile?.memberId
  const {
    data: pageData,
    containerRef,
    refreshInitData,
  } = useInfiniteScroll(roleType === 1 ? getOrderBuyerPage : getOrderVendorPage, {
    memberId,
    current: '1',
  })

  useEffect(() => {
    if (memberId) {
      refreshInitData({ memberId: memberId == 1 ? undefined : memberId, current: '1', pageSize: '10' })
    }
  }, [memberId])
  const sendMessage = (v, type) => {
    sendCustomMessage(v, type)
    onSubmit && onSubmit()
  }
  return (
    <div className={isModal ? 'extra-section modal' : 'extra-section'}>
      <LineTitle>最近订单</LineTitle>
      <div className="extra-list-container" ref={containerRef}>
        {pageData?.data?.map((v) => {
          return (
            <div className="extra-order-container" key={v.orderId}>
              <Descriptions
                column={isPC ? 2 : 1}
                size="small"
                labelStyle={{ width: 96, fontWeight: 700, color: '#aaa' }}
              >
                <Descriptions.Item label="订单号" style={{ paddingRight: 8 }}>
                  {v.orderNo}
                </Descriptions.Item>
                <Descriptions.Item label="订单金额">{v.amount}</Descriptions.Item>
                <Descriptions.Item label="订单摘要" span={2}>
                  {v.digest}
                </Descriptions.Item>
                <Descriptions.Item label="下单时间" span={2}>
                  {v.createTime}
                </Descriptions.Item>
                <Descriptions.Item label="订单状态" style={{ paddingRight: 8 }}>
                  {v.outerStatusName}
                </Descriptions.Item>
                <Descriptions.Item label="订单类型">{v.orderTypeName}</Descriptions.Item>
              </Descriptions>

              <div className="extra-order-ctl">
                <Button type="primary" size="small" onClick={() => sendMessage(v, 'order')}>
                  发送
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderSection
