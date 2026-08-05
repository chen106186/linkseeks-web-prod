import React, { useRef, useState } from 'react'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Button, message } from 'antd'
import { PriceComp, materialInfoColumns } from '../constant'
import MaterialTableCell, { MaterialEditableRow } from '../components/materialTableCell'
import { useModalTable } from './useModalTable'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { OrderModalType } from '@/constants/order'
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
  record.unitPrice = pageStatus === PageStatus.EDIT ? record.price : record.unitPrice || record.price || 0
  if (typeof record.unitPrice === 'number') {
    return Number((record.unitPrice * purchaseCount).toFixed(2))
  }
  if (record.unitPrice) {
    record.unitPrice = sortByKey(record.unitPrice)
  }
  // fix 当没有传递unitPrice字段时 但有price字段时 补全unitPrice字段
  if (record.price && JSON.stringify(record.unitPrice) === '{}') {
    record.unitPrice = { '0-0': record.price }
  }
}

/**
 * @param ctx schemaAction
 */
export const useMaterialTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const materialRef = useRef<any>({})
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type: 'checkbox' })
  const { pageStatus } = usePageStatus()

  orderModel = ctx.getFieldValue('orderModel')

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

  const [materialColumns, setMaterialColumns] = useState(() => {
    if (pageStatus === PageStatus.ADD) {
      // 渲染操作
      materialInfoColumns[materialInfoColumns.length - 1].render = (text, record) => (
        <Button type="link" onClick={() => handleDelete(record)}>
          {intl.formatMessage({ id: 'common.button.delete' })}
        </Button>
      )
      // 渲染单价
      materialInfoColumns[8].render = (t, r) => {
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
      materialInfoColumns[0].render = (t, r) => {
        if (orderModel === OrderModalType['HAND_ORDER']) {
          return r.id
        } else {
          return r.id ? r.id : r.productId
        }
      }
    } else {
      // 渲染单价
      materialInfoColumns[8].render = (t, r) => (
        <span style={{ color: 'red' }}>
          {translate('web.common.currencySymbol')} {r.price}
        </span>
      )

      // 渲染商品ID
      materialInfoColumns[0].render = (t, r) => r.productId
      materialInfoColumns[materialInfoColumns.length - 1].render = (t, r) => null
    }
    return materialInfoColumns
  })
  const handleShowMaterial = () => {
    const supplyMembersId = ctx.getFieldValue('supplyMembersId')
    if (supplyMembersId) {
      materialRef.current.setVisible(true)
    } else {
      message.error('请先选择采购询价合同')
    }
  }

  const materialAddButton = (
    <Button onClick={handleShowMaterial} block type="default" style={{ margin: '24px auto' }}>
      选择采购物料
    </Button>
  )
  const materialComponents = {
    body: {
      row: MaterialEditableRow,
      cell: MaterialTableCell,
    },
  }

  const handleSave = (row) => {
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
    materialRef,
    materialAddButton,
    materialColumns: materialMergeColumns,
    materialComponents,
    visible,
    setVisible,
    rowSelection,
    rowSelectionCtl,
  }
}
