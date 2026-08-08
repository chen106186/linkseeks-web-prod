import React, { useRef } from 'react'
import { Tag, Typography, Space } from 'antd'
import { EyeAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { getPurchasePlatformPurchaseInquiryList } from '@apps/apis'
import { formatTimeString } from '@/utils'
import { OFFTER_EXTERNALSTATE_COLOR } from '../../purchaseAbility/constants'

const { Text } = Typography

const DemandInquiry: React.FC = () => {
  const ref = useRef({} as ActionType)
  const columns: RecordColumns<any>[] = [
    {
      title: '需求单号/摘要',
      key: 'purchaseInquiryNo',
      dataIndex: 'purchaseInquiryNo',
      fixed: 'left',
      searchField: {
        main: true,
      },
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <EyeAuthButton
            url={`/purchaseManage/demandVouch/demandInquiry/detail?id=${record.id}&number=${record.purchaseInquiryNo}`}
          >
            {text}
          </EyeAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
    },
    {
      title: '需求会员',
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
      key: 'offerEndTime',
      dataIndex: 'offerEndTime',
      render: (text: any) => formatTimeString(text),
    },
    {
      title: '单据时间',
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any) => formatTimeString(text),
      searchField: {
        type: 'DateSelect',
        name: 'sourceDate',
        title: '单据时间（全部）',
      },
    },
    {
      title: '外部状态',
      key: 'externalState',
      dataIndex: 'externalState',
      searchField: {
        type: 'Select',
        valueEnum: [
          {
            label: '作废',
            value: -1,
          },
          {
            label: '已完成',
            value: 99,
          },
          {
            label: '待提交需求单',
            value: 1,
          },
          {
            label: '待审核需求单',
            value: 2,
          },
          {
            label: '待提交报价单',
            value: 3,
          },
          {
            label: '待确认授标结果',
            value: 4,
          },
        ],
      },
      render: (text: any, record: any) => (
        <Tag color={OFFTER_EXTERNALSTATE_COLOR[text]}>{record.externalStateName}</Tag>
      ),
    },
  ]

  const fetchData = async (params: any) => {
    const { sourceDate, ...resetParams } = params
    const payload = { ...resetParams }
    if (sourceDate) {
      const [startDate, endDate] = sourceDate.split(',')
      payload.startTime = startDate
      payload.endTime = endDate
    }
    const { data, code } = await getPurchasePlatformPurchaseInquiryList(payload)
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
      />
    </PageHeaderWrapper>
  )
}
export default DemandInquiry
