import React from 'react'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import PaymentTableCell, { PaymentEditableRow } from '../components/paymentTableCell'
import style from '../index.less'
import { getIntl } from '@linkseeks/i18n'

// 支付配置
const paymentColumns = [
  {
    dataIndex: 'batchNo',
    title: getIntl().formatMessage({ id: 'processRuleSetting.zhifucishu', defaultMessage: '支付次数' }),
    key: 'batchNo',
  },
  {
    dataIndex: 'payNode',
    title: getIntl().formatMessage({ id: 'processRuleSetting.zhifuhuanjie', defaultMessage: '支付环节' }),
    key: 'payNode',
    formItem: 'input',
    editable: true,
    width: 200,
  },
  {
    dataIndex: 'payRate',
    title: getIntl().formatMessage({ id: 'processRuleSetting.zhifubili', defaultMessage: '支付比例' }),
    key: 'payRate',
    formItem: 'input',
    editable: true,
    width: 80,
    formItemProps: {
      suffix: '%',
    },
  },
]

/**
 * @param ctx schemaAction
 */
export const usePaymentTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const paymentComponents = {
    body: {
      row: PaymentEditableRow,
      cell: PaymentTableCell,
    },
  }

  const handleSave = (row) => {
    return new Promise((resolve, reject) => {
      const newData = [...ctx.getFieldValue('payments')]
      const paymentIndex = newData.findIndex((item) => row.serialNo === item.serialNo)
      const nodeItem = newData[paymentIndex]['nodes']
      const nodeIndex = nodeItem.findIndex((item) => row.batchNo === item.batchNo)
      nodeItem.splice(nodeIndex, 1, {
        ...nodeItem[nodeIndex],
        ...row,
      })
      newData[paymentIndex]['nodes'] = nodeItem
      ctx.setFieldValue('payments', newData)
      resolve({ nodeItem, newData })
    })
  }

  const paymentMergeColumns = paymentColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: ctx.getFormState().editable === false ? false : col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        formItem: col.formItem,
        formItemProps: col.formItemProps,
        handleSave,
      }),
    }
  })

  return {
    paymentColumns: paymentMergeColumns,
    paymentComponents,
  }
}
