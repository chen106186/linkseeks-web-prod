import { useRef, useState } from 'react'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Button, message } from 'antd'
import { PriceComp, productInfoColumns } from '../constant'
import ProductTableCell, { ProductEditableRow } from '../components/productTableCell'
import { useModalTable } from './useModalTable'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { useIntl } from '@linkseeks/i18n'

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
  const purchaseCount = Number(record.purchaseCount) || 0
  if (record.unitPrice) {
    record.unitPrice = sortByKey(record.unitPrice)
  }

  let unitPrice = 0
  Object.entries(record.unitPrice).forEach(([key, value]) => {
    const [min, max] = key.split('-').map((v) => Number(v))
    if (min === 0 && max === 0) {
      unitPrice = Number(value)
      return false
    }
    if ((purchaseCount >= min && purchaseCount <= max) || purchaseCount > max) {
      // 处于该区间或者大于该区间
      unitPrice = Number(value)
      return false
    }
  })
  // 考虑会员折扣
  const memberPrice = record.memberPrice
  if (record.isMemberPrice) {
    return Number((unitPrice * purchaseCount * memberPrice).toFixed(2))
  } else {
    return Number((unitPrice * purchaseCount).toFixed(2))
  }
}

/**
 * @param ctx schemaAction
 */
export const useProductTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const { pageStatus } = usePageStatus()
  const productRef = useRef<any>({})
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type: 'checkbox' })
  const intl = useIntl()
  const handleDelete = (record) => {
    const newData = [...ctx.getFieldValue('products')]
    // 删除formvalue
    const colIndex = newData.findIndex((v) => v.id === record.id)
    newData.splice(colIndex, 1)

    // 删除选中的项
    rowSelectionCtl.setSelectRow(newData)
    rowSelectionCtl.setSelectedRowKeys(newData.map((v) => v.id))
    ctx.setFieldValue('products', newData)

    // 商品行数变动 清空之前的支付信息
    if (pageStatus === PageStatus.ADD) {
      ctx.setFieldValue('payments', [])
    }
  }

  const [productColumns] = useState(() => {
    if (pageStatus === PageStatus.ADD) {
      // 渲染操作
      productInfoColumns[productInfoColumns.length - 1].render = (text, record) => (
        <Button type="link" onClick={() => handleDelete(record)}>
          {intl.formatMessage({ id: 'purchaseOrder.delete' })}
        </Button>
      )

      // 渲染单价
      productInfoColumns[5].render = (t, r) => {
        return r.price ? (
          <span style={{ color: 'red' }}>
            {intl.formatMessage({ id: 'common.money' })} {r.price}
          </span>
        ) : (
          <PriceComp priceSection={r.unitPrice} />
        )
      }
      // 渲染商品ID
      productInfoColumns[0].render = (t, r) => {
        return r.id
      }
    } else {
      // 渲染单价
      productInfoColumns[5].render = (t, r) => (
        <span style={{ color: 'red' }}>
          {intl.formatMessage({ id: 'common.money' })} {r.price}
        </span>
      )

      // 渲染商品ID
      productInfoColumns[0].render = (t, r) => r.productId

      return [...productInfoColumns].slice(0, productInfoColumns.length - 1)
    }

    return productInfoColumns
  })
  const handleShowProduct = () => {
    const buyerMemberId = ctx.getFieldValue('buyerMemberId')
    const shopId = ctx.getFieldValue('shopId')
    if (buyerMemberId && shopId) {
      productRef.current.setVisible(true)
    } else {
      message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.model.message3' }))
    }
  }

  const productAddButton = (
    <Button onClick={handleShowProduct} block type="default" style={{ margin: '24px auto' }}>
      {intl.formatMessage({ id: 'purchaseOrder.orderCollect.model.button1' })}
    </Button>
  )
  const productComponents = {
    body: {
      row: ProductEditableRow,
      cell: ProductTableCell,
    },
  }

  const handleSave = (row) => {
    // 商品采购数量变动 清空之前的支付信息
    if (pageStatus === PageStatus.ADD) {
      ctx.setFieldValue('payments', [])
    }
    return new Promise((resolve) => {
      const newData = [...ctx.getFieldValue('products')]
      const index = newData.findIndex((item) => row.id === item.id)
      const item = newData[index]
      row.money = getUnitPriceTotal(row)
      row.productId = row.commodityId
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
