/** 详情通用 - 基本信息 */
import React from 'react'
import { Row, Col } from 'antd'
import { Card, Descriptions } from '@linkseeks/ui'
import style from './index.less'

export interface BasicInfoProps {
  effect?: any
}

const count = 0

const BasicLayout: React.FC<BasicInfoProps> = (props: any) => {
  const { effect } = props

  return (
    <Card id="basicLayout" title="基本信息">
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

export default BasicLayout
