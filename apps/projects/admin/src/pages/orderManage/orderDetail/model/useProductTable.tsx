import React, { useRef, useMemo, useState } from 'react'
import { ISchemaFormActions, ISchemaFormAsyncActions, createControllerBox, useFormSpy } from '@apps/formily'
import { Button, Row, Col } from 'antd'
import { productInfoColumns } from '../constant'
import ProductTableCell, { ProductEditableRow } from '../components/productTableCell'
import { useModalTable } from './useModalTable'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'

const getUnitPriceTotal = (record) => {
  const purchaseCount = Number(record['purchaseCount']) || 0
  let unitPrice = 0
  Object.entries(record.unitPrice).forEach(([key, value]) => {
    const [min, max] = key.split('-').map((v) => Number(v))
    if (min === 0 && max === 0) {
      unitPrice = Number(value)
      return false
    }
    if (purchaseCount >= min && purchaseCount <= max) {
      // 处于该区间
      unitPrice = Number(value)
      return false
    }
  })
  return unitPrice * purchaseCount
}
export const useProductTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const productRef = useRef<any>({})
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type: 'checkbox' })
  const { pageStatus } = usePageStatus()
  const handleDelete = (record) => {
    const newData = [...ctx.getFieldValue('orderProductRequests')]
    // 删除formvalue
    const colIndex = newData.findIndex((v) => v.id === record.id)
    newData.splice(colIndex, 1)

    // 删除选中的项
    rowSelectionCtl.setSelectRow(newData)
    rowSelectionCtl.setSelectedRowKeys(newData.map((v) => v.id))
    ctx.setFieldValue('orderProductRequests', newData)
  }

  const [productColumns, setProductColumns] = useState(() => {
    if (pageStatus === PageStatus.ADD) {
      productInfoColumns[productInfoColumns.length - 1].render = (text, record) => {
        return (
          <>
            <Button type="link" onClick={() => handleDelete(record)}>
              删除
            </Button>
            <Button type="link">选择合并订单</Button>
          </>
        )
      }
    } else {
      return [...productInfoColumns].slice(0, productInfoColumns.length - 1)
    }

    return productInfoColumns
  })
  const productAddButton = (
    <Button onClick={() => productRef.current.setVisible(true)} block type="default" style={{ margin: '24px auto' }}>
      选择订单商品
    </Button>
  )
  const productComponents = {
    body: {
      row: ProductEditableRow,
      cell: ProductTableCell,
    },
  }

  const handleSave = (row) => {
    return new Promise((resolve, reject) => {
      const newData = [...ctx.getFieldValue('orderProductRequests')]
      const index = newData.findIndex((item) => row.id === item.id)
      const item = newData[index]
      row['price'] = getUnitPriceTotal(row)
      row['productId'] = row.id
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      ctx.setFieldValue('orderProductRequests', newData)
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
    productRef,
    productAddButton,
    productColumns: productMergeColumns,
    productComponents,
    visible,
    setVisible,
    rowSelection,
    rowSelectionCtl,
  }
}
