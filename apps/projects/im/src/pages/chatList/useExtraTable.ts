import { StandardFormTable } from '@apps/components'
import { sendCustomMessage } from './sendCustomMessage'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

export const useExtraTable = (afterType) => {
  const orderRef = StandardFormTable.useTableRef()
  const orderColumns = StandardFormTable.createColumns([
    {
      key: 'orderNo',
      title: '订单号',
      searchField: {
        main: true,
        type: 'Input',
      },
    },
    { key: 'digest', title: '订单商品摘要', searchField: 'Input' },
    {
      key: 'createTime',
      title: '下单时间',
      searchField: {
        type: 'DateRange',
        title: '下单时间',
        name: ['startDate', 'endDate'],
        placeholder: ['开始时间', '结束时间'],
        format: true,
      },
    },
    { key: 'orderTypeName', title: '订单类型' },
    { key: 'outerStatusName', title: '订单状态' },
  ])

  const commodityRef = StandardFormTable.useTableRef()
  // const { data: _categoryData } = useRequestApi(getProductCustomerGetCustomerCategoryTree)
  // const { data: brandData } = useRequestApi(getProductSelectGetSelectBrand)

  // const categoryData = useMemo(() => {
  //   const transform = (list) =>
  //     list.map((v) => ({
  //       label: v.name,
  //       value: v.id,
  //       children: v.children ? transform(v.children) : null,
  //     }))
  //   return _categoryData ? transform(_categoryData) : []
  // }, [_categoryData])

  const commodityColumns = StandardFormTable.createColumns([
    { key: 'id', title: '商品ID', searchField: { type: 'Input', name: 'productId' } },
    { key: 'name', title: '商品名称', searchField: { main: true, type: 'Input' } },
    {
      key: 'categoryName',
      title: '品类',
      // searchField: { type: 'Cascader', name: 'customerCategoryId', valueEnum: categoryData },
    },
    {
      key: 'brandName',
      title: '品牌',
      // searchField: {
      //   type: 'Cascader',
      //   name: 'brandId',
      //   valueEnum: brandData?.map((v) => ({
      //     label: v.name,
      //     value: v.id,
      //   })),
      // },
    },
    { key: 'unitName', title: '单位' },
    // { key: 'outerStatusName', title: '库存数量' },
  ])

  const afterRef = StandardFormTable.useTableRef()
  const afterColumns = StandardFormTable.createColumns([
    { key: 'applyNo', title: '申请单号', searchField: { main: true, type: 'Input' } },
    { key: 'applyAbstract', title: '申请单摘要', searchField: 'Input' },
    { key: 'createTime', title: '申请单类型', render: () => (afterType?.[0] == 1 ? '换货申请单' : '退货申请单') },
    {
      key: 'applyTime',
      title: '单据时间',
      searchField: {
        type: 'DateRange',
        title: '单据时间',
        name: ['startTime', 'endTime'],
        placeholder: ['开始时间', '结束时间'],
        format: true,
      },
    },
    { key: 'innerStatusName', title: '申请单状态' },
  ])

  const handleOk = (type, payload) => {
    let sendMessage: any
    // 发送消息后，清空所有已经选择过的选项
    if (type === 'order') {
      // 订单
      sendMessage = orderRef.current.getSelectionItems()?.length > 0 ? orderRef.current.getSelectionItems()[0] : ''
      orderRef?.current?.clearSelection()
    } else if (type === 'commodity') {
      // 商品
      sendMessage =
        commodityRef?.current?.getSelectionItems()?.length > 0 ? commodityRef.current.getSelectionItems()[0] : ''
      commodityRef?.current?.clearSelection()
    } else if (type === 'after') {
      // 售后
      sendMessage = afterRef.current.getSelectionItems()?.length > 0 ? afterRef.current.getSelectionItems()[0] : ''
      afterRef?.current?.clearSelection()
    }

    if (sendMessage) {
      sendCustomMessage(sendMessage, type, payload)
    }
  }
  return {
    orderColumns,
    commodityColumns,
    afterColumns,
    orderRef,
    commodityRef,
    afterRef,
    handleOk,
  }
}
