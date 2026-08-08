import { useState } from 'react'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { invoiceDetailColumn, addInvoiceDetailColumn } from '../contants'
import ProductTableCell, { ProductEditableRow } from '../../components/productTableCell'
import { getIntl } from '@linkseeks/i18n'
import { Button } from 'antd'
import { OperateType } from '../invoiceForm'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
// 对象按key排序（运用于商城传过来的阶梯价格排序）
export const sortByKey = (params) => {
  let keys = Object.keys(params).sort((x, y) => parseInt(x) - parseInt(y))
  let newParams = {}
  keys.forEach((key) => {
    newParams[key] = params[key]
  })
  return newParams
}

/**
 * @param ctx schemaAction
 * @param relevanceRef 关联报价商品抽屉的ref
 */
export const useInvoiceDetailTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions, type: 'edit' | 'detail') => {
  const [canSave, setCanSave] = useState<boolean>(true)

  const invoiceDetailComponents = {
    body: {
      row: ProductEditableRow,
      cell: ProductTableCell,
    },
  }

  const handleSave = (row) => {
    return new Promise((resolve) => {
      setCanSave(true)
      const newData = [...ctx.getFieldValue('rows')]
      const index = newData.findIndex((item) => row.id === item.id)
      const item = { ...row }
      const count = row.currentNumber || 0
      item['taxMoneyAmount'] = (((item.price * count) / (1 + item.taxRate / 100)) * (item.taxRate / 100)).toFixed(2) // 税额
      item['currentMoneyAmount'] = (item.price * count).toFixed(2) // 本次开票金额(含税)
      item['currentMoneyNoTax'] = ((item.price * count) / (1 + item.taxRate / 100)).toFixed(2) // 本次开票金额（不含税）
      newData[index] = item
      ctx.setFieldValue('rows', newData)
      resolve({ item, newData })
    })
  }

  const handleError = () => {
    setCanSave(false)
  }

  const handleDelete = (row) => {
    let newData = [...ctx.getFieldValue('rows')]
    newData = newData.filter((item) => item.id !== row.id)
    ctx.setFieldValue('rows', newData)
  }

  const invoiceMergeColumns = (type === 'detail' ? invoiceDetailColumn : addInvoiceDetailColumn).map((col) => {
    if (col.showTotal && ctx) {
      const rowsData = ctx.getFieldValue('rows')
      if (rowsData && rowsData.length > 0) {
        let total = 0
        rowsData.forEach((item) => {
          total += Number(item[col.dataIndex] || 0)
        })

        return {
          ...col,
          title: (
            <>
              {col.title}
              <div style={{ color: '#91959B', fontSize: 12, fontWeight: 400 }}>
                <span>{translate('web.common.currencySymbol')}</span>
                {total?.toFixed(2)}
              </div>
            </>
          ),
        }
      }
    }

    if (ctx && ctx.getFieldValue('operateType') === OperateType.detail) {
      if (col.action && col.action === 'delete') {
        return {
          key: 'action',
        }
      }

      return col
    }

    if (col.action && col.action === 'delete') {
      return {
        ...col,
        render: (_, row) => (
          <Button type="link" onClick={() => handleDelete(row)}>
            {intl.formatMessage({ id: 'common.button.delete' })}
          </Button>
        ),
      }
    }

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
        // formItemProps: col.formItemProps,
        handleSave,
        handleError,
      }),
    }
  })

  return {
    invoiceDetailColumns: invoiceMergeColumns,
    invoiceDetailComponents,
    canSave,
  }
}
