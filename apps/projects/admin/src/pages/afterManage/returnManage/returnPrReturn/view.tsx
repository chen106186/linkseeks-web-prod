/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-18 15:31:25
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-17 11:07:59
 * @Description: 待退款
 */
import React, { useRef } from 'react'
import { Badge, Button } from 'antd'
import { formatTimeString } from '@/utils'
import { history } from '@linkseeks/router-manager'
import { EyeAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import StatusTag from '@/components/StatusTag'
import { getAftersalesReturnGoodsPageRefundByPlatform } from '@apps/apis'
import { RETURN_OUTER_STATUS_TAG_MAP, RETURN_INNER_STATUS_BADGE_MAP } from '../constants'

const ReturnPrReturn: React.FC = (props: any) => {
  const ref = useRef({} as ActionType)

  const defaultColumns: RecordColumns<any>[] = [
    {
      title: '申请单号',
      key: 'applyNo',
      fixed: 'left',
      searchField: {
        main: true,
      },
      render: (text, record) => (
        <>
          <EyeAuthButton url={`${props.location.pathname}/detail?id=${record.returnId}`}>{text}</EyeAuthButton>
        </>
      ),
    },
    {
      title: '申请单摘要',
      key: 'applyAbstract',
      searchField: 'Input',
    },
    {
      title: '采购会员',
      key: 'consumerName',
      searchField: 'Input',
    },
    {
      title: '退款金额',
      key: 'refundAmount',
    },
    {
      title: '单据时间',
      key: 'applyTime',
      searchField: {
        type: 'DateSelect',
        name: 'sourceDate',
        title: '单据时间(全部)',
      },
    },
    {
      title: '已退款',
      key: 'returned',
    },
    {
      title: '外部状态',
      key: 'outerStatusName',
      render: (text, record) => <StatusTag type={RETURN_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />,
    },
    {
      title: '内部状态',
      key: 'innerStatusName',
      render: (text, record) => <Badge color={RETURN_INNER_STATUS_BADGE_MAP[record.innerStatus]} text={text} />,
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => history.push(`${props.location.pathname}/edit?id=${record.returnId}`)}>
            退款
          </Button>
        </>
      ),
    },
  ]

  const fetchListData = (params: any) => {
    const { sourceDate, ...rest } = params
    const payload = { ...rest }

    if (sourceDate) {
      const [startDate, endDate] = sourceDate.split(',')
      payload.startTime = formatTimeString(+startDate)
      payload.endTime = formatTimeString(+endDate)
    }
    return new Promise((resolve, reject) => {
      getAftersalesReturnGoodsPageRefundByPlatform({
        ...payload,
      })
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

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={defaultColumns}
        autoScrollX
        request={(params) => fetchListData(params)}
        rowKey="returnId"
        actionRef={ref}
      />
    </PageHeaderWrapper>
  )
}

export default ReturnPrReturn
