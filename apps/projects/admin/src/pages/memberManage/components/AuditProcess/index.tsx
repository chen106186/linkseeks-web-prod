import React from 'react'
import { Steps, Tabs } from 'antd'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'

interface AuditProcessProp {
  outerVerifyCurrent?: number
  innerVerifyCurrent?: number
  outerVerifySteps?: { step: number; stepName: string; roleName: string }[]
  innerVerifySteps?: { step: number; stepName: string; roleName: string }[]
}

const AuditProcess: React.FC<AuditProcessProp> = ({
  outerVerifyCurrent = 0,
  innerVerifyCurrent = 0,
  outerVerifySteps = [],
  innerVerifySteps = [],
}) => (
  <MellowCard>
    <Tabs onChange={() => {}}>
      <Tabs.TabPane tab="外部审核流程" key="1">
        <Steps style={{ marginTop: 30 }} progressDot current={outerVerifyCurrent}>
          {outerVerifySteps.map((item) => (
            <Steps.Step key={item.step} title={item.stepName} description={item.roleName} />
          ))}
        </Steps>
      </Tabs.TabPane>
      <Tabs.TabPane tab="内部审核流程" key="2">
        <Steps style={{ marginTop: 30 }} progressDot current={innerVerifyCurrent}>
          {innerVerifySteps.map((item) => (
            <Steps.Step key={item.step} title={item.roleName} description={item.stepName} />
          ))}
        </Steps>
      </Tabs.TabPane>
    </Tabs>
  </MellowCard>
)

export default AuditProcess
