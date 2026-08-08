import React, { useRef } from 'react'
import { EyeAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { authService } from '@apps/services'
import { getOrderPlatformManagePage, getOrderPlatformManageExport } from '@apps/apis'
import { exportFile } from '@apps/utils'

const baseOrderListColumns: RecordColumns<any>[] = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    searchField: {
      main: true,
    },
    fixed: 'left',
    render: (text, record) => (
      <EyeAuthButton url={`/orderManage/list/detail?id=${record.orderId}`}>{text}</EyeAuthButton>
    ),
  },
  {
    title: '订单摘要',
    dataIndex: 'digest',
    key: 'digest',
    searchField: 'Input',
  },
  {
    title: '采购会员',
    dataIndex: 'buyerMemberName',
    key: 'buyerMemberName',
    searchField: 'Input',
  },
  {
    title: '供应会员',
    dataIndex: 'vendorMemberName',
    key: 'vendorMemberName',
    searchField: 'Input',
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text) => formatTimeString(text),
    searchField: {
      type: 'DateRange',
      title: '下单时间',
      name: ['startDate', 'endDate'],
      placeholder: ['开始时间', '结束时间'],
    },
  },
  {
    title: '订单总额',
    dataIndex: 'amount',
    key: 'amount',
    render: (t, r) => {
      // 积分兑换订单显示0
      if (r.orderTypeName === '积分兑换') {
        return '0'
      }
      return r.orderType === 7 || r.orderType === 8 ? t : '￥' + t
    },
  },
  {
    title: '积分',
    dataIndex: 'points',
    key: 'points',
    render: (text, record) => {
      // 如果是积分兑换订单且总金额为0，积分列显示总金额的值
      if (record.orderTypeName === '积分兑换') {
        return record.amount
      }
      return text || '-'
    },
  },
  {
    title: '送货地址',
    dataIndex: 'deliverAddress',
    key: 'deliverAddress',
    width: 164,
    ellipsis: true,
  },
  {
    title: '订单类型',
    dataIndex: 'orderTypeName',
    key: 'orderTypeName',
  },
  {
    title: '外部状态',
    dataIndex: 'outerStatusName',
    key: 'outerStatusName',
    fixed: 'right',
    width: 110,
  },
  {
    title: '售后情况',
    dataIndex: 'afterSaleStatusName',
    key: 'afterSaleStatusName',
    fixed: 'right',
    width: 110,
  },
]

const fetchTableData = async (params) => {
  const { data } = await getOrderPlatformManagePage(params)
  return data
}

// 订单查询
const OrderList: React.FC = () => {
  const { token } = authService.getAuth() || {}
  const ref = useRef({} as ActionType)
  const fetchParams = useRef<any>({})
  const secondColumns: any[] = baseOrderListColumns.concat([])

  const fetchData = (params) => {
    const payload = { ...params }
    if (payload.startDate) {
      payload.startDate = formatTimeString(payload.startDate, 'YYYY-MM-DD')
    }
    if (payload.endDate) {
      payload.endDate = formatTimeString(payload.endDate, 'YYYY-MM-DD')
    }
    fetchParams.current = { ...payload }
    return fetchTableData(payload)
  }

  const handleExport = async () => {
    const p = { ...fetchParams.current }
    delete p.current
    delete p.pageSize
    let exportParams = ''
    Object.keys(p).forEach((item) => {
      if (p[item]) {
        exportParams += `&${item}=${p[item]}`
      }
    })
    exportFile(getOrderPlatformManageExport, exportParams)
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={secondColumns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="orderNo"
        actionRef={ref}
        searchButtons={[
          {
            key: 'export',
            children: '导出',
            onClick() {
              handleExport()
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default OrderList
