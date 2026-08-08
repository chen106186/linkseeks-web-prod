import React, { useEffect, useState } from 'react'
import { ColumnType } from 'antd/lib/table/interface'
import { Row, Col, Space, Button, Typography, Table, Drawer } from 'antd'

import { priceFormat } from '@/utils/numberFomat'

import BtnItem from '../bidDetailBtnItem'
import { getIntl } from '@linkseeks/i18n'

interface BidProgressDrawerProps {
  visible?: boolean
  onClose?: Function
  awardProcess?: any
}
const intl = getIntl()

const { Text } = Typography

const BidProgressDrawer: React.FC<BidProgressDrawerProps> = (props: any) => {
  const { visible, onClose, awardProcess = [] } = props
  const [activeItem, setActiveItem] = useState<any>(awardProcess ? awardProcess[0] : {})
  const [activeIndex, setActiveIndex] = useState<any>(awardProcess ? 0 : '')
  useEffect(() => {
    awardProcess && setActiveItem(awardProcess[0])
    awardProcess && setActiveIndex(0)
  }, [awardProcess])
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.id' }),
      align: 'center',
      dataIndex: 'id',
      key: 'id',
      render: (t, r, i) => ++i,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.materialCode2' }),
      key: 'number',
      dataIndex: 'number',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">{text}</Text>
          <Text type="secondary">{record.name}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
      key: 'model',
      dataIndex: 'model',
      render: (text: any, record: any) => text,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
      key: 'category',
      dataIndex: 'category',
      render: (text: any, record: any) => text,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.brand' }),
      key: 'brand',
      dataIndex: 'brand',
      render: (text: any, record: any) => text,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.purchaseCount1' }),
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">{text}</Text>
          <Text type="secondary">{record.unit}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.isTax1' }),
      key: 'isTax',
      dataIndex: 'isTax',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">
            {text === 1
              ? intl.formatMessage({ id: 'detail.purchase.okText' })
              : intl.formatMessage({ id: 'detail.purchase.cancelText' })}
          </Text>
          <Text type="secondary">{record.taxRate}%</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxUnitPrice' }),
      key: 'unitPrice',
      dataIndex: 'unitPrice',
      render: (text: any, record: any) => `${intl.formatMessage({ id: 'common.money' })}${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxPrice' }),
      key: 'price',
      dataIndex: 'price',
      render: (text: any, record: any) => `${intl.formatMessage({ id: 'common.money' })}${priceFormat(text)}`,
    },
  ]

  const chooseItem = (item: any, index: number) => {
    if (index !== activeIndex) {
      setActiveItem(item)
      setActiveIndex(index)
    }
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'detail.purchase.BidStep' })}
      width={1200}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'detail.purchase.cancel' })}
          </Button>
          <Button onClick={onClose} type="primary">
            {intl.formatMessage({ id: 'detail.purchase.confirm' })}
          </Button>
        </div>
      }
    >
      <Row gutter={[8, 8]} style={{ marginBottom: '10px' }}>
        {awardProcess?.length > 0 &&
          awardProcess?.map((item, index) => {
            return (
              <Col
                span={7}
                key={`${item.id}_${item.peportTime}`}
                onClick={() => {
                  chooseItem(item, index)
                }}
              >
                <BtnItem detail={item} active={index === activeIndex} />
              </Col>
            )
          })}
      </Row>
      <Table
        columns={columns}
        dataSource={activeItem?.detailss ?? []}
        rowKey={(record) => record.id}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
    </Drawer>
  )
}
export default BidProgressDrawer
