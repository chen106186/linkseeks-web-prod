/** 详情通用 - 流转进度 */
import React, { useContext, useState, useMemo } from 'react'
import { Radio, Table, Typography } from 'antd'
const { Text } = Typography

import StatusTag from '@/components/StatusTag'
import { formatTimeString } from '@/utils'

import { Context } from '../context'
import { Card } from '@linkseeks/ui'

const LOGSTATESTYPE = {
  /** 外部流转 */
  EXTERNALSTATES: 1,
  /** 内部流转 */
  INTERIORSTATES: 2,
}
// recordType做加法
export interface ProgressProps {
  externalColors: any
  internalColors: any
  layoutId?: string
  layoutTitle?: string
  interStatus?: boolean
}

const RecordLayout: React.FC<ProgressProps> = (props: any) => {
  const { externalColors, internalColors, layoutId, layoutTitle, interStatus } = props
  const context = useContext(Context)
  const [logStatus, setLogStatus] = useState<number>(LOGSTATESTYPE.EXTERNALSTATES)
  const EXTERNALLOGS = useMemo(() => {
    return [
      {
        title: '流转顺序号',
        key: 'index',
        dataIndex: 'index',
        render: (_text: any, _record: any, index: number) => <Text>{index + 1}</Text>,
      },
      {
        title: '操作角色',
        key: 'roleName',
        dataIndex: 'roleName',
      },
      {
        title: '状态',
        key: 'state',
        dataIndex: 'state',
        render: (_text: any, _record: any) => <StatusTag type={externalColors(_text)} title={_record.stateName} />,
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
      },
      {
        title: '操作时间',
        key: 'createTime',
        dataIndex: 'createTime',
        render: (_text: any, _record: any) => <Text>{formatTimeString(_text)}</Text>,
      },
      {
        title: '审核意见',
        key: 'auditOpinion',
        dataIndex: 'auditOpinion',
      },
    ]
  }, [externalColors])

  const INTERNALLOGS = useMemo(() => {
    return [
      {
        title: '流转顺序号',
        key: 'index',
        dataIndex: 'index',
        render: (_text: any, _record: any, index: number) => <Text>{index + 1}</Text>,
      },
      {
        title: '操作人',
        key: 'roleName',
        dataIndex: 'roleName',
      },
      {
        title: '部门',
        key: 'department',
        dataIndex: 'department',
      },
      {
        title: '职位',
        key: 'position',
        dataIndex: 'position',
      },
      {
        title: '状态',
        key: 'state',
        dataIndex: 'state',
        render: (_text: any, _record: any) => <StatusTag type={internalColors(_text)} title={_record.stateName} />,
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
      },
      {
        title: '操作时间',
        key: 'createTime',
        dataIndex: 'createTime',
        render: (_text: any, _record: any) => <Text>{formatTimeString(_text)}</Text>,
      },
      {
        title: '审核意见',
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
          {context.externalLogs && <Radio.Button value={LOGSTATESTYPE.EXTERNALSTATES}>外部流转</Radio.Button>}
          {context.interiorLogs && interStatus && (
            <Radio.Button value={LOGSTATESTYPE.INTERIORSTATES}>内部流转</Radio.Button>
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
  layoutTitle: '流转进度',
  interStatus: true,
}

export default RecordLayout
