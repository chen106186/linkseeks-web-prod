/** 详情通用 - 流转进度 */
import React, { useEffect, useState } from 'react'
import { Radio, Steps } from 'antd'
import Card from '../../../card'
import { getIntl } from '@linkseeks/i18n'

export interface ProgressValue {
  title: string
  state: number
  logs: any
}

export interface ProgressProps {
  effect: ProgressValue[]
}

const intl = getIntl()

const ProgressLayout: React.FC<ProgressProps> = (props: any) => {
  const { effect } = props
  const [logStatesItem, setLogStatesItem] = useState<any>(effect[0])
  useEffect(() => {
    effect && setLogStatesItem(effect[0])
  }, [effect])

  return (
    <Card
      id="progressLayout"
      title={intl.formatMessage({ id: 'detail.purchase.progressLayout' })}
      extra={
        <Radio.Group onChange={(e) => setLogStatesItem(e.target.value)} value={logStatesItem}>
          {effect.map((item: any, index: number) => {
            return (
              <Radio.Button value={item} key={index}>
                {item.title}
              </Radio.Button>
            )
          })}
        </Radio.Group>
      }
    >
      <Steps progressDot>
        {logStatesItem &&
          logStatesItem.logs?.map((item) => (
            <Steps.Step
              key={item.state}
              title={item.operationalProcess}
              description={item.roleName}
              status={item.isExecute ? 'finish' : 'wait'}
            />
          ))}
      </Steps>
    </Card>
  )
}

export default ProgressLayout
