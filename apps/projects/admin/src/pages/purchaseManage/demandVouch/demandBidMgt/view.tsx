import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { EyeAuthButton, DetailAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { Tag, Button, Typography, Rate } from 'antd'
import { getPurchaseQuotedPricePlatformList } from '@apps/apis'
import { OFFTER_EXTERNALSTATE_COLOR, OFFTER_INTERNALSTATE_COLOR, CHNUM_TYPE } from '../../purchaseAbility/constants'

const { Text } = Typography

const DemandBidMgt: React.FC = () => {
  const ref = useRef({} as ActionType)

  const columns: RecordColumns<any>[] = [
    {
      title: '需求单号',
      key: 'purchaseInquiryNo',
      dataIndex: 'purchaseInquiryNo',
      searchField: {
        main: true,
      },
      fixed: 'left',
      render: (text: any, record: any) => (
        <EyeAuthButton
          url={`/purchaseManage/demandVouch/demandBidMgt/demand?id=${record.purchaseInquiryId}&number=${record.purchaseInquiryNo}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: '需求摘要',
      key: 'details',
      dataIndex: 'details',
      searchField: [
        {
          type: 'Input',
          name: 'details',
          title: '需求摘要',
        },
        {
          type: 'Input',
          name: 'memberName',
          title: '需求会员',
        },
      ],
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
      title: '报价轮次',
      key: 'turn',
      dataIndex: 'turn',
      render: (text: any) => (
        <>
          <Rate
            count={3}
            character="▌"
            disabled
            className="rate_style"
            style={{
              fontSize: '12px',
              color: '#00A98F',
            }}
            value={text}
            allowHalf
          />
          <Text>第{CHNUM_TYPE[text]}轮</Text>
        </>
      ),
    },
    {
      title: '有效报价数',
      key: 'count',
      dataIndex: 'count',
      render: (text) => (text ? text : '0'),
    },
    {
      title: '外部状态',
      key: 'externalState',
      dataIndex: 'externalState',
      render: (text: any, record: any) => (
        <Tag color={OFFTER_EXTERNALSTATE_COLOR[text]}>{record.externalStateName}</Tag>
      ),
    },
    {
      title: '内部状态',
      key: 'interiorState',
      dataIndex: 'interiorState',
      render: (text: any, record: any) => (
        <Tag color={OFFTER_INTERNALSTATE_COLOR[text]}>{record.interiorStateName}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      fixed: 'right',
      render: (text: any, record: any) => (
        <DetailAuthButton>
          <Button
            type="link"
            onClick={() =>
              history.push(
                `/purchaseManage/demandVouch/demandBidMgt/detail?id=${record.id}&number=${record.quotedPriceNo}&turn=${record.turn}`,
              )
            }
          >
            查看
          </Button>
        </DetailAuthButton>
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
    const { data, code } = await getPurchaseQuotedPricePlatformList(payload)
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
export default DemandBidMgt
