import React, { useEffect } from 'react'
import type { ModalTableProps } from '@/components/ModalTable'
import ModalTable from '@/components/ModalTable'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { formatTimeString } from '@/utils'
import { getPurchaseRequisitionTransferPurchasePage } from '@apps/apis'
import { requisitionColumns } from '../../constant'
import { fetchOrderApi } from '../../apis'
import { useModalTable } from '../../model/useModalTable'
import { useIntl } from '@linkseeks/i18n'
import { getUnitPriceTotal } from '../../model/useMaterialTable'

export interface RequisitionModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?: () => void
}

// 选择请购单弹窗
const RequisitionModalTable: React.FC<RequisitionModalTableProps> = (props) => {
  const { type = 'radio', schemaAction, confirmModal, currentRef, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type })
  const intl = useIntl()
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
      const requisition = schemaAction.getFieldValue('requisitionId')
      if (requisition) {
        rowSelectionCtl.setSelectedRowKeys([requisition])
      }
    }
  }, [visible])

  const handleConfirm = async () => {
    const item = rowSelectionCtl.selectRow[0]
    schemaAction.setFieldValue('products', [])
    if (item) {
      schemaAction.setFieldValue('products', [])
      schemaAction.setFieldValue('requisitionNo', item.requisitionNo)
      schemaAction.setFieldValue('requisitionId', item.id)
      schemaAction.setFieldValue('digest', item.digest)
      schemaAction.setFieldValue('deliverDate', formatTimeString(item.advanceDeliveryDate, 'YYYY-MM-DD HH:mm'))

      const { data } = await fetchOrderApi.getRequisitionPurchaseMaterielList({
        requisitionId: item.id,
        current: 1,
        pageSize: 999,
      })
      if (!data) {
        return false
      }

      // 字段转换
      const newData = data.map((v: any) => ({
        ...v,
        tax: true,
        // @ 配送方式 默认物流
        logistics: 1,
        // 会员信息冗余
        memberName: item.vendorMemberName,
        memberId: item.vendorMemberId,
        memberRoleId: item.vendorRoleId,
        // 重新赋值 剩余可请购数量
        // fix: http://chandao.shushangyun.com/index.php?m=bug&f=view&bugID=26034
        quantity: v.quantifiable,
        amount: getUnitPriceTotal(v),
      }))

      schemaAction.setFieldValue('products', newData)
      schemaAction.setFieldValue('vendorMemberName', item.vendorMemberName)
      schemaAction.setFieldValue('vendorMemberId', item.vendorMemberId)
      schemaAction.setFieldValue('vendorRoleId', item.vendorRoleId)
      schemaAction.setFieldValue('warehouseId', item?.warehouseId)
    }
    confirmModal?.()
    setVisible(false)
  }
  return (
    <ModalTable
      modalTitle={intl.formatMessage({ id: 'purchaseOrder.orderCollect.requisition.button1' })}
      columns={requisitionColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={async (params) =>
        (await getPurchaseRequisitionTransferPurchasePage({ ...params }, { useCache: true, ttl: 10 * 1000 })).data
      }
      rowSelection={rowSelection}
      modalType="requisitionSchema"
      searchName="requisitionNo"
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

RequisitionModalTable.defaultProps = {}

export default RequisitionModalTable
