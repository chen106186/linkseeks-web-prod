import React from 'react'
import PreLoading from '@/components/PreLoading'
import { BidDetailContext } from '@/pages/purchaseManage/procurement/_public/bid/context'
import { useBidDetail } from '@/pages/purchaseManage/procurement/_public/bid/effects/useBidDetail'
import BidDetailHeader from '@/pages/purchaseManage/procurement/components/bidDetailHeader'
import BidDetailSection from '@/pages/purchaseManage/procurement/components/bidDetailSection'
import OrderDetailWrapper from '@/pages/orderManage/components/OrderDetailWrapper'

const TenderSearchDetail: React.FC = () => {
  const { formContext, id } = useBidDetail({ type: 'tender' })
  const { data } = formContext

  const anchorTitleList = [
    { title: '流转进度', id: 'transferProcess', componentName: 'TransferProcess' },
    { title: '中标结果', id: 'bidResult', type: 'bidResult' },
    { title: '中标明细', id: 'bidParticulars', componentName: 'BidParticulars' },
    { title: '基本信息', id: 'baseicInfo', type: 'basicInfo' },
    // { title: '投标要求', id: 'tenderNeed', type: "bidNeed" },
    // { title: '投标其他要求', id: 'tenderOtherNeed', type: "otherNeed" },
    { title: '投标商品', id: 'tenderParticulars', componentName: 'BidParticulars' },
    { title: '流转记录', id: 'transferRecord', componentName: 'BidTransformRecord' },
  ]

  // 没有完成的标 隐藏中标结果、中标明细
  if (data?.isWin === null) {
    anchorTitleList.splice(1, 2)
  }
  // 未中标隐藏中标明细
  if (data?.isWin === false) {
    anchorTitleList.splice(2, 1)
  }

  return (
    <div className="common-scroll-wrap">
      <BidDetailContext.Provider value={formContext}>
        <BidDetailHeader formContext={formContext} anchorList={anchorTitleList} />
        <OrderDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <BidDetailSection formContext={formContext} anchorList={anchorTitleList} type="tender" />
          </PreLoading>
        </OrderDetailWrapper>
      </BidDetailContext.Provider>
    </div>
  )
}

export default TenderSearchDetail
