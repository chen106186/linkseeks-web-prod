/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-15 17:48:36
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-18 15:08:09
 * @Description: 内外部流转记录组件
 */
import React, { useState, useEffect } from 'react'
import { Steps } from 'antd'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import ButtonSwitch from '@/components/ButtonSwitch'
import styles from './index.less'

export interface StepsItem {
  /**
   * 当前步骤
   */
  step?: number
  /**
   * 步骤名
   */
  stepName?: string
  /**
   * 角色名，也可以作为辅助信息使用
   */
  roleName: string
  /**
   * 当前步骤的状态
   */
  status?: 'wait' | 'process' | 'finish' | 'error'
}

interface AuditProcessProp extends MellowCardProps {
  /**
   * 当前外部流程步骤
   */
  outerVerifyCurrent?: number
  /**
   * 当前内部流程步骤
   */
  innerVerifyCurrent?: number
  /**
   * 当前外部流程
   */
  outerVerifySteps?: StepsItem[]
  /**
   * 当前内部流程
   */
  innerVerifySteps?: StepsItem[]
  /**
   * 自定义item 步骤名键名
   */
  customTitleKey?: string
  /**
   * 自定义item key键名
   */
  customKey?: string
}

const AuditProcess: React.FC<AuditProcessProp> = ({
  outerVerifyCurrent = 0,
  innerVerifyCurrent = 0,
  outerVerifySteps,
  innerVerifySteps,
  customTitleKey,
  customKey,
  ...rest
}) => {
  const [radioValue, setRadioValue] = useState<'inner' | 'outer'>('inner')

  useEffect(() => {
    // 这里判断如果只有外部步骤，没有内部步骤的时候，默认设置 radioValue 为 outer
    if (Array.isArray(outerVerifySteps) && !Array.isArray(innerVerifySteps)) {
      setRadioValue('outer')
    }
  }, [outerVerifySteps])

  const handleRadioChange = (value: 'inner' | 'outer') => {
    setRadioValue(value)
  }

  const options = [
    outerVerifySteps && outerVerifySteps.length
      ? {
          label: '外部流转',
          value: 'outer',
        }
      : null,
    innerVerifySteps && innerVerifySteps.length
      ? {
          label: '内部流转',
          value: 'inner',
        }
      : null,
  ].filter(Boolean)

  return (
    <MellowCard
      title="流转进度"
      extra={<ButtonSwitch options={options as any[]} onChange={handleRadioChange} value={radioValue} />}
      {...rest}
    >
      {radioValue === 'outer' ? (
        <div className={styles.steps}>
          <Steps progressDot current={outerVerifyCurrent}>
            {outerVerifySteps &&
              outerVerifySteps.map((item) => (
                <Steps.Step
                  key={customKey ? item[customKey] : item.step}
                  title={customTitleKey ? item[customTitleKey] : item.stepName}
                  description={item.roleName}
                  status={item.status}
                />
              ))}
          </Steps>
        </div>
      ) : null}
      {radioValue === 'inner' ? (
        <div className={styles.steps}>
          <Steps progressDot current={innerVerifyCurrent}>
            {innerVerifySteps &&
              innerVerifySteps.map((item) => (
                <Steps.Step
                  key={customKey ? item[customKey] : item.step}
                  title={customTitleKey ? item[customTitleKey] : item.stepName}
                  description={item.roleName}
                  status={item.status}
                />
              ))}
          </Steps>
        </div>
      ) : null}
    </MellowCard>
  )
}

export default AuditProcess
