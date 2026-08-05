/** 详情通用 - 流转进度 */
import React, { useContext, useState, useMemo } from 'react'
import { Radio, Table, Typography } from 'antd'
const { Text } = Typography

import StatusTag from '@/components/StatusTag'
import { formatTimeString } from '@/utils'

import { Context } from '../context'
import Card from '../../../card'
import { getIntl } from '@linkseeks/i18n'

const LOGSTATESTYPE = {
  /** 外部流转 */
  EXTERNALSTATES: 1,
  /** 内部流转 */
  INTERIORSTATES: 2,
}
// recordType做加法

const intl = getIntl()
export interface ProgressProps {
  externalColors: (text: any) => string
  internalColors: (text: any) => string
  layoutId?: string
  layoutTitle?: string
}
const RecordLayout: React.FC<ProgressProps> = (props: any) => {
  const { externalColors, internalColors, layoutId, layoutTitle } = props
  const context = useContext(Context)
  const [logStatus, setLogStatus] = useState<number>(LOGSTATESTYPE.EXTERNALSTATES)
  const EXTERNALLOGS = useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'detail.purchase.label50' }),
        key: 'index',
        dataIndex: 'index',
        render: (_text: any, _record: any, index: number) => <Text>{index + 1}</Text>,
      },
      {
        title: intl.formatMessage({ id: 'detail.purchase.label51' }),
        key: 'roleName',
        dataIndex: 'roleName',
      },
      {
        title: intl.formatMessage({ id: 'table.purchase.status' }),
        key: 'state',
        dataIndex: 'state',
        render: (_text: any, _record: any) => <StatusTag type={externalColors(_text)} title={_record.stateName} />,
      },
      {
        title: intl.formatMessage({ id: 'table.purchase.operate' }),
        key: 'operation',
        dataIndex: 'operation',
      },
      {
        title: intl.formatMessage({ id: 'detail.purchase.label52' }),
        key: 'createTime',
        dataIndex: 'createTime',
        render: (_text: any, _record: any) => <Text>{formatTimeString(_text)}</Text>,
      },
      {
        title: intl.formatMessage({ id: 'detail.purchase.auditOpinion' }),
        key: 'auditOpinion',
        dataIndex: 'auditOpinion',
      },
    ]
  }, [externalColors])

  const INTERNALLOGS = useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'detail.purchase.label50' }),
        key: 'index',
        dataIndex: 'index',
        render: (_text: any, _record: any, index: number) => <Text>{index + 1}</Text>,
      },
      {
        title: intl.formatMessage({ id: 'detail.purchase.roleName' }),
        key: 'roleName',
        dataIndex: 'roleName',
      },
      {
        title: intl.formatMessage({ id: 'detail.purchase.department2' }),
        key: 'department',
        dataIndex: 'department',
      },
      {
        title: intl.formatMessage({ id: 'table.purchase.userJobTitle' }),
        key: 'position',
        dataIndex: 'position',
      },
      {
        title: intl.formatMessage({ id: 'table.purchase.status' }),
        key: 'state',
        dataIndex: 'state',
        render: (_text: any, _record: any) => (
          <StatusTag
            type={
              internalColors(_text) === 'processing'
                ? 'primary'
                : internalColors(_text) === 'error'
                ? 'danger'
                : internalColors(_text)
            }
            title={_record.stateName}
          />
        ),
      },
      {
        title: intl.formatMessage({ id: 'table.purchase.operate' }),
        key: 'operation',
        dataIndex: 'operation',
      },
      {
        title: intl.formatMessage({ id: 'detail.purchase.label52' }),
        key: 'createTime',
        dataIndex: 'createTime',
        render: (_text: any, _record: any) => <Text>{formatTimeString(_text)}</Text>,
      },
      {
        title: intl.formatMessage({ id: 'detail.purchase.auditOpinion' }),
        key: 'auditOpinion',
        dataIndex: 'auditOpinion',
      },
    ]
  }, [internalColors])

  return (
    <Card
      id={layoutId}
      title={layoutTitle}
      extra={
        <Radio.Group onChange={(e) => setLogStatus(e.target.value)} defaultValue={LOGSTATESTYPE.EXTERNALSTATES}>
          {context.externalLogs && (
            <Radio.Button value={LOGSTATESTYPE.EXTERNALSTATES}>
              {intl.formatMessage({ id: 'detail.purchase.externalLogStates' })}
            </Radio.Button>
          )}
          {context.interiorLogs && (
            <Radio.Button value={LOGSTATESTYPE.INTERIORSTATES}>
              {intl.formatMessage({ id: 'detail.purchase.interiorLogStates' })}
            </Radio.Button>
          )}
        </Radio.Group>
      }
    >
      <Table
        columns={logStatus === LOGSTATESTYPE.EXTERNALSTATES ? EXTERNALLOGS : INTERNALLOGS}
        dataSource={logStatus === LOGSTATESTYPE.EXTERNALSTATES ? context.externalLogs : context.interiorLogs}
        rowKey={(record) => record.id}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
    </Card>
  )
}

RecordLayout.defaultProps = {
  layoutId: 'recordLayout',
  layoutTitle: intl.formatMessage({ id: 'detail.purchase.recordLyout' }),
}

export default RecordLayout
