/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-18 14:33:10
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-17 11:06:53
 * @Description: 退货申请单查询
 */
import React, { useState, useRef, useEffect } from 'react'
import { formatTimeString } from '@/utils'
import { coverColFiltersItem } from '@/utils'
import { EyeAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import StatusTag from '@/components/StatusTag'
import { getAftersalesReturnGoodsPageByPlatform } from '@apps/apis'
import { RETURN_OUTER_STATUS_TAG_MAP } from '../constants'
import useSelectOptions from './services/hooks/useSelectOptions'

const ReturnQuery: React.FC = (props: any) => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

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
      title: '供应会员',
      key: 'supplierName',
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
      title: '外部状态',
      key: 'outerStatusName',
      searchField: {
        type: 'Select',
        name: 'outerStatus',
      },
      render: (text, record) => <StatusTag type={RETURN_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />,
    },
  ]

  const [columns] = useState<any[]>(defaultColumns)

  const fetchListData = (params: any) => {
    const { sourceDate, ...rest } = params
    const payload = { ...rest }

    if (sourceDate) {
      const [startDate, endDate] = sourceDate.split(',')
      payload.startTime = formatTimeString(+startDate)
      payload.endTime = formatTimeString(+endDate)
    }
    return new Promise((resolve, reject) => {
      getAftersalesReturnGoodsPageByPlatform({
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
        columns={columns}
        autoScrollX
        request={(params) => fetchListData(params)}
        rowKey="returnId"
        actionRef={ref}
        searchSelectMaps={selectData}
      />
    </PageHeaderWrapper>
  )
}

export default ReturnQuery
