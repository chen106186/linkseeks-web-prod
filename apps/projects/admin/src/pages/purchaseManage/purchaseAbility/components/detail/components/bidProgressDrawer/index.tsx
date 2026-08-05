import React, { useEffect, useState } from 'react'
import { ColumnType } from 'antd/lib/table/interface'
import { Row, Col, Space, Button, Typography, Table, Drawer } from 'antd'

import { priceFormat } from '@/utils/numberFomat'

import BtnItem from '../bidDetailBtnItem'

interface BidProgressDrawerProps {
  visible?: boolean
  onClose?: Function
  awardProcess?: any
}

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
      title: '序号',
      align: 'center',
      dataIndex: 'id',
      key: 'id',
      render: (t, r, i) => ++i,
    },
    {
      title: '物料编号/摘要',
      key: 'number',
      dataIndex: 'number',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">{text}</Text>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
    },
    {
      title: '规格型号',
      key: 'model',
      dataIndex: 'model',
      render: (text: any, record: any) => text,
    },
    {
      title: '品类',
      key: 'category',
      dataIndex: 'category',
      render: (text: any, record: any) => text,
    },
    {
      title: '品牌',
      key: 'brand',
      dataIndex: 'brand',
      render: (text: any, record: any) => text,
    },
    {
      title: '采购数量/单位',
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
      title: '含税/税率',
      key: 'isTax',
      dataIndex: 'isTax',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">{text === 1 ? '是' : '否'}</Text>
          <Text type="secondary">{record.taxRate}%</Text>
        </Space>
      ),
    },
    {
      title: '单价(含税)',
      key: 'unitPrice',
      dataIndex: 'unitPrice',
      render: (text: any, record: any) => `¥${priceFormat(text)}`,
    },
    {
      title: '金额（含税）',
      key: 'price',
      dataIndex: 'price',
      render: (text: any, record: any) => `¥${priceFormat(text)}`,
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
      title="竞价过程"
      width={1200}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={onClose} type="primary">
            确认
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
