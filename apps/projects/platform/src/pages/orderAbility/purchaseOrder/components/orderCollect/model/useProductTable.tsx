import React, { useRef, useState } from 'react'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Button, message } from 'antd'
import { PriceComp, productInfoColumns } from '../constant'
import ProductTableCell, { ProductEditableRow } from '../components/productTableCell'
import { useModalTable } from './useModalTable'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { OrderModalType } from '@/constants/order'
import { useQuery } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
let orderModel = null

// 对象按key排序（运用于商城传过来的阶梯价格排序）
export const sortByKey = (params) => {
  let keys = Object.keys(params).sort((x, y) => parseInt(x) - parseInt(y))
  let newParams = {}
  keys.forEach((key) => {
    newParams[key] = params[key]
  })
  return newParams
}

export const getUnitPriceTotal = (record, pageStatus) => {
  const purchaseCount = Number(record['purchaseCount']) || 0
  // fix 当没有传递unitPrice字段时 自动容错， 单价显示为0
  // fix 编辑订单取price
  record.unitPrice = pageStatus === PageStatus.EDIT ? record.price : record.unitPrice || record.price || 0
  if (typeof record.unitPrice === 'number') {
    return record.isMemberPrice
      ? Number((record.unitPrice * purchaseCount * record.memberPrice).toFixed(2))
      : Number((record.unitPrice * purchaseCount).toFixed(2))
  }
  if (record.unitPrice) {
    record.unitPrice = sortByKey(record.unitPrice)
  }
  // fix 当没有传递unitPrice字段时 但有price字段时 补全unitPrice字段
  if (record.price && JSON.stringify(record.unitPrice) === '{}') {
    record.unitPrice = { '0-0': record.price }
  }
  // fix 当有unitPrice字段时 没有price字段时 补全price字段
  if (!record?.price && JSON.stringify(record.unitPrice) !== '{}') {
    if (Object.keys(record.unitPrice)[0] === '0-0') record.price = record.unitPrice['0-0']
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
  let memberPrice = record.memberPrice
  if (record.isMemberPrice) {
    return Number((unitPrice * purchaseCount * memberPrice).toFixed(2))
  } else {
    return Number((unitPrice * purchaseCount).toFixed(2))
  }
}

/**
 * @param ctx schemaAction
 * @param mergeRef 操作合并订单的ref
 */
export const useProductTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions, mergeRef: any) => {
  const productRef = useRef<any>({})
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type: 'checkbox' })
  const { pageStatus } = usePageStatus()

  orderModel = ctx.getFieldValue('orderModel')

  const { type } = useQuery()

  const handleDelete = (record) => {
    const newData = [...ctx.getFieldValue('orderProductRequests')]
    // 删除formvalue
    const colIndex = newData.findIndex((v) => v.id === record.id)
    newData.splice(colIndex, 1)

    // 删除选中的项
    rowSelectionCtl.setSelectRow(newData)
    rowSelectionCtl.setSelectedRowKeys(newData.map((v) => v.id))
    ctx.setFieldValue('orderProductRequests', newData)

    // 商品行数变动 清空之前的支付信息
    if (pageStatus === PageStatus.ADD) {
      console.log('Add')
      let paymentInfo = ctx.getFieldValue('paymentInformationResponses').map((item) => {
        let _item = { ...item }
        delete _item.channel
        delete _item.payWay
        delete _item.payRatio
        return _item
      })
      ctx.setFieldValue('paymentInformationResponses', [])
      // ctx.setFieldValue('paymentInformationResponses', paymentInfo)
    }
  }

  const clickMergeButton = (recrod) => {
    mergeRef.current.setVisible(true)
    mergeRef.current.setCurrentClickRow(recrod)
  }

  const [productColumns, setProductColumns] = useState(() => {
    if (pageStatus === PageStatus.ADD) {
      // 渲染操作
      productInfoColumns[productInfoColumns.length - 1].render = (text, record) => {
        return (
          <>
            {orderModel === OrderModalType['CONSOLIDATED_ORDER'] && (
              <Button type="link" className="selectMerge" onClick={() => clickMergeButton(record)}>
                选择合并订单
              </Button>
            )}
            <Button type="link" onClick={() => handleDelete(record)}>
              {intl.formatMessage({ id: 'common.button.delete' })}
            </Button>
          </>
        )
      }

      // @todo 可能需要单独考虑合并订单
      // 渲染单价
      productInfoColumns[5].render = (t, r) => {
        if (orderModel === OrderModalType['HAND_ORDER']) {
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
        if (orderModel === OrderModalType['HAND_ORDER']) {
          return r.id
        } else {
          // return r.id ? r.id : r.productId
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

      // 编辑并且为合并下单模式 显示合并按钮 url type===4判断类型
      if (pageStatus === PageStatus.EDIT && type) {
        productInfoColumns[productInfoColumns.length - 1].render = (text, record) => (
          <Button type="link" className="selectMerge" onClick={() => clickMergeButton(record)}>
            选择合并订单
          </Button>
        )
        return [...productInfoColumns]
      } else {
        return [...productInfoColumns].slice(0, productInfoColumns.length - 1)
      }
    }

    return productInfoColumns
  })
  const handleShowProduct = () => {
    const supplyMembersId = ctx.getFieldValue('supplyMembersId')
    if (supplyMembersId) {
      productRef.current.setVisible(true)
    } else {
      message.error('请先选择供应会员')
    }
  }

  const productAddButton = (
    <Button onClick={handleShowProduct} block type="default" style={{ margin: '24px auto' }}>
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
    // 商品采购数量变动 清空之前的支付信息
    if (pageStatus === PageStatus.ADD) {
      ctx.setFieldValue('paymentInformationResponses', [])
    }
    return new Promise((resolve, reject) => {
      const newData = [...ctx.getFieldValue('orderProductRequests')]
      const index = newData.findIndex((item) => row.id === item.id)
      const item = newData[index]
      row['money'] = getUnitPriceTotal(row, pageStatus)
      // 通过下单模式判断 是否是手工或者渠道手工下单
      let addModel = ctx.getFieldValue('orderModel')
      row['productId'] =
        (addModel === OrderModalType['HAND_ORDER'] ||
          addModel === OrderModalType['CHANNEL_DIRECT_MINING_ORDER'] ||
          addModel === OrderModalType['CHANNEL_SPOT_MANUAL_ORDER']) &&
        pageStatus === PageStatus.ADD
          ? row.id
          : row.productId
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
