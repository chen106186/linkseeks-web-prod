/** 详情通用 - 交易条件 */
import React from 'react'
import { Row, Col } from 'antd'
import Card from '../../../card'
import style from './index.less'
import { getIntl } from '@linkseeks/i18n'

export interface ConditionProps {
  effect?: any
}

const count = 0

const intl = getIntl()

const ConditionLayout: React.FC<ConditionProps> = (props: any) => {
  const { effect } = props
  return (
    <Card id="conditionLayout" title={intl.formatMessage({ id: 'detail.purchase.conditionLayout' })}>
      <Row gutter={[8, 8]}>
        {effect.length > count &&
          effect.map((item, index) => (
            <Col key={`effect_${index + 1}`} span={8}>
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

export default ConditionLayout
