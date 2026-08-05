import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import PreLoading from '@/components/PreLoading'
import { useBillDetail } from '../_public/bill/effects/useBillDetail'
import { BillDetailContext } from '../_public/bill/effects/context'
import BillDetailHeader from '../components/billDetailHeader'
import BillDetailWrapper from '../components/billDetailWrapper'
import BillDetailSection from '../components/billDetailSection'
import { Button } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import { AuthButton } from '@apps/components'

const RequisitionOrderDetail: React.FC = () => {
  const { formContext } = useBillDetail({ type: 'transformBill' })
  const { id, action } = usePageStatus()
  const intl = useIntl()
  const anchorTitleList = [
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.jibenxinxi', defaultMessage: '基本信息' }),
      id: 'baseicInfo',
      type: 'basicInfo',
      styles: { marginTop: 0 },
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.qinggouwuliao', defaultMessage: '请购物料' }),
      id: 'billMaterial',
      componentName: 'BillMaterial',
    },
  ]

  const handleClick = () => {
    history.push(`/orderAbility/purchaseOrder/readyAddRequisitionOrder/add?requisitionId=${id}`)
  }

  return (
    <div>
      <BillDetailContext.Provider value={formContext}>
        <BillDetailHeader
          formContext={formContext}
          anchorList={anchorTitleList}
          extraRight={
            action && (
              <Button type="primary" onClick={handleClick}>
                {intl.formatMessage({ id: 'purchaseRequisition.zhuancaigoudan', defaultMessage: '转采购单' })}
              </Button>
            )
          }
        />
        <BillDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <BillDetailSection formContext={formContext} anchorList={anchorTitleList} type="requestBill" />
          </PreLoading>
        </BillDetailWrapper>
      </BillDetailContext.Provider>
    </div>
  )
}

export default RequisitionOrderDetail
