import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Space } from 'antd'
import { Link } from '@linkseeks/router-core'
import { formatTimeString } from '@/utils'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import AuditProcess from '@/components/AuditProcess'
import OrderDetailHeader from '../components/OrderDetailHeader'
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
import PlatformDeliveryModal from './components/platformDeliveryModal'
import PlatformLogisticsModal from './components/platformLogisticsModal'
import { getOrderPlatformManageDetail } from '@apps/apis'

export interface CommonOrderDetailProps {}

const CommonOrderDetail: React.FC<CommonOrderDetailProps> = () => {
  const [formData, setFormData] = useState<any>(null)
  const { id, pageStatus } = usePageStatus()
  const payResultVisible = useRef<any>({})
  const deliveryVisible = useRef<any>({})
  const [payResultType, setPayResultType] = useState<'default' | 'preview'>('default')
  const [logisticsVisible, setLogisticsVisible] = useState(false)

  useEffect(() => {
    reloadFormData()
  }, [])

  const reloadFormData = () => {
    if (id) {
      getOrderPlatformManageDetail({ orderId: id }).then(({ data, code }) => {
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

  const batchOptions = useMemo(
    () =>
      (formData?.deliveryDetails || [])
        .map((item) => item?.batchNo)
        .filter((item) => typeof item === 'number')
        .sort((a, b) => a - b),
    [formData],
  )

  const canDelivery = formData?.outerStatusName?.includes('待确认发货')
  const canViewLogistics = (formData?.deliveryDetails || []).length > 0

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

  const headerTitle = formData
    ? {
        picName: '单',
        titleLabel: '订单号 ',
        titleValue: formData.orderNo,
      }
    : null

  const renderExtra = () => (
    <Space>
      {canViewLogistics ? <Button onClick={() => setLogisticsVisible(true)}>查看物流</Button> : null}
      {canDelivery ? (
        <Button type="primary" onClick={() => deliveryVisible.current?.setVisible(true)}>
          去发货
        </Button>
      ) : null}
    </Space>
  )

  return formData ? (
    <div className="common-scroll-wrap">
      <OrderDetailContext.Provider value={formContext}>
        <OrderDetailHeader
          headerTitle={headerTitle}
          detailList={detailList}
          detailData={formData}
          extraRight={renderExtra()}
        />
        <OrderDetailWrapper>
          <div className="gray-wrap">
            {pageStatus !== PageStatus.ADD && formData && formData.outerSteps && (
              <AuditProcess
                customTitleKey="stepName"
                customKey="step"
                outerVerifyCurrent={formData.currentOuterStep - 1}
                innerVerifyCurrent={formData.currentInnerStep - 1}
                outerVerifySteps={formData.outerSteps || null}
                innerVerifySteps={formData.innerSteps || null}
              />
            )}

            {formContext.data?.orderKind === OrderKindType.SRM_ORDER ? (
              <PaymentInfoCard
                currencyTypeName={formContext.data?.currencyTypeName}
                paymentTypeName={formContext.data?.paymentTypeName}
              />
            ) : null}

            <OrderProductTable />
            {formData.orderKind === OrderKindType.SRM_ORDER ? null : <OrderPayTabs />}
            <OrderMergeInfo />
            <OrderDeleveRecord />
            <OrderTransformRecord />
          </div>
        </OrderDetailWrapper>
        <OrderPayResultModal currentRef={payResultVisible} type={payResultType} />
        <PlatformDeliveryModal currentRef={deliveryVisible} orderNo={formData.orderNo} onSuccess={reloadFormData} />
        <PlatformLogisticsModal
          visible={logisticsVisible}
          orderNo={formData.orderNo}
          batches={batchOptions}
          onClose={() => setLogisticsVisible(false)}
        />
      </OrderDetailContext.Provider>
    </div>
  ) : null
}

export default CommonOrderDetail
