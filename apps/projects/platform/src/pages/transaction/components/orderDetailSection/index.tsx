import React, { Fragment, useContext } from 'react'
import AuditProcess from '@/components/AuditProcess'
import { Space } from '@linkseeks/ui'
import OrderProductTable from '../../components/orderProductTable'
import SaleOrderProductTable from '../../components/saleOrderProductTable'
import OrderPayTabs from '../../components/orderPayTabs'
import OrderMergeInfo from '../../components/orderMergeInfo'
import OrderDeleveRecord from '../../components/orderDeleveRecord'
import OrderTransformRecord from '../../components/orderTransformRecord'
import PaymentInfoCard from '../../components/paymentInfoCard'
import OrderSaleRecord from '../orderSaleRecord'
import { OrderKindType } from '@/constants/order'
import { OrderDetailContext } from '../../_public/order/context'
import BasicInfoCardLayout from '../basicInfoCard'
import { isEmpty } from 'lodash'
import { Ht } from '../../../orderAbility/purchaseOrder/componentSchema'
import { authService } from '@apps/services'
import { usePageStatus } from '@/hooks/usePageStatus'
import OrderWarehousingTable from '../orderWarehousingTable'
import ContractCard from '@/pages/orderAbility/components/contractCard'

export interface OrderDetailSectionProps {
  detailList?: any[]
  formContext: any
  type?: 'purchaseOrder' | 'saleOrder'
}

export enum ALTERATION {
  /**
   * 变更前
   */
  BEFORE_ALTERATION,
  /**
   *  变更后
   */
  AFTER_ALTERATION,
}

const OrderDetailSection: React.FC<OrderDetailSectionProps> = ({ formContext, detailList, type = 'purchaseOrder' }) => {
  /** 变更记录数据 */
  const { versionContext } = useContext(OrderDetailContext)
  const { data, addSchemaAction_ } = formContext
  const userInfo: any = authService.getAuth() || {}
  const { lastTypeParams } = usePageStatus() // 修改单价页面
  const ht_show = userInfo.memberRoleId === 9 && formContext.data?.innerStatus > 100
  const edit_show = lastTypeParams === '/detail' && formContext.data?.innerStatus === 101
  return (
    data && (
      <Space direction="vertical" size={16} style={{ display: 'flex', width: '100%' }}>
        {!versionContext && (
          <AuditProcess
            id="auditProcess"
            // customTitleKey='stepName'
            // customKey='step'
            initRadioValue={!isEmpty(data.innerSteps) ? 'inner' : 'outer'}
            outerVerifyCurrent={data.outerSteps?.findIndex((item) => item.step === data.currentOuterStep)}
            innerVerifyCurrent={data.innerSteps?.findIndex((item) => item.step === data.currentInnerStep)}
            outerVerifySteps={data.outerSteps}
            innerVerifySteps={data.innerSteps}
          />
        )}

        <BasicInfoCardLayout detailList={detailList} />

        {/* 付款信息 */}
        {(data?.orderKind === OrderKindType.SRM_ORDER || data?.orderKind === OrderKindType.REQUISITION_ORDER) &&
        (!versionContext ||
          versionContext?.detailBO?.currencyNameChangeStatus ||
          versionContext?.detailBO?.paymentTypeNameChangeStatus) ? (
          <PaymentInfoCard />
        ) : null}

        {!versionContext || versionContext?.detailBO?.productsChangeStatus ? (
          <Fragment>{type !== 'saleOrder' ? <OrderProductTable editable /> : <SaleOrderProductTable />}</Fragment>
        ) : null}

        {/* 采购合同下单或请购单不显示 支付信息栏 */}
        {data.orderKind === OrderKindType.SRM_ORDER || !data.payments.length ? null : <OrderPayTabs />}

        <OrderMergeInfo />
        {ht_show && edit_show && <Ht data={{ ...data, addSchemaAction_ }} />}
        {data.hasContract && <ContractCard />}
        {!versionContext && (
          <Fragment>
            {type === 'saleOrder' ? <OrderSaleRecord /> : <OrderDeleveRecord />}
            {type === 'purchaseOrder' && <OrderWarehousingTable />}
            <OrderTransformRecord type={type} />
          </Fragment>
        )}
      </Space>
    )
  )
}

OrderDetailSection.defaultProps = {}

export default OrderDetailSection
