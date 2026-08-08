/** 详情通用 - 基本信息 */
import React from 'react'
import { Row, Col } from 'antd'
import { Card } from '@linkseeks/ui'
import style from './index.less'

export interface BasicInfoProps {
  effect?: any
  /** 栅格 */
  span?: number
}

const count = 0

const BasicLayout: React.FC<BasicInfoProps> = (props: any) => {
  const { effect, span } = props

  return (
    <Card id="basicLayout" title="基本信息">
      <Row gutter={[8, 8]}>
        {effect.length > count &&
          effect.map((item, index) => (
            <Col key={`effect_${index + 1}`} span={span}>
              {item.col.map(
                (it, idx) =>
                  it && (
                    <div className={style.cell} key={`effect_col_${idx + 1}`}>
                      <label className={style.label}>{it.label}: </label>
                      <span className={style.content}>{it.extra}</span>
                    </div>
                  ),
              )}
            </Col>
          ))}
      </Row>
    </Card>
  )
}
BasicLayout.defaultProps = {
  span: 8,
}
export default BasicLayout
