/** 详情通用 - 基本信息 */
import React from 'react'
import { Row, Col } from 'antd'
import { Card } from '@linkseeks/ui'
import style from './index.less'

export interface OtherInfoProps {
  effect?: any
}

const count = 0

const OtherLayout: React.FC<OtherInfoProps> = (props: any) => {
  const { effect } = props

  return (
    <Card id="otherLayout" title="其他说明">
      <Row gutter={[8, 8]}>
        {effect.length > count &&
          effect.map((item, index) => (
            <Col key={`effect_${index + 1}`} span={8}>
              {item.col.map((it, idx) => (
                <div className={style.cell} key={`effect_col_${idx + 1}`}>
                  <h5 className={style.label}>{it.label}: </h5>
                  <h5 className={style.content}>{it.extra}</h5>
                </div>
              ))}
            </Col>
          ))}
      </Row>
    </Card>
  )
}

export default OtherLayout
