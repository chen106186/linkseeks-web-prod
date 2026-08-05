/** 详情通用 - 流转进度 */
import React, { useContext, useState } from 'react'
import { Radio, Table } from 'antd'
import { Context } from '../context'
import { Card } from '@linkseeks/ui'
import { EXTERNALLOGS, INTERNALLOGS } from '../../../../constants/columns'

const LOGSTATESTYPE = {
  /** 外部流转 */
  EXTERNALSTATES: 1,
  /** 内部流转 */
  INTERIORSTATES: 2,
}

export interface ProgressProps {}

const RecordLayout: React.FC<ProgressProps> = () => {
  const context = useContext(Context)
  const [logStatus, setLogStatus] = useState<number>(LOGSTATESTYPE.EXTERNALSTATES)
  return (
    <Card
      id="recordLyout"
      title="流转进度"
      extra={
        <Radio.Group onChange={(e) => setLogStatus(e.target.value)} defaultValue={LOGSTATESTYPE.EXTERNALSTATES}>
          {context.externalLogs && <Radio.Button value={LOGSTATESTYPE.EXTERNALSTATES}>外部流转</Radio.Button>}
          {context.externalLogs && <Radio.Button value={LOGSTATESTYPE.INTERIORSTATES}>内部流转</Radio.Button>}
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

export default RecordLayout
