/**
 * 带按钮式Radio切换的流转进度
 */
const intl = getIntl()

import React, { useEffect, useState } from 'react'
import { Steps, Tabs, Radio } from 'antd'
import MellowCard from '@/components/MellowCard'
import style from './index.less'
import { getIntl } from '@linkseeks/i18n'

interface TransferProcessProp {
  outerVerifyCurrent?: number
  innerVerifyCurrent?: number
  outerVerifySteps?: {
    step: number
    stepName: string
    operationRole: string
    status?: 'wait' | 'process' | 'finish' | 'error'
  }[]
  innerVerifySteps?: {
    step: number
    stepName: string
    operationRole: string
    status?: 'wait' | 'process' | 'finish' | 'error'
  }[]
  customTitleKey?: string
  customKey?: string
  cardTitle?: string
}

export enum TransferEnum {
  /** 外部流转 */
  Outer = 1,
  /** 内部流转 */
  Interior = 2,
}

const TransferProcess: React.FC<TransferProcessProp> = ({
  outerVerifyCurrent = 0,
  innerVerifyCurrent = 0,
  outerVerifySteps = [],
  innerVerifySteps = [],
  customTitleKey,
  customKey,
  cardTitle = '',
}) => {
  const [transferRadio, setTransferRadio] = useState<TransferEnum>(TransferEnum.Outer)

  useEffect(() => {
    let judgeDefault = [outerVerifySteps?.length, innerVerifySteps?.length].filter(Boolean)
    if (judgeDefault.length === 1) {
      if (outerVerifySteps?.length) setTransferRadio(TransferEnum.Outer)
      else setTransferRadio(TransferEnum.Interior)
    }
  }, [])

  const handleChangeType = (e) => {
    setTransferRadio(e.target.value)
  }

  return (
    <MellowCard
      title={cardTitle}
      bordered={false}
      extra={
        <Radio.Group value={transferRadio} buttonStyle="solid" size="small" onChange={handleChangeType}>
          {outerVerifySteps?.length ? (
            <Radio.Button value={TransferEnum.Outer}>
              {intl.formatMessage({ id: 'table.purchase.waibuliuzhuan' })}
            </Radio.Button>
          ) : null}
          {innerVerifySteps?.length ? (
            <Radio.Button value={TransferEnum.Interior}>
              {intl.formatMessage({ id: 'detail.purchase.interiorLogStates' })}
            </Radio.Button>
          ) : null}
        </Radio.Group>
      }
      className={style.cardWrap}
    >
      {outerVerifySteps?.length && transferRadio === TransferEnum.Outer ? (
        <Steps
          style={{ marginTop: 30, overflow: 'auto', paddingTop: 5, paddingBottom: 5 }}
          progressDot
          current={outerVerifyCurrent}
        >
          {outerVerifySteps.map((item) => (
            <Steps.Step
              key={customKey ? item[customKey] : item.step}
              title={customTitleKey ? item[customTitleKey] : item.stepName}
              description={item.operationRole}
              status={item.status}
            />
          ))}
        </Steps>
      ) : null}
      {innerVerifySteps?.length && transferRadio === TransferEnum.Interior ? (
        <Steps
          style={{ marginTop: 30, overflow: 'auto', paddingTop: 5, paddingBottom: 5 }}
          progressDot
          current={innerVerifyCurrent}
        >
          {innerVerifySteps.map((item) => (
            <Steps.Step
              key={customKey ? item[customKey] : item.step}
              title={customTitleKey ? item[customTitleKey] : item.stepName}
              description={item.operationRole}
              status={item.status}
            />
          ))}
        </Steps>
      ) : null}
    </MellowCard>
  )
}

export default TransferProcess
