import React, { useEffect, useState } from 'react'
import { LineTitle } from '@apps/components'
import './index.less'
import { Button, Descriptions, Tabs } from '@linkseeks/ui'
import { sendCustomMessage } from '../sendCustomMessage'
import { isPC, useUIKit, useUIManager } from '../../../components/TUIKit'
import { useInfiniteScroll } from './useInfiniteScroll'
import { useApi } from '../useApi'
const Container = (props) => {
  const { data: pageData, containerRef, refreshInitData } = useInfiniteScroll(props.api, { current: '1' })
  const { findUserProfileByUserId } = useUIKit()
  const { conversation: contextConversation } = useUIManager('TUIChat')
  const memberId = findUserProfileByUserId(contextConversation?.userProfile?.userID)?.userProfile?.memberId
  const sendMessage = (v, type) => {
    sendCustomMessage(v, type, props.afterIndex)
    props.onSubmit && props.onSubmit()
  }

  useEffect(() => {
    if (memberId) {
      refreshInitData({ current: '1', pageSize: '10', memberId: memberId == 1 ? undefined : memberId })
    }
  }, [memberId])
  return (
    <div className="extra-list-container" ref={containerRef}>
      {pageData?.data.map((v) => {
        return (
          <div className="extra-order-container" key={v.id}>
            <Descriptions column={isPC ? 2 : 1} size="small" labelStyle={{ width: 96, fontWeight: 700, color: '#aaa' }}>
              <Descriptions.Item label="申请单号" style={{ paddingRight: 8 }}>
                {v.applyNo}
              </Descriptions.Item>
              <Descriptions.Item label="单据时间">{v.applyTime}</Descriptions.Item>
              <Descriptions.Item label="申请单摘要" span={2}>
                {v.applyAbstract}
              </Descriptions.Item>
              <Descriptions.Item label="申请单状态" style={{ paddingRight: 8 }}>
                {v.innerStatusName}
              </Descriptions.Item>
            </Descriptions>
            <div className="extra-order-ctl">
              <Button type="primary" size="small" onClick={() => sendMessage(v, 'after')}>
                发送
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
const AfterSection = (props) => {
  const { isModal = false, onSubmit } = props || {}
  const [afterType, setAfterType] = useState('1')
  const { afterApi } = useApi(afterType)
  const items = [
    {
      label: '换货',
      key: '1',
      children: <Container afterIndex={'1'} onSubmit={onSubmit} api={afterApi} />,
    },
    {
      label: '退货',
      key: '2',
      children: <Container afterIndex={'2'} onSubmit={onSubmit} api={afterApi} />,
    },
    // { label: '维修', key: '3', children: <Container afterIndex={'3'} onSubmit={onSubmit} api={getAsRepairGoodsPageByConsumer} /> },
  ]
  return (
    <div className={isModal ? 'extra-section modal' : 'extra-section'}>
      <LineTitle>售后单</LineTitle>
      <Tabs destroyInactiveTabPane items={items} onChange={setAfterType} activeKey={afterType}></Tabs>
    </div>
  )
}

export default AfterSection
