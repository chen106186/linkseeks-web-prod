import React, { useRef } from 'react'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import OrderPayModal from '@/pages/transaction/components/orderPayModal'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import { useBidDetail } from '@/pages/procurement/_public/bid/effects/useBidDetail'
import BidDetailHeader from '@/pages/procurement/components/bidDetailHeader'
import BidDetailSection from '@/pages/procurement/components/bidDetailSection'
import { TenderOutWorkState } from '@/constants/procurement'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const CallForBidsSearchDetailInTender: React.FC = () => {
  const { formContext, id } = useBidDetail({ type: 'tenderInCallForBid' })
  const { data } = formContext
  const payRef = useRef<any>({})

  const anchorTitleList = [
    {
      title: intl.formatMessage({ id: 'table.purchase.liuzhuanjindu' }),
      id: 'transferProcess',
      componentName: 'TransferProcess',
    },
    { title: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }), id: 'baseicInfo', type: 'basicInfo' },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhaobiaowuliao' }),
      id: 'bidMaterial',
      componentName: 'BidMaterial',
    },
    { title: intl.formatMessage({ id: 'table.purchase.zhaobiaoyaoqiu' }), id: 'bidNeed', type: 'bidNeed' },
    { title: intl.formatMessage({ id: 'table.purchase.baomingyaoqiu' }), id: 'registerNeed', type: 'registerNeed' },
    { title: intl.formatMessage({ id: 'detail.purchase.signUpMsgLayout' }), id: 'registerInfo', type: 'registerInfo' },
    { title: intl.formatMessage({ id: 'detail.purchase.signUpFileLayout' }), id: 'registerFile', type: 'registerFile' },
    { title: intl.formatMessage({ id: 'table.purchase.zigeyushenyao' }), id: 'checkNeed', type: 'checkNeed' },
    {
      title: intl.formatMessage({ id: 'table.purchase.zigezhengmingwen' }),
      id: 'checkQualifyFile',
      type: 'checkQualifyFile',
    },
    { title: intl.formatMessage({ id: 'table.purchase.qitayaoqiu' }), id: 'otherNeed', type: 'otherNeed' },
    {
      title: intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' }),
      id: 'transferRecord',
      componentName: 'BidTransformRecord',
    },
  ]

  //  // 没有报名的标 隐藏报名信息、报名文件
  //  if(data?.submitTenderOutStatus === TenderOutWorkState.Not_Invite_Tender_Register) {
  //   anchorTitleList.splice(5, 2)
  // }

  // 勾选资格预审 才有资格预审信息
  if (!data?.inviteTender?.isQualificationCheck) {
    anchorTitleList.forEach(
      (ele, index) =>
        ele['title'] === intl.formatMessage({ id: 'table.purchase.zigeyushenyao' }) && anchorTitleList.splice(index, 1),
    )
    anchorTitleList.forEach(
      (ele, index) =>
        ele['title'] === intl.formatMessage({ id: 'table.purchase.zigezhengmingwen' }) &&
        anchorTitleList.splice(index, 1),
    )
  }

  return (
    <div>
      <BidDetailContext.Provider value={formContext}>
        <BidDetailHeader formContext={formContext} anchorList={anchorTitleList} />
        <OrderDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <BidDetailSection formContext={formContext} anchorList={anchorTitleList} type="tenderInCallForBid" />
          </PreLoading>
        </OrderDetailWrapper>

        <OrderPayModal currentRef={payRef} />
      </BidDetailContext.Provider>
    </div>
  )
}

export default CallForBidsSearchDetailInTender
