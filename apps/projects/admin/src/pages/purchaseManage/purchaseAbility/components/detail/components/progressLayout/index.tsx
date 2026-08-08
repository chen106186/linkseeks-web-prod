/** 详情通用 - 流转进度 */
import React, { useContext, useState } from 'react'
import { Radio, Steps } from 'antd'
import { Context } from '../context'
import { Card } from '@linkseeks/ui'
import style from './index.less'

const LOGSTATESTYPE = {
  /** 外部流转 */
  EXTERNALSTATES: 1,
  /** 内部流转 */
  INTERIORSTATES: 2,
}

export interface ProgressProps {}

const ProgressLayout: React.FC<ProgressProps> = () => {
  const context = useContext(Context)
  const [logStatesStatus, setLogStatesStatus] = useState<number>(LOGSTATESTYPE.EXTERNALSTATES)
  return (
    <Card
      id="progressLayout"
      title="流转进度"
      extra={
        <Radio.Group onChange={(e) => setLogStatesStatus(e.target.value)} defaultValue={LOGSTATESTYPE.EXTERNALSTATES}>
          {context.externalLogStates && <Radio.Button value={LOGSTATESTYPE.EXTERNALSTATES}>外部流转</Radio.Button>}
          {context.interiorLogStates && <Radio.Button value={LOGSTATESTYPE.INTERIORSTATES}>内部流转</Radio.Button>}
        </Radio.Group>
      }
    >
      <Steps progressDot>
        {logStatesStatus === LOGSTATESTYPE.EXTERNALSTATES
          ? context.externalLogStates &&
            context.externalLogStates.map((item) => (
              <Steps.Step
                key={item.state}
                title={item.roleName}
                description={item.operationalProcess}
                status={item.isExecute ? 'finish' : 'wait'}
              />
            ))
          : context.interiorLogStates &&
            context.interiorLogStates.map((item) => (
              <Steps.Step
                key={item.state}
                title={item.roleName}
                description={item.operationalProcess}
                status={item.isExecute ? 'finish' : 'wait'}
              />
            ))}
      </Steps>
    </Card>
  )
}

export default ProgressLayout
