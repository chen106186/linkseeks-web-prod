import { getIntl } from '@linkseeks/i18n'
import { ColumnsType } from 'antd/es/table'
import React from 'react'

const intl = getIntl()

/**
 * 详情页考评项目
 */

export const projectColumns: ColumnsType<any> = [
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.memberSerial' })}`,
    dataIndex: 'id',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.detail.evaluateProject' })}`,
    dataIndex: 'name',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.content' })}`,
    dataIndex: 'content',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluater' })}`,
    dataIndex: 'userName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.evaluaterScore' })}`,
    dataIndex: 'sendAppraisal',
    render: (text, record) => {
      return record.sendAppraisal
        ? `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.yes' })}`
        : `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.no' })}`
    },
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.weight' })}`,
    dataIndex: 'scoreWeight',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateScore' })}`,
    dataIndex: 'grade',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.score' })}`,
    dataIndex: 'score',
    render: (text, record) => {
      return (record.grade * record.scoreWeight) / 100
    },
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateTemplate' })}`,
    dataIndex: 'templates',
    render: (text, record) => {
      return
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {record.templates.map((_row) => {
            return (
              <a key={_row.url} href={_row.url}>
                {_row.name}
              </a>
            )
          })}
        </div>
      )
    },
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateReport' })}`,
    dataIndex: 'appraisalReport',
    render: (text, record) => {
      return
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {record.appraisalReport.map((_row) => {
            return (
              <a key={_row.url} href={_row.url}>
                {_row.name}
              </a>
            )
          })}
        </div>
      )
    },
  },
]

export const recordColumn: ColumnsType<any> = [
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.memberSerial' })}`,
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
    dataIndex: 'statusName',
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
