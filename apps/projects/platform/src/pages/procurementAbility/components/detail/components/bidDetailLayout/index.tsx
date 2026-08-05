import React, { useEffect, useState } from 'react'
import { Row, Col, Table, Button, Typography, Space } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'

import { priceFormat } from '@/utils/numberFomat'

import Card from '../../../card'

import BtnItem from '../bidDetailBtnItem'
import { getIntl } from '@linkseeks/i18n'

const { Text } = Typography

const intl = getIntl()

const transforType = {
  1: intl.formatMessage({ id: 'detail.purchase.okText' }),
  0: intl.formatMessage({ id: 'detail.purchase.cancelText' }),
}

interface BidDetailLayoutProps {
  detail?: any
  btnType?: number
}

const BidDetailLayout: React.FC<BidDetailLayoutProps> = (props: any) => {
  const { detail, btnType } = props
  const { awardProcess = [], isOpenPurchase, isOpenRanking } = detail
  const [showMore, setShowMore] = useState<boolean>(false)
  const [activeItem, setActiveItem] = useState<any>(awardProcess?.[0] || { detailss: [] })
  const dataSource = showMore ? [...activeItem.detailss].splice(0, 4) : activeItem.detailss

  useEffect(() => {
    awardProcess && setActiveItem(awardProcess?.[0] || { detailss: [] })
  }, [detail])

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.type' }),
      key: 'number',
      dataIndex: 'number',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary" key={'number_1'}>
            {text}
          </Text>
          <Text type="secondary" key={'number_2'}>
            {record.name}
          </Text>
        </Space>
      ),
    },
    { title: intl.formatMessage({ id: 'detail.purchase.nameCode' }), key: 'model', dataIndex: 'model' },
    { title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }), key: 'category', dataIndex: 'category' },
    { title: intl.formatMessage({ id: 'detail.purchase.brand' }), key: 'brand', dataIndex: 'brand' },
    {
      title: intl.formatMessage({ id: 'detail.purchase.purchaseCount1' }),
      dataIndex: 'unit',
      key: 'unit',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary" key={'unit_1'}>
            {record.purchaseCount}
          </Text>
          <Text type="secondary" key={'unit_2'}>
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.isTax1' }),
      dataIndex: 'isTax',
      key: 'isTax',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary" key={'isTax_1'}>
            {transforType[text]}
          </Text>
          <Text type="secondary" key={'isTax_2'}>{`${record.taxRate ? `${record.taxRate}%` : ''}`}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxUnitPrice' }),
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (text: any, record: any) => (
        <Text type="secondary">
          {intl.formatMessage({ id: 'common.money' })}
          {priceFormat(text)}
        </Text>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxPrice' }),
      dataIndex: 'price',
      key: 'price',
      render: (text: any, record: any) => (
        <Text type="secondary">
          {intl.formatMessage({ id: 'common.money' })}
          {priceFormat(text)}
        </Text>
      ),
    },
  ]

  const chooseItem = (item: any) => {
    if (item.peportTime !== activeItem?.peportTime) {
      setShowMore(false)
      setActiveItem(item)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <Card id={'BidDetailLayout'} title={intl.formatMessage({ id: 'detail.purchase.modalTitle14' })}>
        <Row gutter={[8, 8]} style={{ marginBottom: '10px' }}>
          {awardProcess?.map((item, index, arr) => {
            let _ratio = 0
            const _arrLength = arr.length
            if (btnType === 2) {
              if (index != _arrLength - 1 && _arrLength > 2) {
                _ratio = Number((((item.sumPice - arr[index + 1].sumPice) / arr[index + 1].sumPice) * 100).toFixed(2))
              }
            }
            return (
              <Col
                span={7}
                key={`${item.id}_${item.peportTime}`}
                onClick={() => {
                  chooseItem(item)
                }}
              >
                <BtnItem
                  btnType={btnType}
                  detail={{ ...item, isOpenPurchase, isOpenRanking, ratio: _ratio, selfRanking: index + 1 }}
                  active={item.peportTime === activeItem?.peportTime}
                />
              </Col>
            )
          })}
        </Row>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
        {!showMore && dataSource.length > 4 && (
          <Button
            type="link"
            block
            onClick={() => {
              setShowMore(true)
            }}
          >
            {intl.formatMessage({ id: 'table.purchase.showMore' })}
          </Button>
        )}
      </Card>
    </div>
  )
}

BidDetailLayout.defaultProps = {
  btnType: 1,
}

export default BidDetailLayout
