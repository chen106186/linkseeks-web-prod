import React, { useState, useEffect, useRef } from 'react'
import OrderDetailHeader from '../components/OrderDetailHeader'
import { Button } from 'antd'
import { Link } from '@linkseeks/router-core'
import { usePageStatus } from '@/hooks/usePageStatus'
import AuditProcess from '@/components/AuditProcess'
import OrderDetailWrapper from '../components/OrderDetailWrapper'
import OrderProductTable from '../orderDetail/components/orderProductTable'
import { OrderDetailContext } from '../orderDetail/context'
import OrderMergeInfo from '../orderDetail/components/orderMergeInfo'
import OrderTransformRecord from '../orderDetail/components/orderTransformRecord'
import OrderPayTabs from '../orderDetail/components/orderPayTabs'
import OrderPayResultModal from '../orderDetail/components/orderPayResultModal'
import OrderDeleveRecord from '../orderDetail/components/orderDeleveRecord'
import { OrderKindType } from '../orderDetail/constant'
import PaymentInfoCard from '../orderDetail/components/paymentInfoCard'
import { getOrderPlatformManagePayConfirmDetail } from '@apps/apis'

export interface CommonOrderDetailProps {}

const CommonOrderDetail: React.FC<CommonOrderDetailProps> = (props) => {
  const [formData, setFormData] = useState<any>(null)
  let { id, pageStatus } = usePageStatus()
  const payResultVisible = useRef<any>({})
  const [payResultType, setPayResultType] = useState<'default' | 'preview'>('default')
  useEffect(() => {
    reloadFormData()
  }, [])

  const reloadFormData = () => {
    if (id) {
      getOrderPlatformManagePayConfirmDetail({ orderId: id }).then(({ data, code }) => {
        if (code === 1000) {
          setFormData(data)
        }
      })
    }
  }

  const formContext = {
    data: formData,
    payResultType,
    setPayResultType,
    payResultVisible,
    reloadFormData,
    ctl: {
      setData: setFormData,
    },
  }

  const startPush = () => {
    setPayResultType('default')
    payResultVisible.current.setVisible(true)
    return
  }

  const renderExtra = () => {
    return (
      <Button type="primary" onClick={startPush}>
        确认支付结果
      </Button>
    )
  }

  const detailList = [
    {
      label: '对应报价单号',
      name: 'quotationNo',
      span: 8,
      render: (text, record) => <Link to={`/rfqOffer/rfq/details?id=${record.quoteId}`}>{text}</Link>,
    },
    { label: '订单摘要', name: 'digest', span: 8 },
    { label: '供应会员', name: 'vendorMemberName', span: 8 },
    { label: '下单模式', name: 'orderModeName', span: 8 },
    { label: '订单类型', name: 'orderTypeName', span: 8 },
    { label: '下单时间', name: 'createTime', span: 8 },
    { label: '外部状态', name: 'outerStatusName' },
  ]
  const headerTiTle = formData
    ? {
        picName: '单',
        titleLabel: '订单号: ',
        titleValue: formData.orderNo,
      }
    : null

  return formData ? (
    <div className="common-scroll-wrap">
      <OrderDetailContext.Provider value={formContext}>
        <OrderDetailHeader
          headerTitle={headerTiTle}
          detailList={detailList}
          detailData={formData}
          extraRight={renderExtra()}
        />
        <OrderDetailWrapper>
          <div className="gray-wrap">
            {/* 工作流进度 */}
            {/* { pageStatus !== PageStatus.ADD && formData && formData.externalWorkflowFlowRecordLogResponses && <AuditProcess
              customTitleKey='operationalProcess'
              customKey='state'
              outerVerifyCurrent={findLastIndexFlowState(formData.externalWorkflowFlowRecordLogResponses)}
              innerVerifyCurrent={findLastIndexFlowState(formData.interiorWorkflowFlowRecordLogResponses)}
              outerVerifySteps={formData.externalWorkflowFlowRecordLogResponses || []}
              innerVerifySteps={formData.interiorWorkflowFlowRecordLogResponses || []}
            ></AuditProcess> } */}

            <AuditProcess
              customTitleKey="stepName"
              customKey="step"
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

            {/* 付款信息 */}
            {formContext.data?.orderKind === OrderKindType.SRM_ORDER ? (
              <PaymentInfoCard
                currencyTypeName={formContext.data?.currencyTypeName}
                paymentTypeName={formContext.data?.paymentTypeName}
              />
            ) : null}

            {/* 商品列表 */}
            <OrderProductTable />

            {/* 支付信息 todo */}
            <OrderPayTabs />

            {/* 杂项 */}
            <OrderMergeInfo />

            {/* 订单发货记录 */}
            <OrderDeleveRecord />

            {/* 订单流转记录 */}
            <OrderTransformRecord />
          </div>
        </OrderDetailWrapper>
        <OrderPayResultModal currentRef={payResultVisible} type={payResultType} />
      </OrderDetailContext.Provider>
    </div>
  ) : null
}

CommonOrderDetail.defaultProps = {}

export default CommonOrderDetail
