import React, { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { ConversationList, UIKitProvider, Chat, ChatSetting, useUIKit, useUIManager } from '../../components/TUIKit'
import styles from './index.less'
import ExtraContainer from './components/ExtraContainer'
import { useChatPicker } from '../useChatPicker'
import { Modal, Row, Col, CheckButtonGroup, CheckButton } from '@linkseeks/ui'
import OrderSection from '../chatList/components/OrderSection'
import CommoditySection from '../chatList/components/CommoditySection'
import AfterSection from '../chatList/components/AfterSection'
import { StandardFormTable, StandardModal } from '@apps/components'

import { useExtraTable } from './useExtraTable'
import { authService } from '@apps/services'
import { useQuery } from '@linkseeks/router-core'
import { TUIConversationService } from '@tencentcloud/chat-uikit-engine'
import { useRole } from '../useRole'
import { useApi } from './useApi'

const ChatList = (props) => {
  const { conversationID } = useQuery()
  const { extraPicker, orderToggle, orderVisible, commodityToggle, commodityVisible, afterToggle, afterVisible } =
    useChatPicker()
  const { findUserProfileByUserId } = useUIKit()
  const { conversation: contextConversation } = useUIManager('TUIChat')
  const { isAdmin, isConsumer, isSupplier, memberId: selfMemberId } = useRole()
  const memberId = findUserProfileByUserId(contextConversation?.userProfile?.userID)?.userProfile?.memberId
  // 如果我当前是供应商，则取的是我自己的id
  const commodityMemberId = isSupplier ? selfMemberId : memberId
  const [afterType, setAfterType] = useState([1])
  const { orderApi, commodityApi, afterApi } = useApi(afterType)
  const { orderColumns, commodityColumns, afterColumns, orderRef, commodityRef, afterRef, handleOk } =
    useExtraTable(afterType)

  useEffect(() => {
    if (conversationID) {
      TUIConversationService.switchConversation(conversationID)
    }
  }, [conversationID])

  const onOk = (type) => {
    handleOk(type, afterType)
    type === 'order' && orderToggle()
    type === 'commodity' && commodityToggle()
    type === 'after' && afterToggle()
  }
  // useEffect(() => {
  //   if (window.isNativeApp) {
  //     alert(12)
  //   }
  //   setTimeout(() => {
  //     console.log('定时器运行了', typeof window.ReactNativeWebView, typeof window.postMessage)
  //     window.ReactNativeWebView.postMessage(JSON.stringify({ data: 123 }))
  //     window.postMessage(JSON.stringify({ data: 123 }))
  //   }, 5000)
  //   // const result = window.ReactNativeWebView
  //   // if (result) {
  //   //   alert(typeof result)
  //   //   window.ReactNativeWebView.postMessage(JSON.stringify({ data: 123 }))
  //   // } else {
  //   //   alert('前端调试')
  //   // }
  // }, [])
  return (
    <div className={styles.container}>
      <div className={styles.slide}>
        <ConversationList isPC enableSearch={false} enableCreate={false} />
      </div>
      <div className={styles.content}>
        <div className={styles.body}>
          <div className={styles.chat}>
            <Chat extraPickers={extraPicker} />
          </div>
          <div className={styles.extraContainer}>{!isAdmin && <ExtraContainer />}</div>
        </div>
      </div>
      <StandardModal
        title="请选择你要咨询的订单"
        open={orderVisible}
        onCancel={orderToggle}
        width={1000}
        onOk={() => onOk('order')}
      >
        <StandardFormTable
          columns={orderColumns}
          request={orderApi}
          initalValue={{
            memberId,
          }}
          actionRef={orderRef}
          isRowSelection
          rowSelectionType="radio"
          rowKey="orderNo"
          refreshDeps={[memberId]}
          isCN
        />
      </StandardModal>
      <StandardModal
        title="请选择你要咨询的商品"
        open={commodityVisible}
        onCancel={commodityToggle}
        width={1000}
        onOk={() => onOk('commodity')}
      >
        <StandardFormTable
          columns={commodityColumns}
          request={(params) => commodityApi!({ ...params }, { ctlType: 'none' })}
          initalValue={{
            commodityMemberId,
          }}
          actionRef={commodityRef}
          isRowSelection
          rowSelectionType="radio"
          rowKey="id"
          refreshDeps={[commodityMemberId]}
          isCN
        />
      </StandardModal>
      <StandardModal
        title="请选择你要咨询的售后单"
        open={afterVisible}
        onCancel={afterToggle}
        width={1000}
        onOk={() => onOk('after')}
      >
        <Row>
          <Col span={4}>售后类型</Col>
          <Col>
            <CheckButtonGroup only value={afterType} onChange={setAfterType}>
              <CheckButton value={1}>换货</CheckButton>
              <CheckButton value={2}>退货</CheckButton>
              {/* <CheckButton value={3}>维修</CheckButton> */}
            </CheckButtonGroup>
          </Col>
        </Row>
        <StandardFormTable
          columns={afterColumns}
          request={afterApi}
          bodyStyle={{ padding: 0 }}
          initalValue={{
            memberId,
          }}
          refreshDeps={[afterType, memberId]}
          actionRef={afterRef}
          isRowSelection
          rowSelectionType="radio"
          rowKey="applyNo"
          isCN
        />
      </StandardModal>
    </div>
  )
}

export default () => {
  return (
    <UIKitProvider language="zh-CN">
      <ChatList />
    </UIKitProvider>
  )
}
