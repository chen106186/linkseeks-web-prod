import React, { useEffect, useState } from 'react'
import styles from './index.less'
import classNames from 'classnames'
import { Chat, ConversationList, UIKitProvider } from '../../components/TUIKit'
import { message, Modal } from '@linkseeks/ui'
import OrderSection from '../chatList/components/OrderSection'
import CommoditySection from '../chatList/components/CommoditySection'
import AfterSection from '../chatList/components/AfterSection'
import { useToggle } from '@linkseeks/hooks'
import { useQuery } from '@linkseeks/router-core'
import { useChatPicker } from '../useChatPicker'
import engine from '@tencentcloud/chat-uikit-engine'
/**
 * 移动端使用的
 */
const ChatRoom = () => {
  const [targetChatID, setTargetChatID] = useState('')

  const { conversationID } = useQuery()
  const { extraPicker, orderToggle, orderVisible, commodityToggle, commodityVisible, afterToggle, afterVisible } =
    useChatPicker()
  useEffect(() => {
    if (conversationID && !targetChatID) {
      engine.TUIConversation.getConversationProfile(conversationID)
        .then((res) => {
          engine.TUIConversation.switchConversation(conversationID)
            .then((res) => {
              setTargetChatID(conversationID)
            })
            .catch((err) => {
              // 会话创建异常
              message.error(err.message)
            })
        })
        .catch((err) => {
          message.error('未找到对应的用户，请检查是否注册客服')
        })
    }
  }, [conversationID, targetChatID])

  const goRoom = (model) => {
    setTargetChatID(model.conversationID)
  }

  return (
    <UIKitProvider language="zh-CN">
      {targetChatID ? (
        <div style={{ display: 'flex', height: '100vh' }}>
          <Chat extraPickers={extraPicker} />
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.msgHeader}>
            <div className={styles.msgBox}>
              <div className={classNames(styles.msgCircle, styles.msgLeft)}></div>
              <div>在线客服</div>
            </div>
          </div>
          <div className={styles.msgList}>
            <ConversationList enableSearch={false} enableCreate={false} onSelectConversation={goRoom} />
          </div>
        </div>
      )}
      <Modal title="请选择你要咨询的订单" open={orderVisible} onCancel={orderToggle} footer={null}>
        <OrderSection onSubmit={orderToggle} />
      </Modal>
      <Modal title="请选择你要咨询的商品" open={commodityVisible} onCancel={commodityToggle} footer={null}>
        <CommoditySection onSubmit={commodityToggle} />
      </Modal>
      <Modal title="请选择你要咨询的售后单" open={afterVisible} onCancel={afterToggle} footer={null}>
        <AfterSection onSubmit={afterToggle} />
      </Modal>
    </UIKitProvider>
  )
}

export default ChatRoom
