import React, { useContext, useEffect, useState } from 'react'
import { Tabs, Table, Row, Col, Space, Typography, Button } from 'antd'
import { Context } from '../context'
import Card from '../../../card'
import style from './index.less'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import CrossSellProducts from '@/pages/procurementAbility/offter/addOffter/modal/crossSellProducts'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

export type effectType = {
  /** 报价轮次 */
  turn?: number
  /** 订单Id */
  id: number
}

const intl = getIntl()
const translate = getWebIntl()
export interface BidInfoProps {
  fetch?: () => Promise<unknown>
  effect?: effectType
  /** 获取报价轮次 */
  getKey?: (e) => void
}

const chNum: { [key: number]: string } = {
  1: translate('web.common.one'),
  2: translate('web.common.two'),
  3: translate('web.common.three'),
  4: translate('web.common.four'),
  5: translate('web.common.five'),
  6: translate('web.common.six'),
  7: translate('web.common.seven'),
  8: translate('web.common.eight'),
  9: translate('web.common.nine'),
}

const BidInfoLayout: React.FC<BidInfoProps> = (props: any) => {
  const { effect, fetch, getKey } = props
  const context = useContext(Context)
  const [dataSource, setDataSource] = useState<any>([])
  const [turn, setTurn] = useState<Array<number>>([])
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(false)
  const [product, setProduct] = useState<any>({})

  /** 轮次 */
  const handleTurn = (num: number) => {
    let isTurn: Array<number> = []
    for (let i = 0; i < num; i += 1) {
      isTurn.push(i + 1)
    }
    setTurn(isTurn.reverse())
  }

  const columns = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.type' }),
      key: 'number',
      dataIndex: 'number',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.size' }),
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.brand' }),
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.purchaseCount1' }),
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
      render: (text: any, record: any) => (
        <>
          <Typography.Text>{text}</Typography.Text>
          &nbsp;
          <Typography.Text type="secondary">{`(${record.unit})`}</Typography.Text>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.isTax1' }),
      key: 'isTax',
      dataIndex: 'isTax',
      render: (text: any, record: any) => (
        <>
          <Typography.Text>
            {text
              ? intl.formatMessage({ id: 'detail.purchase.okText' })
              : intl.formatMessage({ id: 'detail.purchase.cancelText' })}
          </Typography.Text>
          /<Typography.Text>{`(${record.taxProbability}%)`}</Typography.Text>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxUnitPrice' }),
      key: 'taxUnitPrice',
      dataIndex: 'taxUnitPrice',
      render: (text: any, record: any) => (
        <Typography.Text>
          {intl.formatMessage({ id: 'common.money' })}
          {text.toFixed(4)}
        </Typography.Text>
      ),
    },
    {
      title: (
        <Space direction="vertical">
          <Typography.Text>{intl.formatMessage({ id: 'detail.purchase.taxPrice' })}</Typography.Text>
          <Typography.Text>
            {intl.formatMessage({ id: 'detail.purchase.totalAmount' })}: {intl.formatMessage({ id: 'common.money' })}
            {totalAmount.toFixed(2)}
          </Typography.Text>
        </Space>
      ),
      key: 'taxPrice',
      dataIndex: 'taxPrice',
      render: (text: any, record: any) => (
        <Typography.Text>
          {intl.formatMessage({ id: 'common.money' })}
          {text.toFixed(2)}
        </Typography.Text>
      ),
    },
  ]

  /** 物料信息 */
  const fetchDataSource = async (params: any) => {
    await fetch({ ...params })
      .then((res: any) => {
        if (res.code !== 1000) {
          return
        }
        const { data } = res.data
        setDataSource(data)
        let total: number = 0
        data.forEach((item) => {
          total += item.taxPrice
        })
        setTotalAmount(total)
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  /** 物料信息 */
  useEffect(() => {
    if (effect.turn) {
      fetchDataSource({
        id: effect.id,
        turn: effect.turn,
        current: '1',
        pageSize: '10',
      })
      handleTurn(effect.turn)
    }
  }, [effect.turn])

  const handleOnChange = async (key: any) => {
    fetchDataSource({
      id: effect.id,
      turn: key,
      current: '1',
      pageSize: '10',
    })
    /** 返回给兄弟 */
    getKey(key)
  }

  const handleCheck = (item: any) => {
    setVisible(true)
    setProduct(item)
  }

  return (
    <Card id="bidInfoLayout" title={intl.formatMessage({ id: 'detail.purchase.offerLayout' })}>
      <Tabs defaultActiveKey="1" onChange={handleOnChange}>
        {turn.map((item) => (
          <Tabs.TabPane
            key={item}
            tab={`${intl.formatMessage({ id: 'detail.purchase.label4' })}${chNum[item]}${intl.formatMessage({
              id: 'detail.purchase.label29',
            })}`}
          >
            <Table
              className={style.tableStyle}
              columns={columns}
              rowKey="id"
              expandable={{
                expandedRowRender: (record) => (
                  <div className={style.childrenWrap}>
                    <Row>
                      <Col span={3}>
                        <div className={style.childrenTitle}>
                          <p>{intl.formatMessage({ id: 'detail.purchase.label27' })}</p>
                          <p>{intl.formatMessage({ id: 'detail.purchase.label28' })}</p>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={style.childrenContent}>
                          <p>
                            <span>{intl.formatMessage({ id: 'detail.purchase.productId' })}:</span>
                            {record.productId}
                          </p>
                          <p>
                            <span>{intl.formatMessage({ id: 'detail.purchase.goodstName' })}:</span>
                            {record.productName}
                          </p>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={style.childrenContent}>
                          <p>
                            <span>{intl.formatMessage({ id: 'detail.purchase.nameCode' })}:</span>
                            {record.productAttributeJson}
                          </p>
                          <p>
                            <span>{intl.formatMessage({ id: 'detail.purchase.customerCategory' })}:</span>
                            {record.productCategory}
                          </p>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className={style.childrenContent}>
                          <p>
                            <span>{intl.formatMessage({ id: 'detail.purchase.brand' })}:</span>
                            {record.productBrand}
                          </p>
                        </div>
                      </Col>
                      <Col span={3}>
                        <div className={style.childrenContent}>
                          <Button type="link" onClick={() => handleCheck(record)}>
                            {intl.formatMessage({ id: 'table.purchase.see' })}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ),
                rowExpandable: (record) => !!record.productId,
                expandIcon: ({ expanded, onExpand, record }) =>
                  expanded ? (
                    <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
                  ) : (
                    <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
                  ),
              }}
              dataSource={dataSource}
              pagination={{ size: 'small' }}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
      <CrossSellProducts preview visible={visible} record={product} onClose={() => setVisible(false)} />
    </Card>
  )
}
export default BidInfoLayout
