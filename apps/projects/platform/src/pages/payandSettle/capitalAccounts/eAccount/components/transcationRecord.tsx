import { getPayEAccountAllInPayGetEAccountTradeRecord } from '@apps/apis'
import { StandardFormTable } from '@apps/components'
import { Card } from '@linkseeks/ui'
import dayjs from 'dayjs'
import { useRef } from 'react'

const TranscationRecord = ({ tableRef }) => {
  const datesRef = useRef<any>([])

  const disabledDate = (current) => {
    if (!datesRef.current || datesRef.current.length === 0) {
      return false
    }
    const tooLate = datesRef.current[0] && current.diff(datesRef.current[0], 'days') > 31
    const tooEarly = datesRef.current[1] && datesRef.current[1].diff(current, 'days') > 31
    return tooEarly || tooLate
  }

  const getRecord = (params) => {
    const defaultStartTime = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss')
    const defaultEndTime = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')

    const startTime = params.startTime ? dayjs(params.startTime).format('YYYY-MM-DD HH:mm:ss') : defaultStartTime
    const endTime = params.endTime ? dayjs(params.endTime).format('YYYY-MM-DD HH:mm:ss') : defaultEndTime

    return getPayEAccountAllInPayGetEAccountTradeRecord({ ...params, startTime, endTime })
  }

  const columns = StandardFormTable.createColumns([
    {
      key: 'bizOrderNo',
      title: '商户订单号',
    },
    {
      key: 'tradeNo',
      title: '交易流水号',
    },
    {
      key: 'changeTime',
      title: '交易时间',
      searchField: {
        type: 'DateRange',
        name: ['startTime', 'endTime'],
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        disabledDate: disabledDate,
        onCalendarChange: (val) => (datesRef.current = val),
      },
    },
    {
      key: 'oriAmount',
      title: '原始金额',
    },
    {
      key: 'chgAmount',
      title: '变更金额',
    },
    {
      key: 'curAmount',
      title: '现有金额',
    },
    {
      key: 'tradeType',
      title: '交易类型',
    },
    {
      key: 'type',
      title: '交易子类型',
    },
    {
      key: 'remark',
      title: '分账备注',
    },
  ])

  return (
    <Card isMarginBottom>
      <StandardFormTable
        actionRef={tableRef}
        columns={columns}
        request={getRecord}
        initalValue={{
          startTime: dayjs().startOf('month').valueOf(),
          endTime: dayjs().endOf('day').valueOf(),
        }}
      />
    </Card>
  )
}

export default TranscationRecord
