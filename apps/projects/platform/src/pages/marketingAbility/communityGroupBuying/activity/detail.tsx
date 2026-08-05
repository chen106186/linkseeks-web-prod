import React, { Fragment, useEffect, useState } from 'react'
import { Card, Table, message, Image, Tag } from 'antd'
import { BraftEditor, PageHeaderWrapper, type RecordColumns, Editor } from '@apps/components'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMarketingMerchantCbgActivityGet } from '@apps/apis'
import { formatTimeString } from '@/utils'
import { Form, Radio, Space } from '@linkseeks/ui'

interface ExpandedDataType {
  key: React.Key
  date: string
  name: string
  upgradeNum: string
}

const CbgActivityDetail = () => {
  const { id, preview } = usePageStatus()
  const [activityData, setActivityData] = useState<any>({})
  const [goodsData, setGoodsData] = useState<any>([])
  const [teamLeaderData, setTeamLeaderData] = useState<any>([])
  const [editorState, setEditorState] = useState<any>()

  useEffect(() => {
    getMarketingMerchantCbgActivityGet({
      id: id,
    }).then((res) => {
      if (res.code !== 1000) {
        message.warning('加载失败')
      }
      setActivityData(res.data)
      setEditorState(BraftEditor.createEditorState(res.data.detail))

      const tmpCbgActivityPickupPointList = res.data.cbgActivityPickupPointList || []
      setTeamLeaderData(tmpCbgActivityPickupPointList)
      const tmpGoodsData = []
      const tmpGoodsMap = {}
      const tmpCbgActivityGoodsList = res.data.cbgActivityGoodsList || []
      tmpCbgActivityGoodsList.forEach((goods) => {
        let goodsItem = tmpGoodsMap[goods.productId]
        if (!goodsItem) {
          goodsItem = {
            productId: goods.productId,
            productName: goods.productName,
            brand: goods.brand,
            unit: goods.unit,
            productType: goods.productType,
            category: goods.category,
            customerCategory: goods.customerCategory,
            skuList: [],
          }
          tmpGoodsMap[goods.productId] = goodsItem
        }
        const skuList = goodsItem.skuList || []
        skuList.push({
          skuId: goods.skuId,
          type: goods.type,
          price: goods.price || 0,
          activityPrice: goods.activityPrice || 0,
          stockNum: goods.stockNum || 0,
          commissionRate: goods.commissionRate || 0,
        })
        goodsItem.skuList = skuList
        tmpGoodsMap[goods.productId] = goodsItem
      })
      for (const key in tmpGoodsMap) {
        if (tmpGoodsMap.hasOwnProperty(key)) {
          tmpGoodsData.push(tmpGoodsMap[key])
        }
      }
      setGoodsData(tmpGoodsData)
    })
  }, [])

  const expandedRowRender = (record) => {
    const columns: RecordColumns<any>[] = [
      {
        title: '商品SKUID',
        key: 'skuId',
        dataIndex: 'skuId',
      },
      {
        title: '商品规格名称',
        key: 'type',
        dataIndex: 'type',
      },
      {
        title: '单价￥',
        key: 'price',
        dataIndex: 'price',
      },
      {
        title: '活动价￥',
        key: 'activityPrice',
        dataIndex: 'activityPrice',
      },
      {
        title: '活动库存',
        key: 'stockNum',
        dataIndex: 'stockNum',
      },
      {
        title: '设置团购佣金',
        key: 'commissionRate',
        dataIndex: 'commissionRate',
        render: (_text, record) => <>{(record.commissionRate * 100).toFixed(2) + '%'}</>,
      },
    ]

    const data = record.skuList
    return <Table columns={columns} dataSource={data} pagination={false} />
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '商品ID',
      key: 'productId',
      dataIndex: 'productId',
    },
    {
      title: '商品名称',
      key: 'productName',
      dataIndex: 'productName',
    },
    {
      title: '单位',
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: '商品类型',
      key: 'productType',
      dataIndex: 'productType',
    },
    {
      title: '平台类目',
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: '商家品类',
      key: 'customerCategory',
      dataIndex: 'customerCategory',
    },
  ]

  const teamLeaderColumns: RecordColumns<any>[] = [
    {
      title: '团长名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '团长手机号',
      key: 'phone',
      dataIndex: 'phone',
    },
    {
      title: '自提信息',
      key: 'address',
      dataIndex: 'address',
      render: (_text, record) => (
        <>
          {record.pickupPointName +
            ' ' +
            record.phone +
            ' ' +
            record.pickupPointProvince +
            record.pickupPointCity +
            record.pickupPointArea +
            record.pickupPointStreet +
            record.pickupPointAddress}
        </>
      ),
    },
  ]

  // 1：全部，2：指定地区，3：指定自提点
  const options = [
    { label: '全部', value: 1 },
    { label: '指定地区', value: 2 },
    { label: '指定自提点', value: 3 },
  ]

  // 1：物流，2：自提，3：物流+自提
  const deliveryType = {
    1: '物流',
    2: '自提',
    3: '物流+自提',
  }

  return (
    <div>
      <PageHeaderWrapper title="查看团购活动">
        <Space direction="vertical" size="middle">
          <Card title="活动基本信息">
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal" disabled={true}>
              <Form.Item label="活动名称">
                <span>{activityData.name}</span>
              </Form.Item>
              <Form.Item label="活动描述">
                <span>{activityData.description}</span>
              </Form.Item>
              <Form.Item label="活动时间">
                <span>
                  {formatTimeString(activityData.startTime, 'YYYY-MM-DD HH:mm') +
                    '~' +
                    formatTimeString(activityData.endTime, 'YYYY-MM-DD HH:mm')}
                </span>
              </Form.Item>
              <Form.Item label="销售范围">
                <Space direction="vertical">
                  <Radio.Group options={options} value={activityData.saleScopeType} />
                  {activityData.saleScopeType > 1 &&
                    (activityData.saleScopeType === 2 ? (
                      <div>
                        {teamLeaderData.map((point) => (
                          <Tag>
                            {point.pickupPointProvince +
                              (point.pickupPointCity ? point.pickupPointCity : '') +
                              (point.pickupPointArea ? point.pickupPointArea : '')}
                          </Tag>
                        ))}
                      </div>
                    ) : (
                      <Table columns={teamLeaderColumns} dataSource={teamLeaderData} />
                    ))}
                </Space>
              </Form.Item>
              <Form.Item label="配送方式">
                <span>{deliveryType[activityData.deliveryType]}</span>
              </Form.Item>
              <Form.Item label="发货时间说明">
                <span>{activityData.shippingTimeDescription}</span>
              </Form.Item>
              <Form.Item label="活动商品及佣金">
                <Table
                  rowKey="productId"
                  columns={columns}
                  expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
                  dataSource={goodsData}
                />
              </Form.Item>
              <Form.Item label="团购图片">
                <Image
                  width={200}
                  src={
                    activityData.picture ||
                    'data:image/png;base64,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'
                  }
                />
              </Form.Item>
              <Form.Item label="团购详情">
                <Editor value={editorState} readOnly={true} />
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </PageHeaderWrapper>
    </div>
  )
}

export default CbgActivityDetail
