import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { EyeAuthButton, EditAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { Button, Tag, Typography, Space } from 'antd'
import { OFFTER_EXTERNALSTATE_COLOR } from '../../purchaseAbility/constants'
// import {getPurchasePlatformPurchaseInquiryExamineList,postPurchasePlatformPurchaseInquiryExamineBatch} from '@apps/apis'
const { Text } = Typography
const AuditInquiryOne: React.FC = () => {
  const ref = useRef({} as ActionType)

  /** 批量审核 */
  const fetchSubmitBatch = async () => {
    // const res = await postPurchasePlatformPurchaseInquiryExamineBatch({ ids: rowkeys })
    // if (res.code === 1000) {
    //   ref.current.reload()
    // }
  }
  const columns: RecordColumns<any>[] = [
    {
      title: '需求单号/摘要',
      key: 'purchaseInquiryNo',
      dataIndex: 'purchaseInquiryNo',
      fixed: 'left',
      searchField: [
        {
          main: true,
          title: '需求单号',
          name: 'purchaseInquiryNo',
          type: 'Input',
        },
        {
          title: '需求摘要',
          name: 'details',
          type: 'Input',
        },
      ],
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <EyeAuthButton
            url={`/purchaseManage/demandVouch/auditDemandInquiry/detail?id=${record.id}&number=${record.purchaseInquiryNo}`}
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
      },
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
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      fixed: 'right',
      render: (text: any, record: any) => (
        <>
          <EditAuthButton>
            <Button
              type="link"
              onClick={() =>
                history.push(
                  `/purchaseManage/demandVouch/auditDemandInquiry/edit?id=${record.id}&number=${record.purchaseInquiryNo}`,
                )
              }
            >
              审核
            </Button>
          </EditAuthButton>
        </>
      ),
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      resolve({ data: [], totalCount: 0 })
    })
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        isRowSelection
        searchButtons={[
          {
            key: 'examineBatch',
            children: '批量提交审核',
            disabled: ref.current?.selectionKeys?.length === 0,
            onClick() {
              fetchSubmitBatch()
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}
export default AuditInquiryOne
