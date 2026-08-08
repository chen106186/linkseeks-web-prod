import React, { useRef, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Button, message } from 'antd'
import { PriceComp, productInfoColumns } from '../constant'
import ProductTableCell, { ProductEditableRow } from '../components/productTableCell'
import { useModalTable } from './useModalTable'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { OrderModalType } from '@/constants/order'
import { getWebIntl } from '@apps/locales'

let orderMode = null
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

export const getUnitPriceTotal = (record) => {
  const purchaseCount = Number(record['purchaseCount']) || 0
  return Number((record.price * purchaseCount).toFixed(2))
}

/**
 * @param ctx schemaAction
 */
export const useProductTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const { pageStatus } = usePageStatus()
  const productRef = useRef<any>({})
  const intl = useIntl()
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type: 'checkbox' })

  orderMode = ctx.getFieldValue('orderMode')

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
      ctx.setFieldValue('paymentInformationResponses', [])
    }
  }

  const [productColumns, setProductColumns] = useState(() => {
    if (pageStatus === PageStatus.ADD) {
      // 渲染操作
      productInfoColumns[productInfoColumns.length - 1].render = (text, record) => (
        <Button type="link" onClick={() => handleDelete(record)}>
          {intl.formatMessage({ id: 'common.button.delete' })}
        </Button>
      )

      // 渲染单价
      productInfoColumns[5].render = (t, r) => {
        if (orderMode === OrderModalType['HAND_ORDER']) {
          return <PriceComp priceSection={r.unitPrice} />
        } else {
          return r.price ? (
            <span style={{ color: 'red' }}>
              {translate('web.common.currencySymbol')} {r.price}
            </span>
          ) : (
            <PriceComp priceSection={r.unitPrice} />
          )
        }
      }
      // 渲染商品ID
      productInfoColumns[0].render = (t, r) => {
        if (orderMode === OrderModalType['HAND_ORDER']) {
          return r.id
        } else {
          return r.productId || r.id
        }
      }
    } else {
      // 渲染单价
      productInfoColumns[5].render = (t, r) => (
        <span style={{ color: 'red' }}>
          {translate('web.common.currencySymbol')} {r.price}
        </span>
      )

      // 渲染商品ID
      productInfoColumns[0].render = (t, r) => r.productId

      return [...productInfoColumns].slice(0, productInfoColumns.length - 1)
    }

    return productInfoColumns
  })

  const productComponents = {
    body: {
      row: ProductEditableRow,
      cell: ProductTableCell,
    },
  }

  const handleSave = (row) => {
    // 商品采购数量变动 清空之前的支付信息
    if (pageStatus === PageStatus.ADD) {
      ctx.setFieldValue('paymentInformationResponses', [])
    }
    return new Promise((resolve, reject) => {
      const newData = [...ctx.getFieldValue('products')]
      console.log(newData, row)
      const index = newData.findIndex((item) => row.productId === item.productId)
      const item = newData[index]
      row['money'] = getUnitPriceTotal(row)
      row['productId'] = row.productId
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
    productColumns: productMergeColumns,
    productComponents,
    visible,
    setVisible,
    rowSelection,
    rowSelectionCtl,
  }
}
