import React, { useCallback, useRef, useState } from 'react'
import { Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import PreLoading from '@/components/PreLoading'
import { usePageStatus } from '@/hooks/usePageStatus'
import { BidDetailContext } from '../_public/bid/context'
import { useBidDetail } from '@/pages/purchaseManage/procurement/_public/bid/effects/useBidDetail'
import BidDetailHeader from '@/pages/purchaseManage/procurement/components/bidDetailHeader'
import BidDetailSection from '@/pages/purchaseManage/procurement/components/bidDetailSection'
import ApprovedModal from '@/pages/purchaseManage/procurement/components/approvedModal'
import OrderDetailWrapper from '@/pages/orderManage/components/OrderDetailWrapper'

const FirstCheckedBidDetail: React.FC = () => {
  const { formContext, id } = useBidDetail({ type: 'callForBid' })
  const { data } = formContext
  const approvedRef = useRef<any>({})
  const { action = null }: any = usePageStatus()

  const [loading, setLoading] = useState<boolean>(false)

  const handleClick = useCallback(() => {
    approvedRef.current.setVisible(true)
  }, [])

  // 提交审核表单
  const handleSubmit = useCallback(() => {
    approvedRef.current.actions.submit().then(async ({ values }) => {
      const params = {
        id: Number(id),
        ...values,
      }

      // postPurchaseInviteTenderPlatformPlatformCheckInviteTender(params).then(res => {
      //   setLoading(true)
      //   if(res.code === 1000) {
      //     approvedRef.current.setVisible(false)
      //     history.goBack()
      //   }
      // }).finally(() => setLoading(false))
    })
  }, [])

  const anchorTitleList = [
    { title: '流转进度', id: 'transferProcess', componentName: 'TransferProcess' },
    { title: '基本信息', id: 'baseicInfo', type: 'basicInfo' },
    { title: '招标物料', id: 'bidMaterial', componentName: 'BidMaterial' },
    { title: '招标要求', id: 'bidNeed', type: 'bidNeed' },
    { title: '报名要求', id: 'registerNeed', type: 'registerNeed' },
    { title: '资格预审要求', id: 'checkNeed', type: 'checkNeed' },
    { title: '评标要求', id: 'remarkNeed', type: 'remarkNeed' },
    { title: '其他要求', id: 'otherNeed', type: 'otherNeed' },
    { title: '招标方式', id: 'bidWay', componentName: 'BidMethod' },
    { title: '流转记录', id: 'transferRecord', componentName: 'BidTransformRecord' },
  ]

  // 勾选资格预审 才有资格预审信息
  if (!data?.isQualificationCheck) {
    anchorTitleList.forEach((ele, index) => ele['title'] === '资格预审要求' && anchorTitleList.splice(index, 1))
  }

  return (
    <div className="common-scroll-wrap">
      <BidDetailContext.Provider value={formContext}>
        <BidDetailHeader
          formContext={formContext}
          anchorList={anchorTitleList}
          extraRight={
            action ? (
              <Button type="primary" onClick={handleClick}>
                单据审核
              </Button>
            ) : null
          }
        />
        <OrderDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <BidDetailSection formContext={formContext} anchorList={anchorTitleList} type="callForBid" />
          </PreLoading>
        </OrderDetailWrapper>

        {/* 点击审核触发的弹窗集合 */}
        <ApprovedModal currentRef={approvedRef} onConfirm={handleSubmit} loading={loading} title="单据审核" />
      </BidDetailContext.Provider>
    </div>
  )
}

export default FirstCheckedBidDetail
