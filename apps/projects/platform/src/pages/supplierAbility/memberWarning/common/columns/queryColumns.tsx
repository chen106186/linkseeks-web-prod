import { getIntl } from '@linkseeks/i18n'
import { ColumnsType } from 'antd/es/table'

const intl = getIntl()

/**
 * 列表页column
 */

const listColumns: ColumnsType<any> = [
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.memberSerial' })}`,
    dataIndex: 'no',
  },
  {
    title: `${intl.formatMessage({ id: 'supplier.supplierInspection.common.columns.index.supplierName' })}`,
    dataIndex: 'memberName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.warnProject' })}`,
    dataIndex: 'project',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.warnTip' })}`,
    dataIndex: 'notice',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.warnLevel' })}`,
    dataIndex: 'level',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.warnDate' })}`,
    dataIndex: 'time',
    sorter: (a, b) => a.time - b.time,
  },
  {
    title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.dealTime' })}`,
    dataIndex: 'handleTime',
    sorter: (a, b) => a.time - b.time,
  },
  {
    title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.dealMan' })}`,
    dataIndex: 'handlePeople',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.dealPlan' })}`,
    dataIndex: 'solution',
  },
]
export default listColumns
