import React, { useState, useEffect } from 'react'
import { Radio, Steps } from 'antd'
import { IAntdSchemaFormProps } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { Card } from '@linkseeks/ui'

export interface Iprops extends IAntdSchemaFormProps {
  /* 显示隐藏 */
  outerTaskStepList?: any
  innerTaskStepList?: any
}
const { Step } = Steps
const intl = getIntl()
const Record: React.FC<Iprops> = ({ outerTaskStepList, innerTaskStepList }) => {
  const [currentBatch, setCurrentBatch] = useState('1')
  const [StepList, setStepList] = useState<any>([])
  /**
   * 流转进度点击
   */
  const handleBatchChange = (e) => {
    let StepList = e.target.value == 1 ? outerTaskStepList : innerTaskStepList
    setStepList(StepList)
    setCurrentBatch(e.target.value)
  }
  useEffect(() => {
    let StepList = currentBatch === '1' ? outerTaskStepList : innerTaskStepList
    setStepList(StepList)
  }, [outerTaskStepList])

  const stepCurrent = StepList.reduce((prev, cur, index) => {
    return prev + cur.isExecute
  }, -1)

  return (
    <Card
      id="progress"
      title={intl.formatMessage({ id: 'contract.liuzhuanjindu' })}
      extra={
        <Radio.Group defaultValue={currentBatch} onChange={(e) => handleBatchChange(e)}>
          <Radio.Button value="1">{intl.formatMessage({ id: 'contract.waibuliuzhuan' })}</Radio.Button>
          <Radio.Button value="2">{intl.formatMessage({ id: 'contract.neibuliuzhuan' })}</Radio.Button>
        </Radio.Group>
      }
    >
      <Steps progressDot current={stepCurrent}>
        {StepList.map((item: any) => (
          <Step
            title={item.taskName}
            description={item.roleName}
            key={item.step}
            // status={item.isExecute ? 'finish' : 'wait'}
          />
        ))}
      </Steps>
    </Card>
  )
}
export default Record
