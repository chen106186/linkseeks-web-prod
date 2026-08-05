import React, { useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button } from '@linkseeks/ui'
import { formatTimeString } from '@/utils'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import type { PostAftersalesPlatformReturnGoodsPageToBeVerifyResponseDetail } from '@apps/apis'
import { postAftersalesPlatformReturnGoodsPageToBeVerify } from '@apps/apis'
import createColumns from '../common/columns/basic'

const ReturnPrVerifyList: React.FC = (props: any) => {
  const ref = useRef({} as ActionType)

  const handleJumpAudit = (record: PostAftersalesPlatformReturnGoodsPageToBeVerifyResponseDetail) => {
    history.push(`${props.location.pathname}/edit?id=${record.returnId}`)
  }

  const [columns] = useState<RecordColumns<any>[]>(
    createColumns(props.location.pathname).concat([
      {
        title: '操作',
        key: 'option',
        fixed: 'right',
        render: (_, record) => (
          <Button type="link" onClick={() => handleJumpAudit(record)}>
            审核
          </Button>
        ),
      },
    ]),
  )

  const fetchListData = (params: any) => {
    const { sourceDate, ...rest } = params
    const payload = { ...rest }

    if (sourceDate) {
      const [startDate, endDate] = sourceDate.split(',')
      payload.startTime = formatTimeString(+startDate)
      payload.endTime = formatTimeString(+endDate)
    }
    return new Promise((resolve, reject) => {
      postAftersalesPlatformReturnGoodsPageToBeVerify(
        {
          ...payload,
        },
        {
          ctlType: 'none',
        },
      )
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
      />
    </PageHeaderWrapper>
  )
}

export default ReturnPrVerifyList
