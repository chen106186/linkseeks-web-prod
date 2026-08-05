/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-29 10:47:07
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-10 16:30:10
 * @Description: 外部流转组件
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Steps, Empty } from 'antd'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import styles from './index.less'

export interface StepsItem {
  title: string
  description: string
  status: 'finish' | 'wait' | 'process'
}

interface OuterCirculation extends MellowCardProps {
  /**
   * 步骤
   */
  steps: StepsItem[]
  /**
   * 当前高亮
   */
  current: number
}

const OuterCirculation: React.FC<OuterCirculation> = ({ steps = [], current, ...rest }) => {
  const intl = useIntl()

  if (!Array.isArray(steps)) {
    return null
  }

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'afterService.components.OuterCirculation.title', defaultMessage: '外部流转' })}
      {...rest}
    >
      <div className={styles.steps}>
        {steps && steps.length > 0 ? (
          <Steps progressDot current={current}>
            {steps.map((item, index) => (
              <Steps.Step key={index} title={item.title} description={item.description} status={item.status} />
            ))}
          </Steps>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </MellowCard>
  )
}

export default OuterCirculation
