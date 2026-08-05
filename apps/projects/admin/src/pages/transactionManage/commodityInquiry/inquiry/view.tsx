import React, { useRef } from 'react'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { EyeAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import { formatTimeString } from '@/utils'
import StatusTag from '@/components/StatusTag'
import { getTradePlatformInquiryList } from '@apps/apis'
import { EXTERNALSTATE_COLOR } from '../constants/stateColor'
import useSelectOptions from './services/hooks/useSelectOptions'

const InquiryOrderSearch: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const columns: RecordColumns<any>[] = [
    {
      title: '询价单号',
      key: 'inquiryListNo',
      dataIndex: 'inquiryListNo',
      fixed: 'left',
      searchField: {
        main: true,
      },
      render: (text: any, record: any) => (
        <EyeAuthButton url={`/transactionManage/commodityInquiry/inquiry/detail?id=${record.id}`}>{text}</EyeAuthButton>
      ),
    },
    {
      title: '询价单摘要',
      key: 'details',
      dataIndex: 'details',
      searchField: 'Input',
    },
    {
      title: '询价会员',
      key: 'inquiryListMemberName',
      dataIndex: 'inquiryListMemberName',
      searchField: 'Input',
    },
    {
      title: '被询价会员',
      key: 'memberName',
      dataIndex: 'memberName',
      searchField: 'Input',
    },
    {
      title: '交付日期',
      key: 'deliveryTime',
      dataIndex: 'deliveryTime',
      render: (text: any) => formatTimeString(text),
    },
    {
      title: '报价截止时间',
      key: 'quotationAsTime',
      dataIndex: 'quotationAsTime',
      render: (text: any) => formatTimeString(text),
    },
    {
      title: '单据时间',
      key: 'voucherTime',
      dataIndex: 'voucherTime',
      searchField: {
        type: 'DateRange',
        name: ['startDocumentsTime', 'endDocumentsTime'],
        placeholder: ['开始时间', '结束时间'],
      },
      render: (text: any) => formatTimeString(text),
    },
    {
      title: '外部状态',
      key: 'externalState',
      dataIndex: 'externalState',
      searchField: 'Select',
      render: (text: any, record: any) => (
        <StatusTag type={EXTERNALSTATE_COLOR(text)} title={record.externalStateName} />
      ),
    },
  ]

  const fetchData = async (params) => {
    const payload = { ...params }
    const { data, code } = await getTradePlatformInquiryList(payload)
    if (code !== 1000) {
      return { data: [], totalCount: 0 }
    }
    return data
  }

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
export default InquiryOrderSearch
