import React from 'react'
import PreLoading from '@/components/PreLoading'
import { useBillDetail } from '../_public/bill/effects/useBillDetail'
import { BillDetailContext } from '../_public/bill/effects/context'
import BillDetailWrapper from '../components/billDetailWrapper'
import BillDetailHeader from '../components/billDetailHeader'
import BillDetailSection from '../components/billDetailSection'
import { useIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'

const OrderPreview: React.FC = () => {
  const { formContext } = useBillDetail({ type: 'requestBill' })
  const intl = useIntl()
  const translate = useWebIntl()

  const anchorTitleList = [
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.liuzhuanjindu', defaultMessage: '流转进度' }),
      id: 'transferProcess',
      componentName: 'TransferProcess',
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.jibenxinxi', defaultMessage: '基本信息' }),
      id: 'baseicInfo',
      type: 'basicInfo',
    },
    {
      title: translate('web.resource.order.songhuojiaoqixinxi'),
      id: 'BillDelivery',
      type: 'BillDelivery',
      componentName: 'BillDelivery',
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.qinggouwuliao', defaultMessage: '请购物料' }),
      id: 'billMaterial',
      componentName: 'BillMaterial',
    },
    { title: translate('web.resource.member.fujian'), id: 'BilEnclosure', componentName: 'BilEnclosure' },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.liuzhuanjilu', defaultMessage: '流转记录' }),
      id: 'transferRecord',
      componentName: 'TransformRecord',
    },
  ]

  return (
    <div>
      <BillDetailContext.Provider value={formContext}>
        <BillDetailHeader formContext={formContext} anchorList={anchorTitleList} />
        <BillDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <BillDetailSection formContext={formContext} anchorList={anchorTitleList} type="requestBill" />
          </PreLoading>
        </BillDetailWrapper>
      </BillDetailContext.Provider>
    </div>
  )
}

export default OrderPreview
