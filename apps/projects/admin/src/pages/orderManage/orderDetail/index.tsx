import React, { useState, useEffect, useRef } from 'react'
import OrderDetailHeader from '../components/OrderDetailHeader'
import { Link } from '@linkseeks/router-core'
import { formatTimeString } from '@/utils'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import AuditProcess from '@/components/AuditProcess'
import OrderDetailWrapper from '../components/OrderDetailWrapper'
import OrderProductTable from './components/orderProductTable'
import { OrderDetailContext } from './context'
import OrderMergeInfo from './components/orderMergeInfo'
import OrderTransformRecord from './components/orderTransformRecord'
import OrderPayTabs from './components/orderPayTabs'
import OrderDeleveRecord from './components/orderDeleveRecord'
import { OrderKindType } from './constant'
import OrderPayResultModal from './components/orderPayResultModal'
import PaymentInfoCard from './components/paymentInfoCard'
import { getOrderPlatformManageDetail } from '@apps/apis'

export interface CommonOrderDetailProps {}

const CommonOrderDetail: React.FC<CommonOrderDetailProps> = (props) => {
  const [formData, setFormData] = useState<any>(null)
  let { id, pageStatus } = usePageStatus()
  const payResultVisible = useRef<any>({})
  const [payResultType, setPayResultType] = useState<'default' | 'preview'>('default')
  useEffect(() => {
    reloadFormData()
  }, [])

  const reloadFormData = async () => {
    if (id) {
      const { data, code } = await getOrderPlatformManageDetail({ orderId: id })
      if (code === 1000) {
        setFormData(data)
      }
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

  const detailList = [
    {
      label: '对应报价单号',
      name: 'quoteNo',
      span: 8,
      render: (text, record) => <Link to={`/rfqOffer/rfq/details?id=${record.quoteId}`}>{text}</Link>,
    },
    { label: '订单摘要', name: 'digest', span: 8 },
    { label: '供应会员', name: 'vendorMemberName', span: 8 },
    { label: '下单模式', name: 'orderModeName', span: 8 },
    { label: '订单类型', name: 'orderTypeName', span: 8 },
    { label: '下单时间', name: 'createTime', span: 8, render: (text) => formatTimeString(text) },
    { label: '外部状态', name: 'outerStatusName', span: 8 },
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
        <OrderDetailHeader headerTitle={headerTiTle} detailList={detailList} detailData={formData} />
        <OrderDetailWrapper>
          <div className="gray-wrap">
            {/* 工作流进度 */}
            {pageStatus !== PageStatus.ADD && formData && formData.outerSteps && (
              <AuditProcess
                customTitleKey="stepName"
                customKey="step"
                outerVerifyCurrent={formData.currentOuterStep - 1}
                innerVerifyCurrent={formData.currentInnerStep - 1}
                outerVerifySteps={formData.outerSteps ? formData.outerSteps : null}
                innerVerifySteps={formData.innerSteps ? formData.innerSteps : null}
              ></AuditProcess>
            )}

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
            {formData.orderKind === OrderKindType.SRM_ORDER ? null : <OrderPayTabs />}

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
