/** 详情通用 - 基本信息 */
import React from 'react'
import { Row, Col } from 'antd'
import Card from '../../../card'
import style from './index.less'
import { getIntl } from '@linkseeks/i18n'

export interface BasicInfoProps {
  effect?: any
}

const intl = getIntl()

const count = 0

const BasicLayout: React.FC<BasicInfoProps> = (props: any) => {
  const { effect } = props

  return (
    <Card id="basicLayout" title={intl.formatMessage({ id: 'detail.purchase.basicLayout' })}>
      <Row gutter={[8, 8]}>
        {effect.length > count &&
          effect.map((item, index) => (
            <Col key={`effect_${index + 1}`} span={8}>
              {item.col.map((it, idx) => (
                <div className={style.cell} key={`effect_col_${idx + 1}`}>
                  <div className={style.label}>
                    {it.label}
                    {!it.colon && ':'}
                  </div>
                  <div className={style.content}>{it.extra}</div>
                </div>
              ))}
            </Col>
          ))}
      </Row>
    </Card>
  )
}

export default BasicLayout
