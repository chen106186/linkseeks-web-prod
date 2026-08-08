/** 详情通用 - 基本信息 */
import React from 'react'
import { Row, Col } from 'antd'
import Card from '../../../card'
import style from './index.less'
import { getIntl } from '@linkseeks/i18n'

export interface OtherInfoProps {
  effect?: any
}

const count = 0

const intl = getIntl()

const OtherLayout: React.FC<OtherInfoProps> = (props: any) => {
  const { effect } = props
  return (
    <Card id="otherLayout" title={intl.formatMessage({ id: 'detail.purchase.offerExplain' })}>
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

export default OtherLayout
