import React, { useRef } from 'react'
import { formatTimeString } from '@/utils'
import { EyeAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import StatusTag from '@/components/StatusTag'
import { getLogisticsPlatformOrderPage } from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'

const EXTERNALSTATE_COLOR: any = (text) => {
  switch (Number(text)) {
    case 1:
      return 'warning'
    case 2:
      return 'primary'
    case 3:
      return 'danger'
    case 4:
      return 'success'
    default:
      return 'default'
  }
}

const OrderSearchList: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      const { sourceDate, ...rest } = params
      const payload = { ...rest }

      if (sourceDate) {
        const [startDate, endDate] = sourceDate.split(',')
        payload.invoicesTimeStart = formatTimeString(+startDate)
        payload.invoicesTimeEnd = formatTimeString(+endDate)
      }
      getLogisticsPlatformOrderPage({ ...params }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '物流单号',
      key: 'logisticsOrderNo',
      dataIndex: 'logisticsOrderNo',
      fixed: 'left',
      searchField: {
        main: true,
      },
      render: (text: any, reconds: any) => (
        <EyeAuthButton url={`/logisticsManage/logisticsList/detail?id=${reconds.id}`}>{text}</EyeAuthButton>
      ),
    },
    {
      title: '对应订单号',
      key: 'relevanceOrderCode',
      dataIndex: 'relevanceOrderCode',
      searchField: {
        type: 'Input',
        title: '订单号',
      },
    },
    {
      title: '物流服务商',
      key: 'companyName',
      dataIndex: 'companyName',
      searchField: {
        type: 'Select',
        name: 'companyId',
        title: '物流服务商',
      },
    },
    {
      title: '发货方',
      key: 'shipperMemberName',
      dataIndex: 'shipperMemberName',
      searchField: 'Input',
    },
    {
      title: '收货方',
      key: 'receiverMemberName',
      dataIndex: 'receiverMemberName',
    },
    {
      title: '总箱数',
      key: 'totalCarton',
      dataIndex: 'totalCarton',
    },
    {
      title: '总重量',
      key: 'totalWeight',
      dataIndex: 'totalWeight',
    },
    {
      title: '总体积',
      key: 'totalVolume',
      dataIndex: 'totalVolume',
    },
    {
      title: '单据时间',
      key: 'invoicesTime',
      dataIndex: 'invoicesTime',
      searchField: {
        name: 'sourceDate',
        title: '单据时间（全部）',
        type: 'DateSelect',
      },
      render: (text: any) => <>{formatTimeString(text)}</>,
    },
    {
      title: '外部状态',
      dataIndex: 'status',
      key: 'status',
      searchField: 'Select',
      render: (text: any, record) => <StatusTag type={EXTERNALSTATE_COLOR(text)} title={record.statusName} />,
    },
  ]

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        searchSelectMaps={selectData}
      />
    </PageHeaderWrapper>
  )
}

export default OrderSearchList
