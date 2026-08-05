import React from 'react'
import { formatTimeString } from '@/utils'
import DrawerProcessDetail from '../components/ProcessDetail/DrawerProcessDetail'
import { ColumnsType } from 'antd/es/table'
/**
 * 通知单明细
 */
export const columns: ColumnsType<any> = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
  },
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
  },
  {
    title: '品类',
    dataIndex: 'category',
  },
  {
    title: '品牌',
    dataIndex: 'brand',
  },
  {
    title: '单位',
    dataIndex: 'unit',
  },
  {
    title: '订单数量',
    dataIndex: 'purchaseCount',
  },
  {
    title: '加工数量',
    dataIndex: 'processNum',
  },
  {
    title: '加工单价',
    dataIndex: 'processPrice',
  },
  {
    title: '加工费',
    dataIndex: 'processTotalPrice',
  },
  {
    title: '交期',
    dataIndex: 'deliveryDate',
    render: (text) => {
      return formatTimeString(text, 'YYYY-MM-DD')
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    render: (text, record: any) => {
      return (
        <DrawerProcessDetail
          type="view"
          id={record.productId}
          brand={record.brand}
          category={record.category}
          name={record.productName}
          productProps={record.property.specs}
          files={record.property.annex}
          unitName={record.unit}
          quantity={record.processNum}
          processUnitPrice={record.processPrice}
        >
          <a>查看加工明细</a>
        </DrawerProcessDetail>
      )
    },
  },
]
/**
 * 通知单明细
 */
const orderFilterList = ['订单号', '订单数量']
export const orderDetailColumn = columns.filter((item) => !orderFilterList.includes(item.title.toString()))

/**
 * 外部工作流记录
 */
export const innerWorkFlowRecordColumn: ColumnsType<any> = [
  {
    title: '流转记录',
    dataIndex: 'id',
  },
  {
    title: '操作人',
    dataIndex: 'operator',
  },
  {
    title: '部门',
    dataIndex: 'department',
  },
  {
    title: '职位',
    dataIndex: 'jobTitle',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '操作',
    dataIndex: 'operate',
  },
  {
    title: '操作时间',
    dataIndex: 'operateTime',
    render: (text) => {
      return formatTimeString(text)
    },
  },
  {
    title: '审核意见',
    dataIndex: 'opinion',
  },
]

/**
 * 内部流转
 */

export const outerWorkflowRecordsColumn: ColumnsType<any> = [
  {
    title: '流转顺序号',
    dataIndex: 'id',
  },
  {
    title: '操作角色',
    dataIndex: 'roleId',
  },
  {
    title: '状态',
    dataIndex: 'roleName',
  },
  {
    title: '操作',
    dataIndex: 'operate',
  },
  {
    title: '操作时间',
    dataIndex: 'operateTime',
    render: (text) => {
      return formatTimeString(text)
    },
  },
  {
    title: '审核意见',
    dataIndex: 'opinion',
  },
]

/**
 * 生产通知单收货统计
 */

export const receiveColumns = (type: 'order' | 'product'): ColumnsType<any> => {
  /**
   * 如果是商品加工，那么没有订单号
   */
  const temp = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
    },
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
    },
    {
      title: '品类',
      dataIndex: 'category',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
    {
      title: '加工数量',
      dataIndex: 'processNum',
    },
    {
      title: '加工单价',
      dataIndex: 'processPrice',
    },
    {
      title: '加工费',
      dataIndex: 'processTotalPrice',
    },
    {
      title: '交期',
      dataIndex: 'deliveryDate',
      render: (text) => {
        return formatTimeString(text, 'YYYY-MM-DD')
      },
    },
    {
      title: '已发货',
      dataIndex: 'deliverNum',
    },
    {
      title: '已收货',
      dataIndex: 'receiveNum',
    },
    {
      title: '差异数量',
      dataIndex: 'differenceNum',
    },
    {
      title: '未发货',
      dataIndex: 'notDeliverNum',
    },
  ]
  if (type === 'order') {
    return temp
  }
  return temp.slice(1)
}

export const pnoReceiveDeliverDetailDOListColumns = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
  },
  {
    title: 'ID',
    dataIndex: 'productId',
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
  },
  {
    title: '品类',
    dataIndex: 'category',
  },
  {
    title: '品牌',
    dataIndex: 'brand',
  },
  {
    title: '单位',
    dataIndex: 'unit',
  },
  {
    title: '加工数量',
    dataIndex: 'processNum',
  },
  {
    title: '发货数量',
    dataIndex: 'deliverNum',
  },
]
