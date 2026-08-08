/** 详情通用 - 流转进度 */
import React, { useContext, useEffect, useState } from 'react'
import { Radio, Steps } from 'antd'
import { Context } from '../context'
import Card from '../../../card'
import style from './index.less'
import { isEmpty } from 'lodash'
import { getIntl } from '@linkseeks/i18n'

const LOGSTATESTYPE = {
  /** 外部流转 */
  EXTERNALSTATES: 1,
  /** 内部流转 */
  INTERIORSTATES: 2,
  /** 竞价结果内部流转 */
  EXMAINEINERIORSTATES: 3,
}

const intl = getIntl()
export interface ProgressProps {
  /** 选中哪个radio */
  logstate?: number
}

const ProgressLayout: React.FC<ProgressProps> = (props: any) => {
  const { logstate } = props
  const context = useContext(Context)
  const [logStatesStatus, setLogStatesStatus] = useState<number>(1)
  const [data, setData] = useState<any>({})

  useEffect(() => {
    if (!isEmpty(context)) {
      console.log(context)
      setLogStatesStatus(context.externalLogStates ? LOGSTATESTYPE.EXTERNALSTATES : LOGSTATESTYPE.INTERIORSTATES)
      setData(context)
    }
  }, [context])

  return (
    <Card
      id="progressLayout"
      title={intl.formatMessage({ id: 'detail.purchase.progressLayout' })}
      extra={
        <>
          {!isEmpty(data) && (
            <Radio.Group
              onChange={(e) => setLogStatesStatus(e.target.value)}
              defaultValue={data.externalLogStates ? LOGSTATESTYPE.EXTERNALSTATES : LOGSTATESTYPE.INTERIORSTATES}
            >
              {data.externalLogStates && (
                <Radio.Button value={LOGSTATESTYPE.EXTERNALSTATES}>
                  {intl.formatMessage({ id: 'detail.purchase.externalLogStates' })}
                </Radio.Button>
              )}
              {data.interiorLogStates && (
                <Radio.Button value={LOGSTATESTYPE.INTERIORSTATES}>
                  {intl.formatMessage({ id: 'detail.purchase.interiorLogStates' })}
                </Radio.Button>
              )}
              {data.examineInteriorLogStates && (
                <Radio.Button value={LOGSTATESTYPE.EXMAINEINERIORSTATES}>
                  {intl.formatMessage({ id: 'detail.purchase.examineInteriorLogStates' })}
                </Radio.Button>
              )}
            </Radio.Group>
          )}
        </>
      }
    >
      <Steps progressDot>
        {logStatesStatus === LOGSTATESTYPE.EXTERNALSTATES
          ? data.externalLogStates &&
            data.externalLogStates.map((item) => (
              <Steps.Step
                key={item.state}
                title={item.operationalProcess}
                description={item.roleName}
                status={item.isExecute ? 'finish' : 'wait'}
              />
            ))
          : logStatesStatus === LOGSTATESTYPE.INTERIORSTATES
          ? data.interiorLogStates &&
            data.interiorLogStates.map((item) => (
              <Steps.Step
                key={item.state}
                title={item.operationalProcess}
                description={item.roleName}
                className={style.stepCss}
                status={item.isExecute ? 'finish' : 'wait'}
              />
            ))
          : data.examineInteriorLogStates &&
            data.examineInteriorLogStates.map((item) => (
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
