/** 详情通用 - 基本信息 */
import React from 'react'
import { Row, Col } from 'antd'
import { Card } from '@linkseeks/ui'
import style from './index.less'
import { getIntl } from '@linkseeks/i18n'

export interface BasicInfoProps {
  effect?: any
  /** 栅格 */
  span?: number
}

const count = 0
const intl = getIntl()
const BasicLayout: React.FC<BasicInfoProps> = (props: any) => {
  const { effect, span } = props
  return (
    <Card id="basicLayout" title={intl.formatMessage({ id: 'transaction_components.jibenxinxi' })}>
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
}

export default BasicLayout
