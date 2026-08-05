import { useRef, useState } from 'react'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Button, message } from 'antd'
import { materialInfoColumns } from '../constant'
import MaterialTableCell, { MaterialEditableRow } from '../components/materialTableCell'
import { useModalTable } from './useModalTable'
import { PageStatus, usePageStatus } from '@/hooks/usePageStatus'
import { useIntl } from '@linkseeks/i18n'
import { formatTimeString } from '@/utils'
import { isEmpty } from 'lodash'

// 对象按key排序（运用于商城传过来的阶梯价格排序）
export const sortByKey = (params) => {
  const keys = Object.keys(params).sort((x, y) => parseInt(x) - parseInt(y))
  const newParams = {}
  keys.forEach((key) => {
    newParams[key] = params[key]
  })
  return newParams
}

export const getUnitPriceTotal = (record) => {
  const purchaseCount = Number(record.quantity) || 0
  return Number((record.price * purchaseCount).toFixed(2))
}

/**
 * @param ctx schemaAction
 */
export const useMaterialTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const { pageStatus } = usePageStatus()
  const materialRef = useRef<any>({})
  const intl = useIntl()
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({
    type: 'checkbox',
    customKey: 'productId',
  })
  const [visibleAddress, setVisibleAddress] = useState<boolean>(false)

  const handleDelete = (record) => {
    const newData = [...ctx.getFieldValue('products')]
    // 删除formvalue
    const colIndex = newData.findIndex((v) => v.productId === record.productId)
    newData.splice(colIndex, 1)

    // 删除选中的项
    rowSelectionCtl.setSelectRow(newData)
    rowSelectionCtl.setSelectedRowKeys(newData.map((v) => v.productId))
    if (isEmpty(newData)) {
      setVisibleAddress(false)
    }
    ctx.setFieldValue('products', newData)
  }

  const [materialColumns] = useState(() => {
    const tempColumn = [...materialInfoColumns]
    // if (pageStatus === PageStatus.ADD) {
    //   // 渲染操作
    tempColumn[tempColumn.length - 1].render = (text, record) => (
      <Button type="link" onClick={() => handleDelete(record)}>
        {intl.formatMessage({ id: 'purchaseOrder.delete' })}
      </Button>
    )
    // } else {
    //   tempColumn.pop()
    // }
    return tempColumn
  })
  const handleShowMaterial = () => {
    const vendorMemberName = ctx.getFieldValue('vendorMemberName')
    const products = ctx.getFieldValue('products')
    if (vendorMemberName) {
      materialRef.current.setVisible(true)
      materialRef.current.rowSelectionCtl.setSelectedRowKeys(() => products.map((item) => item.productId))
    } else {
      message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.materialOrder.error' }))
    }
  }

  const materialAddButton = (
    <Button onClick={handleShowMaterial} block type="default" style={{ margin: '24px auto' }}>
      {intl.formatMessage({ id: 'purchaseOrder.orderCollect.requisition.button' })}
    </Button>
  )
  const materialComponents = {
    body: {
      row: MaterialEditableRow,
      cell: MaterialTableCell,
    },
  }

  const handleSave = (row) => {
    return new Promise((resolve) => {
      const newData = [...ctx.getFieldValue('products')]
      const index = newData.findIndex((item) => row.productId === item.productId)
      const item = newData[index]
      // 算单行价格
      row.amount = getUnitPriceTotal(row)
      if (row.expectedDelivery) {
        row.expectedDelivery = formatTimeString(row.expectedDelivery, 'YYYY-MM-DD')
      } else {
        row.expectedDelivery = null
      }
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      console.log(newData, 'newData')
      const isVisibleAddress = newData.every((_item) => (_item?.deliverType || _item?.logistics) !== 1)
      setVisibleAddress(isVisibleAddress)
      ctx.setFieldValue('products', newData)
      resolve({ item, newData })
    })
  }

  const materialMergeColumns = materialColumns.map((col) => {
    if (!col.editable) {
      return col
    }

    if (col.dataIndex === 'price' && pageStatus === PageStatus.VARIATION) {
      return col
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        ctx,
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
    materialRef,
    materialAddButton,
    materialColumns: materialMergeColumns,
    materialComponents,
    visible,
    setVisible,
    rowSelection,
    rowSelectionCtl,
    visibleAddress,
    setVisibleAddress,
  }
}
