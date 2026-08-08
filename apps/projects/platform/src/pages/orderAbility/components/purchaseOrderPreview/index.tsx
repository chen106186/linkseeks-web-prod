import React from 'react'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import { PageHeaderWrapper } from '@apps/components'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { useOrderDetail } from '@/pages/orderAbility/assets/hooks/useOrderDetail'
import OrderDetailSection from '@/pages/transaction/components/orderDetailSection'
import { usePageStatus } from '@/hooks/usePageStatus'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import useVersion from '@/hooks/useVersion'

/**
 * 变更的数据格式化
 * @param data
 * @param current
 * @returns
 */
export const formatContext = (data: any, current: string) => {
  return {
    changeTime: data?.detailBO?.changeTime,
    verifiedTime: data?.detailBO?.verifiedTime,
    orderNo: data?.detailBO[current + 'ContractNo'],
    contractNoChangeStatus: data?.detailBO?.contractNoChangeStatus,
    contractNo: data?.detailBO?.contractNo,
    digestChangeStatus: data?.detailBO?.digestChangeStatus,
    digest: data?.detailBO[current + 'Digest'],
    currencyNameChangeStatus: data?.detailBO?.currencyNameChangeStatus,
    currencyTypeName: data?.detailBO[current + 'CurrencyName'],
    paymentTypeNameChangeStatus: data?.detailBO?.paymentTypeNameChangeStatus,
    paymentTypeName: data?.detailBO[current + 'PaymentTypeName'],
    deliverDateChangeStatus: data?.detailBO?.deliverDateChangeStatus,
    deliverDate: data?.detailBO[current + 'DeliverDate'],
    consigneeChangeStatus: data?.detailBO?.consigneeChangeStatus,
    consignee: data?.detailBO[current + 'Consignee'],
    invoiceChangeStatus: data?.detailBO?.invoiceChangeStatus,
    invoice: data?.detailBO[current + 'Invoice'],
    packChangeStatus: data?.detailBO?.packChangeStatus,
    pack: data?.detailBO[current + 'Pack'],
    remarkChangeStatus: data?.detailBO?.remarkChangeStatus,
    remark: data?.detailBO[current + 'Remark'],
    beforeBuyerInnerStatusName: data?.detailBO?.beforeBuyerInnerStatusName,
    beforeVendorInnerStatusName: data?.detailBO?.beforeVendorInnerStatusName,
    beforeOuterStatusName: data?.detailBO?.beforeOuterStatusName,
    totalAmountChangeStatus: data?.detailBO?.totalAmountChangeStatus,
    totalAmount: data?.detailBO[current + 'TotalAmount'],
    productsChangeStatus: data?.detailBO?.productsChangeStatus,
    product: data?.detailBO[current + 'Products'],
    contractText: data?.detailBO[current + 'contractText'],
    contractTextChangeStatus: data?.detailBO?.contractTextChangeStatus,
  }
}

const OrderPreview: React.FC = () => {
  const { id } = usePageStatus()
  const { formContext, detailList } = useOrderDetail({ type: 'purchaseOrder' })
  const { TabList, versionContext, handleChangeVersion } = useVersion({ id, formContext })

  return (
    <OrderDetailContext.Provider value={{ formContext, versionContext }}>
      <PageHeaderWrapper
        subTitle={formContext?.data?.orderNo}
        title={formContext?.data?.digest}
        items={TabList}
        extra={<ChangeButtonCard formContext={formContext} versionChange={handleChangeVersion} />}
      >
        <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
          <OrderDetailSection formContext={formContext} detailList={detailList} />
        </PreLoading>
      </PageHeaderWrapper>
    </OrderDetailContext.Provider>
  )
}

export default OrderPreview
