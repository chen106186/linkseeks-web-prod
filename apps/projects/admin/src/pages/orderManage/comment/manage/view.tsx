import React, { useRef } from 'react'
import { Rate, Button, Modal, message, Tooltip } from 'antd'
import { ClockCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import { EyeAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { COMMENT_STATUS_VISIBLE, COMMENT_STATUS_INVISIBLE } from '../constants'
import styles from './index.less'
import {
  getMemberPlatformCommentOrderTradeHistoryPage,
  postMemberPlatformCommentOrderTradeHistoryDelete,
  postMemberPlatformCommentOrderTradeHistoryUpdateStatus,
} from '@apps/apis'

const { confirm } = Modal

const CommentManage: React.FC = () => {
  const ref = useRef({} as ActionType)

  const handleVisibleComment = (status, id) => {
    const msg = message.loading({
      content: '正在操作，请稍候...',
      duration: 0,
    })
    postMemberPlatformCommentOrderTradeHistoryUpdateStatus({
      id,
      status,
    })
      .then((res) => {
        if (res.code === 1000) {
          ref.current.reload()
        }
      })
      .finally(() => {
        msg()
      })
  }

  const defaultColumns: RecordColumns<any>[] = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      fixed: 'left',
      render: (text, record) => (
        <EyeAuthButton url={`/orderManage/comment/manage/detail?id=${record.id}`}>{text}</EyeAuthButton>
      ),
    },
    {
      title: '交易商品/交易时间',
      dataIndex: 'product',
      key: 'product',
      searchField: {
        main: true,
        title: '交易商品',
      },
      render: (text, record) => {
        return (
          <>
            <Tooltip title={text}>
              <div className={styles.productName}>{text}</div>
            </Tooltip>
            <div
              style={{
                marginTop: 4,
              }}
            >
              <ClockCircleOutlined />
              {` ${record.dealTime}`}
            </div>
          </>
        )
      },
    },
    {
      title: '被评价方',
      dataIndex: 'subMemberName',
      key: 'subMemberName',
      searchField: 'Input',
    },
    {
      title: '评价方',
      dataIndex: 'memberName',
      key: 'memberName',
      searchField: 'Input',
    },
    {
      title: '评价星级',
      dataIndex: 'star',
      key: 'star',
      searchField: {
        type: 'Select',
        valueEnum: [
          {
            label: '一星',
            value: 1,
          },
          {
            label: '二星',
            value: 2,
          },
          {
            label: '三星',
            value: 3,
          },
          {
            label: '四星',
            value: 4,
          },
          {
            label: '五星',
            value: 5,
          },
        ],
      },
      render: (text) => <Rate value={text} disabled />,
    },
    {
      title: '评价内容',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      searchField: 'Input',
    },
    {
      title: '评价时间',
      dataIndex: 'createTime',
      key: 'createTime',
      searchField: [
        { name: 'dealSourceDate', title: '交易时间', type: 'DateSelect' },
        { name: 'sourceDate', title: '评价时间', type: 'DateSelect' },
      ],
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <>
          <AuthButton type="custom" code="shield">
            <Button
              type="link"
              onClick={() =>
                handleVisibleComment(
                  record.status === COMMENT_STATUS_VISIBLE || !record.status
                    ? COMMENT_STATUS_INVISIBLE
                    : COMMENT_STATUS_VISIBLE,
                  record.id,
                )
              }
            >
              {record.status === COMMENT_STATUS_VISIBLE || !record.status ? '屏蔽' : '已屏蔽'}
            </Button>
          </AuthButton>
        </>
      ),
    },
  ]

  const fetchData = (params: any) => {
    const { sourceDate, dealSourceDate, ...rest } = params
    const _parmas = { ...rest }
    if (sourceDate) {
      const [startDate, endDate] = sourceDate.split(',')
      _parmas.createTimeStart = formatTimeString(+startDate)
      _parmas.createTimeEnd = formatTimeString(+endDate)
    }
    if (dealSourceDate) {
      const [startDate, endDate] = dealSourceDate.split(',')
      _parmas.dealTimeStart = formatTimeString(+startDate)
      _parmas.dealTimeEnd = formatTimeString(+endDate)
    }
    return new Promise((resolve, reject) => {
      getMemberPlatformCommentOrderTradeHistoryPage(_parmas)
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  const handleBatchDelete = () => {
    if (!ref.current.selectionKeys.length) {
      message.warning('未选择任何评论')
      return
    }
    confirm({
      title: '提示',
      icon: <QuestionCircleOutlined />,
      content: '确定要删除选中的评论吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        return new Promise((resolve, reject) => {
          postMemberPlatformCommentOrderTradeHistoryDelete({
            ids: ref.current.selectionKeys,
          })
            .then((res) => {
              if (res.code === 1000) {
                ref.current.reload()
                resolve(true)
              }
              reject()
            })
            .catch(() => {
              reject()
            })
        })
      },
    })
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={defaultColumns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        isRowSelection
        searchButtons={[
          {
            key: 'deleteBatch',
            children: '批量删除',
            onClick() {
              handleBatchDelete()
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default CommentManage
