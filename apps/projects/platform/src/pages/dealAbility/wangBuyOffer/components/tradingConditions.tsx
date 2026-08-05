import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd'
import { Card } from '@linkseeks/ui'
import { getIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import style from './index.less'

const intl = getIntl()
interface tradingConditionsProps {
  dataSource: any
}

const TradingConditions: React.FC<tradingConditionsProps> = (props: any) => {
  const { dataSource } = props
  const [basicEffect, setBasicEffect] = useState<any>([])
  const translate = useWebIntl()

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.jiaofuriqi',
              defaultMessage: '交付日期',
            }),
            extra: data.deliverTime,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.baojiajiezhishijian',
              defaultMessage: '报价截止时间',
            }),
            extra: data.quoteEndTime,
          },
          {
            label: translate('web.resource.deal.lianxiren'),
            extra: data.contactName,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.lianxirendianhua',
              defaultMessage: '联系人电话',
            }),
            extra: data.contactMobile,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.jiaofudizhi',
              defaultMessage: '交付地址',
            }),
            extra: data.deliverAddress,
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.baojiayaoqiu',
              defaultMessage: '报价要求',
            }),
            extra: data.quoteRequire,
          },

          {
            label: intl.formatMessage({
              id: 'transaction_components.shuifeiyaoqiu',
              defaultMessage: '税费要求',
            }),
            extra: data.taxesRequire,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.wuliuyaoqiu',
              defaultMessage: '物流要求',
            }),
            extra: data.logisticsRequire,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.baozhuangyaoqiu',
              defaultMessage: '包装要求',
            }),
            extra: data.packageRequire,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.fukuanfangshi',
              defaultMessage: '付款方式',
            }),
            extra: data.paymentWay,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.qitayaoqiu',
              defaultMessage: '其他要求',
            }),
            extra: data.otherRequire,
          },
        ],
      },
    ])
  }

  useEffect(() => {
    handleBasicEffect(dataSource)
  }, [dataSource])

  return (
    <Card id="tradingConditions" title={translate('web.resource.mall.jiaoyitiaojian')}>
      {basicEffect &&
        basicEffect.map((item, index) => (
          <Row
            gutter={[8, 8]}
            key={`effect_${index}`}
            style={{ marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid #F0F0F0' }}
          >
            {item.col.map((it, idx) => (
              <Col key={`effect_col_${idx}`} span={12}>
                <div className={style.cell} key={`effect_col_${idx + 1}`}>
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

export default TradingConditions
