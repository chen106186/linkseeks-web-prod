/** 详情通用 - 交易条件 */
import React from 'react'
import { Row, Col } from 'antd'
import { Card } from '@linkseeks/ui'
import style from './index.less'
import { getIntl } from '@linkseeks/i18n'
import { GetTradeAskPurchaseDetailResponse } from '@apps/apis'

const intl = getIntl()
export interface ConditionProps {
  effect?: any
  title?: string
  data?: GetTradeAskPurchaseDetailResponse
}

const count = 0

const ConditionLayout: React.FC<ConditionProps> = (props: any) => {
  const { effect, data, title = intl.formatMessage({ id: 'detail.purchase.conditionLayout' }) } = props
  return (
    <Card id="conditionLayout" title={title}>
      {effect.length > count &&
        effect.map((item, index) => (
          <Row
            gutter={[8, 8]}
            key={`effect-${index}`}
            style={index === 0 ? { marginBottom: 24, borderBottom: '1px solid #F0F0F0' } : {}}
          >
            {item.col.map((it, idx) => (
              <Col key={`effect_col_${idx + 1}`} span={12}>
                <div className={style.cell}>
                  <h5 className={style.label}>{it.label}: </h5>
                  <h5 className={style.content}>{it.extra}</h5>
                </div>
              </Col>
            ))}
          </Row>
        ))}
    </Card>
  )
}

export default ConditionLayout
