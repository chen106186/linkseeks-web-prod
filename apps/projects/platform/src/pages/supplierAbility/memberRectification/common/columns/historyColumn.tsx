import { getIntl } from '@linkseeks/i18n'
import { ColumnsType } from 'antd/es/table'

const intl = getIntl()

export const outerColumns: ColumnsType<any> = [
  {
    title: `${intl.formatMessage({ id: 'member.memberRectification.common.columns.historyColumn.circulateNumber' })}`,
    dataIndex: 'id',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberRectification.common.columns.historyColumn.operateRole' })}`,
    dataIndex: 'operatorRoleName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.state' })}`,
    dataIndex: 'outerStatusName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.operate' })}`,
    dataIndex: 'operation',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.operateTime' })}`,
    dataIndex: 'createTime',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberRectification.common.columns.historyColumn.remark' })}`,
    dataIndex: 'remark',
  },
]

export const innerColumns: ColumnsType<any> = [
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.circulateRecord' })}`,
    dataIndex: 'id',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.operator' })}`,
    dataIndex: 'operatorName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.department' })}`,
    dataIndex: 'operatorOrgName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.post' })}`,
    dataIndex: 'operatorJobTitle',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.state' })}`,
    dataIndex: 'innerStatusName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.operate' })}`,
    dataIndex: 'operation',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.operateTime' })}`,
    dataIndex: 'createTime',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.auditSuggest' })}`,
    dataIndex: 'remark',
  },
]
