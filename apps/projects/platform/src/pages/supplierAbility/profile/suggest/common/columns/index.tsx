import React from 'react'
import { ColumnsType } from 'antd/es/table'
import { Link } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

/**
 * 列表页column
 */

const listColumns: ColumnsType<any> = [
  {
    title: `${intl.formatMessage({ id: 'supplier.supplierEvaluate.hooks.useGetDetailCommon.uppersupplierName' })}`,
    dataIndex: 'upperName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.businessType' })}`,
    dataIndex: 'typeName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.caseClass' })}`,
    dataIndex: 'classifyName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.caseTopic' })}`,
    dataIndex: 'subject',
  },
  {
    title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.caseTime' })}`,
    dataIndex: 'eventTime',
  },
  {
    title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.proposer' })}`,
    dataIndex: 'byUserName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.proposePhone' })}`,
    dataIndex: 'byUserPhone',
  },
  {
    title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.dealTime' })}`,
    dataIndex: 'handleTime',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.state' })}`,
    dataIndex: 'statusName',
  },
]

export const setColumnsByLinks = (link?: { [key: string]: string }) => {
  const linksColumns: ColumnsType<any> = [
    {
      title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.memberSerial' })}`,
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {(link?.['detail'] && <Link to={`${link?.['detail']}?id=${record.id}`}>{record.id}</Link>) || (
              <span>{record.id}</span>
            )}
          </div>
        )
      },
    },
  ]
  return linksColumns.concat(listColumns)
}
// export default listColumns;
