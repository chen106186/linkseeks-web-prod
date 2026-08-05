/** 详情通用 - 流转进度 */
import React, { useContext, useEffect, useState } from 'react'
import { Radio, Table } from 'antd'
import { Context } from '../context'
import { Card } from '@linkseeks/ui'
import { EXTERNALLOGS, INTERNALLOGS } from './columns'
import { isEmpty } from 'lodash'
import { getIntl } from '@linkseeks/i18n'

const LOGSTATESTYPE = {
  /** 外部流转 */
  EXTERNALSTATES: 1,
  /** 内部流转 */
  INTERIORSTATES: 2,
}
const intl = getIntl()
export interface ProgressProps {
  /** 选中哪个radio */
  logstate?: number
}

const RecordLayout: React.FC<ProgressProps> = (props: any) => {
  const { logstate } = props
  const context = useContext(Context)
  const [logStatus, setLogStatus] = useState<number>(
    context.externalLogs ? LOGSTATESTYPE.EXTERNALSTATES : LOGSTATESTYPE.INTERIORSTATES,
  )
  const [data, setData] = useState<any>({})

  useEffect(() => {
    if (!isEmpty(context)) {
      console.log(context, 10086)
      setLogStatus(context.externalLogs ? LOGSTATESTYPE.EXTERNALSTATES : LOGSTATESTYPE.INTERIORSTATES)
      setData(context)
    }
  }, [context])

  return (
    <Card
      id="recordLyout"
      title={intl.formatMessage({ id: 'transaction_components.liuzhuanjilu' })}
      extra={
        <>
          {!isEmpty(data) && (
            <Radio.Group
              onChange={(e) => setLogStatus(e.target.value)}
              defaultValue={data.externalLogs ? LOGSTATESTYPE.EXTERNALSTATES : LOGSTATESTYPE.INTERIORSTATES}
            >
              {data.externalLogs && (
                <Radio.Button value={LOGSTATESTYPE.EXTERNALSTATES}>
                  {intl.formatMessage({ id: 'transaction_components.waibuliuzhuan' })}
                </Radio.Button>
              )}
              {data.interiorLogs && (
                <Radio.Button value={LOGSTATESTYPE.INTERIORSTATES}>
                  {intl.formatMessage({ id: 'transaction_components.neibuliuzhuan' })}
                </Radio.Button>
              )}
            </Radio.Group>
          )}
        </>
      }
    >
      <Table
        columns={logStatus === LOGSTATESTYPE.EXTERNALSTATES ? EXTERNALLOGS : INTERNALLOGS}
        dataSource={logStatus === LOGSTATESTYPE.EXTERNALSTATES ? data.externalLogs : data.interiorLogs}
        rowKey={(record) => record.id}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
    </Card>
  )
}

export default RecordLayout
