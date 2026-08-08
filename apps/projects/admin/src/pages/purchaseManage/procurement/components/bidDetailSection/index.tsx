import React, { useEffect } from 'react'
import { findLastIndexFlowState } from '@/utils'
import style from './index.less'
import TransferProcess from '../transferProcess'
import DescriptionsInfo from '../descriptionsInfo'
import BidMaterial from '../bidMaterial'
import BidMethod from '../bidMethod'
import BidTransformRecord from '../transferRecord'
import BidParticulars from '../bidParticulars'
import RemarkBidReport from '../remarkBidReport'
import ParticipateInfo from '../participateInfo'
import BidConfirm from '../bidConfirm'
import MemberWinInfo from '../memberWinInfo'
import RegisterInfoList from '../registerInfoList'

export interface BidDetailSectionProps {
  formContext: any
  /** callForBid 招标 | tender 投标  */
  type?: 'callForBid' | 'tender'
  anchorList?: any
}

const BidDetailSection: React.FC<BidDetailSectionProps> = ({ formContext, type = 'callForBid', anchorList = [] }) => {
  useEffect(() => {
    // 获取各个子div距父级的高度
    let floors = document.querySelectorAll('.anchorContent>div')
    let tempArr = []
    floors.forEach((floor: any, index: any) => {
      tempArr.push(floor.offsetTop)
    })
    // 各内容div存入context
    formContext.ctl.setOffsetTopList(tempArr)
  }, [])

  // 名称与组件映射
  const NameMapComponent = {
    // 流转进度组件
    TransferProcess: TransferProcess,
    // 信息 基本信息组件
    DescriptionsInfo: DescriptionsInfo,
    // 物料组件
    BidMaterial: BidMaterial,
    // 招标方式组件
    BidMethod: BidMethod,
    // 流转记录组件
    BidTransformRecord: BidTransformRecord,
    // 中标明细组件
    BidParticulars: BidParticulars,
    // 评标报告
    RemarkBidReport: RemarkBidReport,
    // 会员参标信息
    ParticipateInfo: ParticipateInfo,
    // 招标定标
    BidConfirm: BidConfirm,
    // 会员中标信息
    MemberWinInfo: MemberWinInfo,
    // 报名信息列表
    RegisterInfoList: RegisterInfoList,
  }

  const RenderDetailSection = ({ componentList }) => {
    if (componentList && componentList.length > 0) {
      return componentList.map((item, index) => (
        <div key={index} id={item['id']}>
          {RenderCertainContent(item)}
        </div>
      ))
    } else {
      return null
    }
  }

  const RenderCertainContent = ({ id, title, type = null, componentName = null }) => {
    let RcDom: any = null
    switch (componentName) {
      //@todo 需另外调用接口获取数据
      case 'TransferProcess':
        RcDom = (
          <TransferProcess
            cardTitle={title}
            customTitleKey="name"
            customKey="id"
            outerVerifyCurrent={findLastIndexFlowState(formContext.externalWorkflowFlowRecordLogResponses)}
            innerVerifyCurrent={findLastIndexFlowState(formContext.interiorWorkflowFlowRecordLogResponses)}
            outerVerifySteps={
              formContext.externalWorkflowFlowRecordLogResponses
                ? formContext.externalWorkflowFlowRecordLogResponses.map((item) => ({
                    ...item,
                    status: item.isActive ? 'finish' : 'wait',
                  }))
                : []
            }
            innerVerifySteps={
              formContext.interiorWorkflowFlowRecordLogResponses
                ? formContext.interiorWorkflowFlowRecordLogResponses.map((item) => ({
                    ...item,
                    status: item.isActive ? 'finish' : 'wait',
                  }))
                : []
            }
          ></TransferProcess>
        )
        break
      case 'BidMaterial':
        RcDom = <BidMaterial cardTitle={title} />
        break
      case 'BidMethod':
        RcDom = <BidMethod cardTitle={title} />
        break
      case 'BidTransformRecord':
        RcDom = <BidTransformRecord cardTitle={title} />
        break
      case 'BidParticulars':
        RcDom = <BidParticulars cardTitle={title} />
        break
      case 'RemarkBidReport':
        RcDom = <RemarkBidReport cardTitle={title} />
        break
      case 'ParticipateInfo':
        RcDom = <ParticipateInfo cardTitle={title} />
        break
      case 'BidConfirm':
        RcDom = <BidConfirm cardTitle={title} />
        break
      case 'MemberWinInfo':
        RcDom = <MemberWinInfo cardTitle={title} />
        break
      case 'RegisterInfoList':
        RcDom = <RegisterInfoList cardTitle={title} type={type} />
        break
      default:
        RcDom = <DescriptionsInfo cardTitle={title} type={type} />
    }
    return RcDom
  }

  return (
    formContext.data && (
      <div className={[style.anchorContentWrap, 'anchorContent'].join(' ')}>
        <RenderDetailSection componentList={anchorList} />
      </div>
    )
  )
}

BidDetailSection.defaultProps = {}

export default BidDetailSection
