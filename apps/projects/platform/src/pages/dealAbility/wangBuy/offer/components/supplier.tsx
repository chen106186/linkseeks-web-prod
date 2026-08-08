import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Row, Col } from 'antd'
import Card from '@/components/DetailLayout/components/card'
import { getIntl } from '@linkseeks/i18n'
import { format } from 'util'
import style from './index.less'
const intl = getIntl()
interface SupplierProps {
  purchaseDetail: any
}

const Supplier: React.FC<SupplierProps> = (props: any) => {
  const { purchaseDetail } = props
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [conditionEffect, setConditionEffect] = useState<any>([])
  const [areas, setAreas] = useState<any>([])
  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.jiaofushuoming',
              defaultMessage: '交付说明',
            }),
            extra: data.deliverRemark,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.fukuanshuoming',
              defaultMessage: '付款说明',
            }),
            extra: data.paymentRemark,
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.shuifeishuoming',
              defaultMessage: '税费说明',
            }),
            extra: data.taxesRemark,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.wuliushuoming',
              defaultMessage: '物流说明',
            }),
            extra: data.logisticsRemark,
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'transaction_components.baozhuangshuoming',
              defaultMessage: '包装说明',
            }),
            extra: data.packageRemark,
          },
          {
            label: intl.formatMessage({
              id: 'transaction_components.qitashuoming',
              defaultMessage: '其他说明',
            }),
            extra: data.paymentRemark,
          },
        ],
      },
    ])
  }

  useEffect(() => {
    // fetchDataSource()
    handleBasicEffect(purchaseDetail)
  }, [purchaseDetail])

  return (
    <Card
      id="Supplier"
      title={intl.formatMessage({
        id: 'transaction_components.qitabaojiashuoming',
        defaultMessage: '其他报价说明',
      })}
    >
      <Row gutter={[8, 8]}>
        {basicEffect.map((item, index) => (
          <Col key={`effect_${index + 1}`} className={style.cellWarp}>
            {item.col.map((it, idx) => (
              <div className={style.cell} key={`effect_col_${idx + 1}`}>
                <h5 className={style.label}>{it.label}: </h5>
                <h5 className={style.content}>{it.extra}</h5>
              </div>
            ))}
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default Supplier
