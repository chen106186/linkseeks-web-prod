import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import ProductTableCell, { ProductEditableRow } from './productTableCell'
import { productColumns } from './constant'

export const useProductTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const productComponents = {
    body: {
      row: ProductEditableRow,
      cell: ProductTableCell,
    },
  }

  const handleSave = (row) => {
    return new Promise((resolve) => {
      const newData = [...(ctx.getFieldValue('products') || [])]
      const index = newData.findIndex((item) => row.orderProductId === item.orderProductId)
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      ctx.setFieldValue('products', newData)
      resolve({ item, newData })
    })
  }

  return {
    productColumns: productColumns.map((col) => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: true,
          dataIndex: col.dataIndex,
          title: col.title,
          formItem: col.formItem,
          formItemProps: col.formItemProps,
          handleSave,
        }),
      }
    }),
    productComponents,
  }
}
