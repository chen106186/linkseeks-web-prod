import { getIntl } from '@linkseeks/i18n'
import React, { useCallback, useEffect, useState } from 'react'
import { ColumnsType } from 'antd/es/table'
import { Link } from '@linkseeks/router-core'
import StatusTag from '@/components/StatusTag'
import moment from 'moment'
import { getMemberCustomerAppraisalStatusList } from '@apps/apis'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
type OptionType = {
  label: string
  value: string
}
// type MapOptions = {
//   status: OptionType[],
// }

const TYPE = ['success', 'warning', 'default', 'danger', 'primary', 'nobility']
/**
 * 根据类型获取考评column
 */

const commonColumns = [
  {
    title: translate('web.resource.member.memberName'),
    dataIndex: 'name',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useEvaluateColumn.evaluateArea' })}`,
    dataIndex: 'type',
    render: (text, record) => {
      return (
        <div>
          {`${record.appraisalDayStart} ${intl.formatMessage({ id: 'common.text.to' })} ${record.appraisalDayEnd}`}
        </div>
      )
    },
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useEvaluateColumn.evaluateComplateTime' })}`,
    dataIndex: 'completeDay',
    sorter: (_a, _b) => moment(_a.completeDay).valueOf() - moment(_b.completeDay).valueOf(),
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useEvaluateColumn.evaluateLastScore' })}`,
    dataIndex: 'totalScore',
    sorter: (_a, _b) => _a.totalScore - _b.totalScore,
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useEvaluateColumn.innerState' })}`,
    dataIndex: 'status',
    // filters: [],
    // onFilter: (_value, record) => record.status === _value || _value===0,
    render: (text, record) => {
      const offset = record.status % TYPE.length
      return <StatusTag type={TYPE[offset] as 'success'} title={record.statusName} />
    },
  },
]

export const setColumnsByLinks = (link?: { [key: string]: string }, blackList?: string[]) => {
  const linksColumns: ColumnsType<any> = [
    {
      title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.evaluateNumberTopic' })}`,
      dataIndex: 'des',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {(link?.['detail'] && (
              <Link to={`${link?.['detail']}?id=${record.id}&preview=1`}>{record.appraisalNo}</Link>
            )) || <span>{record.id}</span>}
            <p>{record.subject}</p>
          </div>
        )
      },
    },
  ]
  const column = linksColumns.concat(commonColumns)
  if (typeof blackList === 'undefined' || blackList.length === 0) {
    return column
  }
  return column.filter((_item) => !blackList.includes((_item as any)?.dataIndex))
}

function useEvaluateColumn<T extends { [key: string]: any } = any>(
  defaultColumns: ColumnsType<T>,
  mergeColumn?: ColumnsType<T>,
) {
  const [columns, setColumns] = useState(() => defaultColumns.concat(mergeColumn))
  const [statusOptions, setStatusOptions] = useState<OptionType[]>([])

  const fetchStatusOptions = useCallback(async () => {
    const { code, data } = await getMemberCustomerAppraisalStatusList()
    if (code === 1000) {
      const formatedData = data.map((_item) => ({ label: _item.message, value: _item.code }))
      setStatusOptions(formatedData)
      return formatedData
    }
    return []
  }, [])

  const setColumnsWithFilterOption = (optionMap: { [key: string]: { text: string; value: string }[] }) => {
    const newColumns = [...columns]
    const keys = Object.keys(optionMap)
    newColumns.forEach((_item: ColumnsType<T>[0] & { dataIndex: string }) => {
      if (_item.dataIndex && keys.includes(_item.dataIndex)) {
        _item.filters = optionMap[_item.dataIndex]
      }
    })
    setColumns(newColumns)
  }
  useEffect(() => {
    if (statusOptions.length === 0) {
      return
    }
    const mapKeys = {
      status: statusOptions,
    }
    const keys = Object.keys(mapKeys) || []
    const map = {}
    keys.forEach((_item: 'status') => {
      map[_item] = mapKeys[_item].map((_row) => ({ text: _row.label, ..._row }))
    })
    // setColumnsWithFilterOption(map)
  }, [statusOptions])

  return { columns, fetchStatusOptions }
}
export default useEvaluateColumn
