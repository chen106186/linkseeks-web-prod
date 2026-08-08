import React, { useRef } from 'react'
import { baseOrderListColumns } from '../../constant'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import TableOperation from '@/components/TableOperation'
import { postOrderBuyerCreateDelete, postOrderBuyerCreateSubmit } from '@apps/apis'
import { COLUMNS_ACTION_WIDTH } from '@/constants/table'

// 业务hooks, 待新增订单
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'orderId' })

  const handleSubmit = async (id) => {
    await postOrderBuyerCreateSubmit({ orderId: id })
    ref.current.reloadCurrent()
  }

  const handleDelete = async (id) => {
    await postOrderBuyerCreateDelete({ orderId: id })
    ref.current.reloadCurrent()
  }

  const handleEdit = (record: any) => {
    history.push(`/orderAbility/purchaseOrder/readyAddRequisitionOrder/edit?id=${record.orderId}`)
  }

  /** 参照后台数据生成 */
  const renderOptionButton = (record: any) => {
    const buttonGroup = {
      [intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.useSelfTableOpeartion1' })]: true,
      [intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.useSelfTableOpeartion2' })]: record.showUpdate,
      [intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.useSelfTableOpeartion3' })]: record.showDelete,
    }

    const operationHandler = {
      [intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.useSelfTableOpeartion1' })]: () =>
        handleSubmit(record.orderId),
      [intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.useSelfTableOpeartion2' })]: () => handleEdit(record),
      [intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.useSelfTableOpeartion3' })]: () =>
        handleDelete(record.orderId),
    }

    const buttonPermissionsMap = {
      [intl.formatMessage({
        id: 'purchaseOrder.readyAddOrder.useSelfTableOpeartion1',
        defaultMessage: '提交',
      })]: 'submit',
      [intl.formatMessage({
        id: 'purchaseOrder.readyAddOrder.useSelfTableOpeartion2',
        defaultMessage: '编辑',
      })]: 'edit',
      [intl.formatMessage({
        id: 'purchaseOrder.readyAddOrder.useSelfTableOpeartion3',
        defaultMessage: '删除',
      })]: 'delete',
    }
    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        buttonPermissionsMap={buttonPermissionsMap}
      />
    )
  }

  const secondColumns = () => {
    const alreadyColumns = baseOrderListColumns()
    if (alreadyColumns) {
      return alreadyColumns.concat([
        {
          title: intl.formatMessage({ id: 'purchaseOrder.operation' }),

          dataIndex: 'ctl',
          key: 'ctl',
          render: (text, record) => renderOptionButton(record),
          fixed: 'right',
          width: COLUMNS_ACTION_WIDTH,
        },
      ])
    }
  }

  return {
    columns: secondColumns(),
    ref,
    rowSelection,
    rowSelectionCtl,
  }
}
