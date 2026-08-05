/** 详情通用 - 基本信息 */
import React from 'react'
import { Row, Col } from 'antd'
import { Card } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
import style from './index.less'

export interface BasicInfoProps {
  effect?: any
  /** 栅格 */
  span?: number
  /** 锚点id */
  id?: string
  title?: string
}

const count = 0
const BasicLayout: React.FC<BasicInfoProps> = (props: any) => {
  const translate = useWebIntl()
  const { effect, span, id, title = translate('web.common.jibenxinxi') } = props

  return (
    <Card id={id} title={title}>
      <Row gutter={[8, 8]}>
        {effect.length > count &&
          effect.map((item, index) => (
            <Col key={`effect_${index + 1}`} span={span}>
              {item.col.map((it, idx) => (
                <div className={style.cell} key={`effect_col_${idx + 1}`}>
                  <div className={style.label}>{it.label}: </div>
                  <div className={style.content}>{it.extra}</div>
                </div>
              ))}
            </Col>
          ))}
      </Row>
    </Card>
  )
}
BasicLayout.defaultProps = {
  span: 8,
  id: 'basicLayout',
}

export default BasicLayout
