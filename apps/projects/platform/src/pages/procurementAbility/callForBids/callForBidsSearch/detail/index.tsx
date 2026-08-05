import React from 'react'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import { useBidDetail } from '@/pages/procurement/_public/bid/effects/useBidDetail'
import BidDetailHeader from '@/pages/procurement/components/bidDetailHeader'
import BidDetailSection from '@/pages/procurement/components/bidDetailSection'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
const CallForBidsSearchDetail: React.FC = () => {
  const { formContext } = useBidDetail({ type: 'callForBid' })
  const { data } = formContext

  // type? 用于区分DescriptionsInfo组件的内容
  // componentName? 用于区分不同组件的渲染
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
    {
      title: intl.formatMessage({ id: 'table.purchase.baomingxinxi' }),
      id: 'registerInfoList',
      componentName: 'RegisterInfoList',
      type: 'registerList',
    },
    { title: intl.formatMessage({ id: 'table.purchase.zigeyushenyao' }), id: 'checkNeed', type: 'checkNeed' },
    {
      title: intl.formatMessage({ id: 'table.purchase.zigeyushenxin' }),
      id: 'preCheckInfoList',
      componentName: 'RegisterInfoList',
      type: 'preCheckList',
    },
    { title: intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiu' }), id: 'remarkNeed', type: 'remarkNeed' },
    {
      title: intl.formatMessage({ id: 'table.purchase.pingbiaobaogao' }),
      id: 'remarkBidReport',
      componentName: 'RemarkBidReport',
    },
    { title: intl.formatMessage({ id: 'table.purchase.qitayaoqiu' }), id: 'otherNeed', type: 'otherNeed' },
    { title: intl.formatMessage({ id: 'table.purchase.zhaobiaofangshi' }), id: 'bidWay', componentName: 'BidMethod' },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhaobiaojieguo' }),
      id: 'bidConfirm',
      componentName: 'BidConfirm',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' }),
      id: 'transferRecord',
      componentName: 'BidTransformRecord',
    },
  ]

  // 勾选资格预审 才有资格预审信息
  if (!data?.isQualificationCheck) {
    anchorTitleList.forEach(
      (ele, index) =>
        ele['title'] === intl.formatMessage({ id: 'table.purchase.zigeyushenyao' }) && anchorTitleList.splice(index, 1),
    )
    anchorTitleList.forEach(
      (ele, index) =>
        ele['title'] === intl.formatMessage({ id: 'table.purchase.zigeyushenxin' }) && anchorTitleList.splice(index, 1),
    )
  }

  // 招标完成 才显示招标结果
  if (!data?.isFinish) {
    anchorTitleList.forEach(
      (ele, index) =>
        ele['title'] === intl.formatMessage({ id: 'table.purchase.zhaobiaojieguo' }) &&
        anchorTitleList.splice(index, 1),
    )
  }

  return (
    <div>
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
