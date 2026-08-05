import React from 'react'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import { useBidDetail } from '@/pages/procurement/_public/bid/effects/useBidDetail'
import BidDetailHeader from '@/pages/procurement/components/bidDetailHeader'
import BidDetailSection from '@/pages/procurement/components/bidDetailSection'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const TenderSearchDetail: React.FC = () => {
  const { formContext } = useBidDetail({ type: 'callForBidInTender' })
  const { data } = formContext

  const anchorTitleList = [
    {
      title: intl.formatMessage({ id: 'table.purchase.liuzhuanjindu' }),
      id: 'transferProcess',
      componentName: 'TransferProcess',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.winBidResultLayout' }),
      id: 'bidResult',
      type: 'bidResult',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhongbiaomingxi' }),
      id: 'bidParticulars',
      componentName: 'BidParticulars',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }),
      id: 'baseicInfo',
      type: 'basicInfo',
    },
    // { title: '投标要求', id: 'tenderNeed', type: "bidNeed" },
    // { title: '投标其他要求', id: 'tenderOtherNeed', type: "otherNeed" },
    {
      title: intl.formatMessage({ id: 'table.purchase.toubiaowuliao' }),
      id: 'tenderParticulars',
      componentName: 'BidParticulars',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' }),
      id: 'transferRecord',
      componentName: 'BidTransformRecord',
    },
  ]

  // // 没有完成的标 隐藏中标结果、中标明细  @注释原因：无法通过状态判断
  // if(data?.inviteTender?.inviteTenderOutStatus !== BidOuterWorkState.Finish_Invite_Tender) {
  //   anchorTitleList.splice(1, 2)
  // }

  // 没有完成的标 隐藏中标结果、中标明细
  if (data?.isWin === null) {
    anchorTitleList.splice(1, 2)
  }

  // 未中标隐藏中标明细
  if (data?.isWin === false) {
    anchorTitleList.splice(2, 1)
  }

  return (
    <div>
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
