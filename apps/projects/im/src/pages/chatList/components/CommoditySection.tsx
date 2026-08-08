import React, { useEffect } from 'react'
import { LineTitle } from '@apps/components'
import './index.less'
import { Button, Descriptions } from '@linkseeks/ui'
import { useRequestApi } from '@linkseeks/hooks'
import { getOrderBuyerPage, getProductMobileShopBrowseRecordGetBrowseRecordListAll } from '@apps/apis'
import { sendCustomMessage } from '../sendCustomMessage'
import { isPC, useUIKit, useUIManager } from '../../../components/TUIKit'
import { useInfiniteScroll } from './useInfiniteScroll'
const CommoditySection = (props) => {
  const { isModal = false, onSubmit } = props || {}
  const { findUserProfileByUserId } = useUIKit()
  const { conversation: contextConversation } = useUIManager('TUIChat')

  const memberId = findUserProfileByUserId(contextConversation?.userProfile?.userID)?.userProfile?.memberId

  const {
    data: pageData,
    containerRef,
    refreshInitData,
  } = useInfiniteScroll(getProductMobileShopBrowseRecordGetBrowseRecordListAll, {
    pageSize: '10',
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
      <LineTitle>最近浏览的商品</LineTitle>
      <div className="extra-list-container" ref={containerRef}>
        {pageData?.data.map((v) => {
          return (
            <div className="extra-order-container" key={v.id}>
              <Descriptions
                column={isPC ? 2 : 1}
                size="small"
                labelStyle={{ width: 96, fontWeight: 700, color: '#aaa' }}
              >
                <Descriptions.Item label="商品ID" style={{ paddingRight: 8 }}>
                  {v.commodityId || v.id}
                </Descriptions.Item>
                <Descriptions.Item label="商品品类">{v?.categoryName || v?.customerCategory?.name}</Descriptions.Item>
                <Descriptions.Item label="商品名称" span={2}>
                  {v?.commodityName || v.name}
                </Descriptions.Item>
                <Descriptions.Item label="品牌" style={{ paddingRight: 8 }}>
                  {v?.brandName || v?.brand?.name}
                </Descriptions.Item>
                <Descriptions.Item label="价格">
                  {v.min}-{v.max}
                </Descriptions.Item>
              </Descriptions>
              <div className="extra-order-ctl">
                <Button type="primary" size="small" onClick={() => sendMessage(v, 'commodity')}>
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

export default CommoditySection
