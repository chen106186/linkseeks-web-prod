import React, { useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { Typography, Space, Button } from 'antd'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'

import { EyeAuthButton, DetailAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import StatusTag from '@/components/StatusTag'
import { formatTimeString } from '@/utils'

import ModalOperate from '../../purchaseAbility/components/modalOperate'

import { BID_EXTERNALSTATE_COLOR } from '../../purchaseAbility/constants/purchaseBid'
import {
  getPurchaseBiddingPlatformExamineList,
  postPurchaseBiddingPlatformExamine,
  postPurchaseBiddingPlatformExamineBatch,
} from '@apps/apis'

const { Text } = Typography

const ExamineSearch: React.FC = () => {
  const ref = useRef({} as ActionType)
  const [id] = useState<any>()
  const [visible, setVisible] = useState<boolean>(false)

  const handleExamine = (record: any) => {
    history.push(`/purchaseManage/purchaseBid/examineSearch/detail?id=${record.id}&number=${record.biddingNo}&action=1`)
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '竞价单号/摘要',
      key: 'biddingNo',
      dataIndex: 'biddingNo',
      searchField: [
        {
          main: true,
          type: 'Input',
          name: 'biddingNo',
          title: '竞价单号',
        },
        {
          type: 'Input',
          name: 'details',
          title: '竞价单摘要',
        },
      ],
      render: (text: any, record: any) => (
        <Space direction="vertical" style={{ width: 300 }}>
          <EyeAuthButton
            url={`/purchaseManage/purchaseBid/examineSearch/detail?id=${record.id}&number=${record.biddingNo}`}
          >
            {text}
          </EyeAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
    },
    {
      title: '采购会员',
      key: 'createMemberName',
      dataIndex: 'createMemberName',
      searchField: {
        type: 'Input',
        name: 'memberName',
      },
    },
    {
      title: '竞价开始/结束时间',
      key: 'biddingStartTime',
      dataIndex: 'biddingStartTime',
      render: (text: any, record: any) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.biddingStartTime)}
          </div>
          <div>
            <PoweroffOutlined />
            &nbsp;{formatTimeString(record.biddingEndTime)}
          </div>
        </>
      ),
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
      render: (text: any, record: any) => (
        <StatusTag type={BID_EXTERNALSTATE_COLOR(text)} title={record.externalStateName} />
      ),
    },
    {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      fixed: 'right',
      render: (text: any, record: any) => (
        <DetailAuthButton>
          <Button type="link" onClick={() => handleExamine(record)}>
            审核
          </Button>
        </DetailAuthButton>
      ),
    },
  ]

  /** 批量审核 */
  const fetchSubmitBatch = async (_id?: number) => {
    let res
    if (_id) {
      res = await postPurchaseBiddingPlatformExamine({ id: _id, state: 1 })
    } else {
      res = await postPurchaseBiddingPlatformExamineBatch({ ids: ref.current?.selectionKeys })
    }
    if (res.code === 1000) {
      ref.current.reload()
    }
  }

  const handleSubmit = () => {
    setVisible(false)
    ref.current.reload()
  }

  const fetchData = async (params: any) => {
    const { sourceDate, ...resetParams } = params
    const payload = { ...resetParams }
    if (sourceDate) {
      const [startDate, endDate] = sourceDate.split(',')
      payload.startTime = startDate
      payload.endTime = endDate
    }
    const { data, code } = await getPurchaseBiddingPlatformExamineList(payload)
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
        isRowSelection
        searchButtons={[
          {
            key: 'examineBatch',
            children: '批量审核通过',
            disabled: !ref.current?.selectionKeys?.length,
            onClick() {
              fetchSubmitBatch()
            },
          },
        ]}
      />
      <ModalOperate
        id={id}
        title="单据审核"
        modalType="audit"
        visible={visible}
        fetch={postPurchaseBiddingPlatformExamine}
        onOk={() => handleSubmit()}
        onCancel={() => setVisible(false)}
      />
    </PageHeaderWrapper>
  )
}
export default ExamineSearch
