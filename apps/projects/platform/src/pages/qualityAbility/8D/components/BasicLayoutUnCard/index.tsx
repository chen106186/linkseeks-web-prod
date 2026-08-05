/** 详情通用 - 基本信息 */
import React from 'react'
import { Row, Col } from 'antd'
import style from './index.less'
import { getIntl } from '@linkseeks/i18n'

export interface BasicLayoutUnCardPros {
  effect?: any
  effectBlock?: any
  CardTitle?: string
}

const intl = getIntl()

const count = 0

const BasicLayoutUnCard: React.FC<BasicLayoutUnCardPros> = (props: any) => {
  const { effect, effectBlock, CardTitle = '基础信息' } = props

  return (
    <div>
      <Row gutter={[8, 8]}>
        {effect?.length > count &&
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
      <Row gutter={[8, 8]}>
        {effectBlock?.length > count &&
          effectBlock.map((item, index) => (
            <Col key={`effect_block${index + 1}`} span={24}>
              <div className={style.cell}>
                <div className={style.labelSamll}>
                  {item.label}
                  {!item.colon && ':'}
                </div>
                <div className={style.longContent}>{item.extra}</div>
              </div>
            </Col>
          ))}
      </Row>
    </div>
  )
}

export default BasicLayoutUnCard
