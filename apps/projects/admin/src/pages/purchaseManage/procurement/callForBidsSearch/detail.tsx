import React from 'react'
import PreLoading from '@/components/PreLoading'
import { BidDetailContext } from '@/pages/purchaseManage/procurement/_public/bid/context'
import { useBidDetail } from '@/pages/purchaseManage/procurement/_public/bid/effects/useBidDetail'
import BidDetailHeader from '@/pages/purchaseManage/procurement/components/bidDetailHeader'
import BidDetailSection from '@/pages/purchaseManage/procurement/components/bidDetailSection'
import { BidOuterWorkState } from '@/constants'
import OrderDetailWrapper from '@/pages/orderManage/components/OrderDetailWrapper'

const CallForBidsSearchDetail: React.FC = () => {
  const { formContext, id } = useBidDetail({ type: 'callForBid' })
  const { data } = formContext

  const anchorTitleList = [
    { title: '流转进度', id: 'transferProcess', componentName: 'TransferProcess' },
    { title: '基本信息', id: 'baseicInfo', type: 'basicInfo' },
    { title: '招标物料', id: 'bidMaterial', componentName: 'BidMaterial' },
    { title: '招标要求', id: 'bidNeed', type: 'bidNeed' },
    { title: '报名要求', id: 'registerNeed', type: 'registerNeed' },
    //
    { title: '报名信息', id: 'registerInfoList', componentName: 'RegisterInfoList', type: 'registerList' },
    { title: '资格预审要求', id: 'checkNeed', type: 'checkNeed' },
    //
    { title: '资格预审信息', id: 'preCheckInfoList', componentName: 'RegisterInfoList', type: 'preCheckList' },
    { title: '评标要求', id: 'remarkNeed', type: 'remarkNeed' },
    //
    { title: '评标报告', id: 'remarkBidReport', componentName: 'RemarkBidReport' },
    { title: '其他要求', id: 'otherNeed', type: 'otherNeed' },
    { title: '招标方式', id: 'bidWay', componentName: 'BidMethod' },
    //
    { title: '招标结果', id: 'bidConfirm', componentName: 'BidConfirm' },
    { title: '流转记录', id: 'transferRecord', componentName: 'BidTransformRecord' },
  ]

  //  // 已经报名 才有报名信息
  //  if(data?.inviteTenderOutStatus < BidOuterWorkState.Not_Submitted_Qualifications_Check) {
  //   anchorTitleList.splice(5, 1)
  // }

  // // 已经资格预审 才有资格预审信息
  // if(data?.inviteTenderOutStatus < BidOuterWorkState.Not_Submit_Tender && !data?.isQualificationCheck) {
  //   anchorTitleList.forEach((ele, index) => ele['title'] === '资格预审信息' && anchorTitleList.splice(index, 1))
  // }

  // // 已经评标 才有评标报告
  // if(data?.inviteTenderOutStatus < BidOuterWorkState.Not_Finish_Notice) {
  //   anchorTitleList.forEach((ele, index) => ele['title'] === '评标报告' && anchorTitleList.splice(index, 1))
  // }

  // // 已经完成招标 才有招标结果
  // if(data?.inviteTenderOutStatus < BidOuterWorkState.Finish_Invite_Tender) {
  //   anchorTitleList.splice(-2, 1)
  // }

  // 勾选资格预审 才有资格预审信息
  if (!data?.isQualificationCheck) {
    anchorTitleList.forEach((ele, index) => ele['title'] === '资格预审要求' && anchorTitleList.splice(index, 1))
    anchorTitleList.forEach((ele, index) => ele['title'] === '资格预审信息' && anchorTitleList.splice(index, 1))
  }

  // 招标完成 才显示招标结果
  if (!data?.isFinish) {
    anchorTitleList.forEach((ele, index) => ele['title'] === '招标结果' && anchorTitleList.splice(index, 1))
  }

  return (
    <div className="common-scroll-wrap">
      <BidDetailContext.Provider value={formContext}>
        <BidDetailHeader formContext={formContext} anchorList={anchorTitleList} />
        <OrderDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <BidDetailSection formContext={formContext} anchorList={anchorTitleList} type="callForBid" />
          </PreLoading>
        </OrderDetailWrapper>
      </BidDetailContext.Provider>
    </div>
  )
}

export default CallForBidsSearchDetail
