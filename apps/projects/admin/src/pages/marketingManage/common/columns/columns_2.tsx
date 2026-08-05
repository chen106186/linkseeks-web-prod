import React from 'react'
import { Tooltip, Image, Typography } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const columns_2 = () => {
  return [
    {
      title: '商品ID',
      key: 'productId',
      dataIndex: 'productId',
      render: (text) => (
        <Typography.Link target="_blank" href={`/productManage/commodity/products/detail?id=${text}`}>
          {text}
        </Typography.Link>
      ),
    },
    {
      title: '商品图片',
      key: 'productImgUrl',
      dataIndex: 'productImgUrl',
      render: (text) => <Image width={32} height={32} src={text} />,
    },
    {
      title: '商品名称',
      key: 'productName',
      dataIndex: 'productName',
    },
    {
      title: '品类',
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: '品牌',
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: '单位',
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: '商品价格',
      key: 'price',
      dataIndex: 'price',
      render: (text) => (text ? `￥${Number(text).toFixed(2)}` : `￥0`),
    },
    {
      title: (
        <Tooltip
          placement="top"
          title="直降价格为商品价格的直降价格，如原价每件￥20.00的商品，每件降价￥2.00，则直降价格输入框中输入 ￥2.00"
        >
          直降价格 <QuestionCircleOutlined />
        </Tooltip>
      ),
      key: 'plummetPrice',
      dataIndex: 'plummetPrice',
      render: (text) => (text ? `￥${Number(text).toFixed(2)}` : `￥0`),
    },
    {
      title: '活动价格',
      key: 'activityPrice',
      dataIndex: 'activityPrice',
      render: (text) => (text ? `￥${Number(text).toFixed(2)}` : `￥0`),
    },
    {
      title: '个人限购数量',
      key: 'restrictNum',
      dataIndex: 'restrictNum',
    },
    {
      title: '活动限购总数量',
      key: 'restrictTotalNum',
      dataIndex: 'restrictTotalNum',
    },
  ]
}
export default columns_2
