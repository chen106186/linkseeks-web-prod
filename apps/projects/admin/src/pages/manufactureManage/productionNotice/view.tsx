import React, { useRef, useCallback } from 'react'
import { formatTimeString } from '@/utils'
import { EyeAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import moment from 'moment'
import StatusTag from '@/components/StatusTag'
import { getEnhancePlatformAllList } from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'

const SUPPLIER_OUTER_STATUS_COLOR = ['default', 'default', 'primary', 'warning', 'danger', 'success']

const Query: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const columns: RecordColumns<any>[] = [
    {
      title: '通知单号/摘要',
      key: 'noticeNo',
      fixed: 'left',
      searchField: {
        main: true,
      },
      render: (text, record) => {
        const url = '/manufactureManage/productionNotice/detail'
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <EyeAuthButton url={url + `?id=${record.id}`}>{text}</EyeAuthButton>
            <span>{record.summary}</span>
          </div>
        )
      },
    },
    {
      title: '供应会员',
      key: 'supplierName',
      searchField: {
        type: 'Input',
        name: 'summary',
        title: '通知单摘要',
      },
    },
    { title: '加工企业名称', key: 'processName', searchField: 'Input' },
    {
      title: '单据时间',
      key: 'createTime',
      searchField: {
        type: 'DateSelect',
        name: 'sourceDate',
        title: '单据时间(全部)',
      },
      sorter: (a, b) => moment(a.createTime).valueOf() - moment(b.createTime).valueOf(),
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: '外部状态',
      key: 'outerStatus',
      fixed: 'right',
      searchField: 'Select',
      render: (text, record) => {
        const offset = record.outerStatus % SUPPLIER_OUTER_STATUS_COLOR.length
        return <StatusTag type={SUPPLIER_OUTER_STATUS_COLOR[offset] as 'default'} title={record.outerStatusName} />
      },
    },
  ]

  const fetchData = useCallback(async (params: any) => {
    const { sourceDate, ...rest } = params
    const payload = { ...rest }

    if (sourceDate) {
      const [startDate, endDate] = sourceDate.split(',')
      payload.startTime = formatTimeString(+startDate)
      payload.endTime = formatTimeString(+endDate)
    }
    const service = getEnhancePlatformAllList
    const res = await service({ ...payload })
    return res.data
  }, [])

  return (
    <PageHeaderWrapper backDom={false} title={'生产通知单查询'}>
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

export default Query
