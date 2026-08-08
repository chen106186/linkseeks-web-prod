import React, { useEffect, useState, useContext } from 'react'
import { Space, Typography, Table, Row, Col } from 'antd'
import { Context } from '../context'
import Card from '../../../card'
import style from './index.less'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'

export interface BidResultProps {
  fetch?: () => Promise<unknown>
}

const intl = getIntl()

const BidResultLayout: React.FC<BidResultProps> = (props: any) => {
  const { fetch } = props
  const [dataSource, setDataSource] = useState<any>([])
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const context = useContext(Context)

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
          {text.toFixed(2)}
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
    if (context.memberId) {
      fetchDataSource({
        id: context.purchaseInquiryId,
        memberId: context.createMemberId,
        memberRoleId: context.createMemberRoleId,
        current: '1',
        pageSize: '10',
      })
    }
  }, [context])

  return (
    <Card id="bidResultLayout" title={intl.formatMessage({ id: 'detail.purchase.bidLayout' })}>
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
                      {record.category}
                    </p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={style.childrenContent}>
                    <p>
                      <span>{intl.formatMessage({ id: 'detail.purchase.brand' })}:</span>
                      {record.brand}
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          ),
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
            ) : (
              <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
            ),
          rowExpandable: (record) => record.productId,
        }}
        dataSource={dataSource}
        pagination={{ size: 'small' }}
      />
    </Card>
  )
}
export default BidResultLayout
