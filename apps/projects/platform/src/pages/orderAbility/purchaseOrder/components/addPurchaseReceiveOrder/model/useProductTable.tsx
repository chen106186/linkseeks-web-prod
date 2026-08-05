import { useState } from 'react'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Button } from 'antd'
import { productInfoColumns } from '../constant'
import ProductTableCell, { ProductEditableRow } from '../components/productTableCell'
import { useIntl } from '@linkseeks/i18n'

export const getUnitPriceTotal = (record) => {
  const purchaseCount = Number(record['quantity']) || 0
  return Number(((record.price || 0) * purchaseCount).toFixed(2))
}

/**
 * @param ctx schemaAction
 */
export const useProductTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const intl = useIntl()

  const handleDelete = (record) => {
    const newData = [...ctx.getFieldValue('products')]
    // 删除formvalue
    const colIndex = newData.findIndex((v) => v.id === record.id)
    newData.splice(colIndex, 1)
    ctx.setFieldValue('products', newData)
  }

  const [productColumns, setProductColumns] = useState(() => {
    // 渲染操作
    productInfoColumns[productInfoColumns.length - 1].render = (text, record) => (
      <Button type="link" onClick={() => handleDelete(record)}>
        {intl.formatMessage({ id: 'purchaseOrder.shanchu', defaultMessage: '删除' })}
      </Button>
    )
    return productInfoColumns
  })

  const productComponents = {
    body: {
      row: ProductEditableRow,
      cell: ProductTableCell,
    },
  }

  const handleSave = (row) => {
    return new Promise((resolve, reject) => {
      const newData = [...ctx.getFieldValue('products')]
      const index = newData.findIndex((item) => row.id === item.id)
      const item = newData[index]
      // 算单行价格
      row['amount'] = getUnitPriceTotal(row)
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      ctx.setFieldValue('products', newData)
      resolve({ item, newData })
    })
  }

  const productMergeColumns = productColumns.map((col) => {
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
    productColumns: productMergeColumns,
    productComponents,
  }
}
