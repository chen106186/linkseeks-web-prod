/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect } from 'react'
import type { ModalTableProps } from '@/components/ModalTable'
import ModalTable from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import { useModalTable } from '../../model/useModalTable'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { filterProductDataById, inquiryColumns } from '../../constant'
import { getTradeNotarizeEnquiryProductQuotationList } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { lifecyclePhaseRules } from '@/constants/order'

export interface InquiryModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?: () => any
}

// 报价单弹窗
const InquiryModalTable: React.FC<InquiryModalTableProps> = (props) => {
  const intl = useIntl()
  const { type = 'radio', schemaAction, confirmModal, currentRef, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type })

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  useEffect(() => {
    if (visible) {
      const quoteId = schemaAction.getFieldValue('quoteId')
      if (quoteId) {
        setTimeout(() => {
          rowSelectionCtl.setSelectedRowKeys([Number(quoteId)])
        }, 500)
      }
    }
  }, [visible])

  const handleConfirm = async () => {
    const item = rowSelectionCtl.selectRow[0]
    console.log(item, 'item')
    if (item) {
      const data = await fetchOrderApi.getProductListByQuotationOrderId({
        id: item.inquiryListId,
      })

      const newData = data.map((v: any) => {
        v.memberId = item.offerMemberId
        v.memberRoleId = item.offerMemberRoleId
        v.orderMode = schemaAction.getFieldValue('orderMode')
        v.shopId = item.shopId
        // b2b询价下单 定价类型必定为2
        v.priceType = 2
        return v
      })
      schemaAction.setFieldValue('quoteNo', item.quotationNo)
      schemaAction.setFieldValue('quoteId', item.id)
      schemaAction.setFieldValue('vendorRoleId', item.offerMemberRoleId)
      schemaAction.setFieldValue('products', await filterProductDataById([], newData))
      schemaAction.setFieldValue('vendorMemberName', item.offerMemberName)
      schemaAction.setFieldValue('vendorMemberId', item.offerMemberId)
      schemaAction.setFieldValue('shopId', item.shopId)

      // 询价单回显订单明细
      schemaAction.setFieldValue('digest', item.details)
    }
    confirmModal && confirmModal()
    setVisible(false)
  }
  return (
    <ModalTable
      modalTitle={intl.formatMessage({ id: 'purchaseOrder.orderCollect.inquiryModalTable.title' })}
      columns={inquiryColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={async (params) =>
        (
          await getTradeNotarizeEnquiryProductQuotationList({
            ...params,
            lifeCycleStageRuleId: lifecyclePhaseRules.CUSTOMER_ORDER,
            externalState: 4,
          })
        ).data
      }
      rowSelection={rowSelection}
      modalType="inquiryByDefault"
      searchName="quotationNo"
      tableProps={{
        rowKey: 'id',
      }}
      resetModal={{
        destroyOnClose: true,
      }}
      {...restProps}
    />
  )
}

InquiryModalTable.defaultProps = {}

export default InquiryModalTable
