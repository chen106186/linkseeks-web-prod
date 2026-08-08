/** 详情通用 - 基本信息 */
import React from 'react'
import { Row, Col } from 'antd'
// import Card from '../../../card';
import style from './index.less'
import { getIntl } from '@linkseeks/i18n'
import Card from '@/pages/design/categoryNavigation/components/Layout/Card'
// import { Card } from '@linkseeks/god';

export interface BasicInfoProps {
  effect?: any
  effectBlock?: any
  CardTitle?: string
}

const intl = getIntl()

const count = 0

const BasicLayoutCard: React.FC<BasicInfoProps> = (props: any) => {
  const { effect, effectBlock, CardTitle = '基础信息' } = props

  return (
    <Card id="basicLayout" title={CardTitle}>
      <Row gutter={[12, 12]}>
        {effect?.length > count &&
          effect.map((item, index) => (
            <Col key={`effect_${index + 1}`} span={12}>
              {item.col.map((it, idx) => (
                <div className={style.cell} key={`effect_col_${idx + 1}`}>
                  {!it.hiddenLabel && (
                    <div className={style.label}>
                      {it.label}
                      {!it.colon && ':'}
                    </div>
                  )}
                  <div className={style.content}>{it.extra}</div>
                </div>
              ))}
            </Col>
          ))}
      </Row>
      <Row gutter={[6, 18]}>
        {effectBlock?.length > count &&
          effectBlock.map((item, index) => (
            <Col key={`effect_block${index + 1}`} span={24}>
              <div className={style.cell}>
                {!item.hiddenLabel && (
                  <div className={style.labelSamll}>
                    {item.label}
                    {!item.colon && ':'}
                  </div>
                )}
                <div className={style.longContent}>{item.extra}</div>
              </div>
            </Col>
          ))}
      </Row>
    </Card>
  )
}

export default BasicLayoutCard
