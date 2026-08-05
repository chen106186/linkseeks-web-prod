import { useMemo, useRef, useState } from 'react'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Button, message } from 'antd'
import { PriceComp, productInfoColumns } from '../constant'
import ProductTableCell, { ProductEditableRow } from '../components/productTableCell'
import { useModalTable } from './useModalTable'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { useIntl } from '@linkseeks/i18n'
import { ModalFormTable } from '@apps/components'
import {
  getProductCustomerGetMemberCustomerCategoryTree,
  GetProductCustomerGetMemberCustomerCategoryTreeResponse,
  getProductSelectGetMemberBrand,
  GetProductSelectGetMemberBrandResponse,
} from '@apps/apis'

// 对象按key排序（运用于商城传过来的阶梯价格排序）
export const sortByKey = (params) => {
  const keys = Object.keys(params).sort((x, y) => parseInt(x) - parseInt(y))
  const newParams = {}
  keys.forEach((key) => {
    newParams[key] = params[key]
  })
  return newParams
}

export const getUnitPriceTotal = (record, pageStatus) => {
  const purchaseCount = Number(record.purchaseCount) || 0
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
  const productTableRef = ModalFormTable.useTableRef()
  const intl = useIntl()
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type: 'checkbox' })
  const [customerCategoryList, setCustomerCategoryList] =
    useState<GetProductCustomerGetMemberCustomerCategoryTreeResponse>([])
  const [brandList, setBrandyList] = useState<GetProductSelectGetMemberBrandResponse>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const fetchCategoryList = () => {
    const params = {
      memberId: ctx.getFieldValue('vendorMemberId'),
      memberRoleId: ctx.getFieldValue('vendorRoleId'),
    }
    getProductCustomerGetMemberCustomerCategoryTree(params).then((res) => {
      if (res.code === 1000) {
        setCustomerCategoryList(res.data)
      }
    })
  }

  const fetchBrandList = () => {
    const params = {
      memberId: ctx.getFieldValue('vendorMemberId'),
      memberRoleId: ctx.getFieldValue('vendorRoleId'),
    }
    getProductSelectGetMemberBrand(params).then((res) => {
      if (res.code === 1000) {
        setBrandyList(res.data)
      }
    })
  }

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
        return r.price ? <span style={{ color: 'red' }}> {r.price}</span> : <PriceComp priceSection={r.unitPrice} />
      }
      // 渲染商品ID
      productInfoColumns[0].render = (t, r) => {
        return r.id
      }

      productInfoColumns[7].formItemProps = { disabled: false }
    } else {
      // 渲染单价
      productInfoColumns[5].render = (t, r) => <span style={{ color: 'red' }}> {r.price}</span>

      // 渲染商品ID
      productInfoColumns[0].render = (t, r) => r.productId

      // 禁用编辑
      productInfoColumns[7].formItemProps = { disabled: true }

      return [...productInfoColumns].slice(0, productInfoColumns.length - 1)
    }

    return productInfoColumns
  })
  const handleShowProduct = () => {
    const supplyMembersId = ctx.getFieldValue('vendorMemberName')
    const products = ctx.getFieldValue('products')
    if (supplyMembersId) {
      setSelectedIds(products && products.length > 0 ? products.map((item) => item.id) : [])
      productTableRef.current?.setVisible(true)
      fetchCategoryList()
      fetchBrandList()
      productTableRef.current?.reload()
    } else {
      message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.model.message' }))
    }
  }

  const productAddButton =
    pageStatus === PageStatus.ADD ? (
      <Button onClick={handleShowProduct} block type="default" style={{ margin: '24px auto' }}>
        {intl.formatMessage({ id: 'purchaseOrder.orderCollect.model.button1' })}
      </Button>
    ) : null
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
      console.log(newData, row)
      const index = newData.findIndex((item) => row.id === item.id)
      const item = newData[index]
      row.money = getUnitPriceTotal(row, pageStatus)
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

  const searchSelectMaps = useMemo(() => {
    return {
      customerCategoryId: customerCategoryList,
      brandId: brandList,
    }
  }, [customerCategoryList, brandList])

  return {
    productRef,
    productTableRef,
    productAddButton,
    productColumns: productMergeColumns,
    productComponents,
    searchSelectMaps,
    selectedIds,
    visible,
    setVisible,
    rowSelection,
    rowSelectionCtl,
  }
}
