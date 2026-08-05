import React from 'react'
import style from './index.less'
import DescriptionsInfo from '../descriptionsInfo'
import BillMaterial from '../billMaterial'
import TransferProcess from '../transferProcess'
import TransformRecord from '../transferRecord'
import BillDelivery from '../billDelivery'
import AuditProcess from '@/components/AuditProcess'
import BilEnclosure from '../bilEnclosure'

export interface anchorItemProps {
  title: string
  id: string
  componentName?: string
  type?: string
  styles?: React.CSSProperties
}
export interface BillDetailSectionProps {
  formContext: any
  type: 'requestBill'
  anchorList?: anchorItemProps[]
}

const BillDetailSection: React.FC<BillDetailSectionProps> = ({ formContext, anchorList = [] }) => {
  // 名称与组件映射
  const NameMapComponent = {
    // 流转进度组件
    TransferProcess: TransferProcess,
    // 信息 基本信息组件
    DescriptionsInfo: DescriptionsInfo,
    // 送货时间
    BillDelivery: BillDelivery,
    // 请购物料组件
    BillMaterial: BillMaterial,
    // 流转记录组件
    TransformRecord: TransformRecord,
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

  const RenderCertainContent = ({ title, type = null, componentName = null, styles }) => {
    let RcDom: any = null
    switch (componentName) {
      case 'TransferProcess':
        RcDom = (
          <AuditProcess
            customTitleKey="stepName"
            customKey="step"
            initRadioValue="inner"
            outerVerifyCurrent={formContext.data.currentOuterStep}
            innerVerifyCurrent={formContext.data.currentInnerStep}
            outerVerifySteps={
              formContext.data.outerSteps
                ? formContext.data.outerSteps.map((item) => ({
                    ...item,
                    status: item.step <= formContext.data.currentOuterStep ? 'finish' : 'wait',
                  }))
                : null
            }
            innerVerifySteps={
              formContext.data.innerSteps
                ? formContext.data.innerSteps.map((item) => ({
                    ...item,
                    status: item.step <= formContext.data.currentInnerStep ? 'finish' : 'wait',
                  }))
                : null
            }
          ></AuditProcess>
        )
        break
      case 'BillMaterial':
        RcDom = <BillMaterial cardTitle={title} />
        break
      case 'TransformRecord':
        RcDom = <TransformRecord cardTitle={title} />
        break
      case 'BillDelivery':
        RcDom = <BillDelivery cardTitle={title} type={type} />
        break
      case 'BilEnclosure':
        RcDom = <BilEnclosure cardTitle={title} />
        break
      default:
        RcDom = <DescriptionsInfo cardTitle={title} type={type} styles={styles} />
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

BillDetailSection.defaultProps = {}

export default BillDetailSection
