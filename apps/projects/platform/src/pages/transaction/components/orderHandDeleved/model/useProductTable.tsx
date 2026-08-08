import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import ProductTableCell, { ProductEditableRow } from '../components/productTableCell'
import { productColumns, materialColumns } from '../constant'

/**
 * @param ctx schemaAction
 */
export const useProductTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions, kind: boolean) => {
  const productComponents = {
    body: {
      row: ProductEditableRow,
      cell: ProductTableCell,
    },
  }

  const handleSave = (row) => {
    return new Promise((resolve) => {
      const newData = [...ctx.getFieldValue('products')]
      // 全部以orderProductId为唯一
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

  const materialMergeColumns = materialColumns.map((col) => {
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
    productColumns: kind ? materialMergeColumns : productMergeColumns,
    productComponents,
  }
}
