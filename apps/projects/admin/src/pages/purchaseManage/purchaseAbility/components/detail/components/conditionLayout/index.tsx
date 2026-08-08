/** 详情通用 - 交易条件 */
import React from 'react'
import { Row, Col } from 'antd'
import { Card, Descriptions } from '@linkseeks/ui'
import style from './index.less'

export interface ConditionProps {
  effect?: any
}

const count = 0

const ConditionLayout: React.FC<ConditionProps> = (props: any) => {
  const { effect } = props
  return (
    <Card id="conditionLayout" title="交易条件">
      {effect.length > count &&
        effect.map((item, index) => (
          <Descriptions column={3}>
            {item.col.map((it, idx) => (
              <Descriptions.Item label={it.label}>{it.extra}</Descriptions.Item>
            ))}
          </Descriptions>
        ))}
    </Card>
  )
}

export default ConditionLayout
