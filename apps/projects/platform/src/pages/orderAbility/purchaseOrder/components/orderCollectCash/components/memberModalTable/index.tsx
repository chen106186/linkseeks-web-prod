import React, { useEffect } from 'react'
import ModalTable, { ModalTableProps } from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import { useModalTable } from '../../model/useModalTable'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { memberColumns } from '../../constant'
import { getIntl } from '@linkseeks/i18n'
import { lifecyclePhaseRules } from '@/constants/order'

export interface MemberModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?()
  productRef?: any
}

const MemberModalTable: React.FC<MemberModalTableProps> = (props) => {
  const { type = 'radio', schemaAction, confirmModal, currentRef, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type, customKey: 'id' })

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  const handleConfirm = () => {
    const rowItem = rowSelectionCtl.selectRow[0]
    console.log(rowItem, 'row')
    if (rowItem) {
      schemaAction.setFieldValue('vendorRoleId', rowItem.roleId)
      schemaAction.setFieldValue('vendorMemberId', rowItem.memberId)
      schemaAction.setFieldValue('vendorMemberName', rowItem.name)
    }
    confirmModal && confirmModal()
    setVisible(false)
    // 清空之前可能存在的商品支付信息数据
    schemaAction.setFieldValue('products', [])
    schemaAction.setFieldValue('payments', [])
    if (props?.productRef) {
      props.productRef.current.rowSelectionCtl.setSelectRow([])
      props.productRef.current.rowSelectionCtl.setSelectedRowKeys([])
    }
  }
  return (
    <ModalTable
      modalTitle={getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.memberModalTable.title' })}
      columns={memberColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={(params) =>
        fetchOrderApi.getMemberListByModelType({ ...params, lifeCycleStageRuleId: lifecyclePhaseRules.CUSTOMER_ORDER })
      }
      rowSelection={rowSelection}
      modalType="memberByDefault"
      tableProps={{
        rowKey: 'id',
      }}
      {...restProps}
    />
  )
}

MemberModalTable.defaultProps = {}

export default MemberModalTable
