import moment from 'moment'
import React from 'react'
import { Link } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const format = 'YYYY-MM-DD'

export const commonColumns = [
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.evaluateNumberTopic' })}`,
    dataIndex: 'des',
    render: (text, record) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Link to={`/supplierAbility/profile/evaluate/detail?id=${record.id}`}>{record.appraisalNo}</Link>
          <p>{record.subject}</p>
        </div>
      )
    },
  },
  {
    title: `${intl.formatMessage({ id: 'supplier.supplierInspection.common.columns.index.supplierName' })}`,
    dataIndex: 'upperName',
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
    sorter: (_a, _b) => moment(_a.completeDay, format).valueOf() - moment(_b.completeDay, format).valueOf(),
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useEvaluateColumn.evaluateLastScore' })}`,
    dataIndex: 'totalScore',
    sorter: (_a, _b) => _a.totalScore - _b.totalScore,
  },
]
