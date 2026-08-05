/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-29 10:47:07
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-10-27 10:33:24
 * @Description: 外部流转组件
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Steps, Empty } from 'antd'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'

interface OuterCirculation {
  steps: {
    title: string
    description: string
  }[]
  current: number
}

const OuterCirculation: React.FC<OuterCirculation> = ({ steps = [], current }) => {
  const intl = useIntl()

  if (!Array.isArray(steps)) {
    return null
  }

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'payandSettle.creditApplication.components.outerCirculation' })}
      style={{
        marginBottom: 24,
      }}
    >
      {steps && steps.length > 0 ? (
        <Steps style={{ marginTop: 30 }} progressDot current={current}>
          {steps.map((item, index) => (
            <Steps.Step key={index} title={item.title} description={item.description} />
          ))}
        </Steps>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </MellowCard>
  )
}

export default OuterCirculation
