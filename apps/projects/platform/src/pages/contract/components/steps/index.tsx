import React from 'react'
import styles from './index.less'
import { Steps } from 'antd'
import { getIntl } from '@linkseeks/i18n'
const { Step } = Steps

interface stepProps {
  step: number
  authTypeEdit: string
}
const intl = getIntl()
const StepComponents: React.FC<stepProps> = (props) => {
  const { step, authTypeEdit } = props

  return (
    <div className={styles.step_info}>
      <Steps size="small" current={step}>
        <Step
          title={
            authTypeEdit !== '3'
              ? intl.formatMessage({ id: 'contract.qiyexinxiheyan' })
              : intl.formatMessage({ id: 'contract.gerenxinxiheyan' })
          }
        />
        <Step
          title={
            authTypeEdit !== '3'
              ? intl.formatMessage({ id: 'contract.operatorLegalPerson' })
              : intl.formatMessage({ id: 'contract.xuanzerenzhengfangshi' })
          }
        />
        <Step
          title={
            authTypeEdit !== '3'
              ? intl.formatMessage({ id: 'contract.qiyerenzheng' })
              : intl.formatMessage({ id: 'contract.gerenrenzheng' })
          }
        />
      </Steps>
    </div>
  )
}

export default StepComponents
