import React from 'react'
import { Tooltip, Image, Typography } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const columns_1 = () => {
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
      render: (text) => `￥${Number(text).toFixed(2)}`,
    },
    {
      title: (
        <Tooltip placement="top" title="活动价格表示商城直接以该商品的活动价格进行销售">
          活动价格 <QuestionCircleOutlined />
        </Tooltip>
      ),
      key: 'activityPrice',
      dataIndex: 'activityPrice',
      render: (text) => `￥${Number(text).toFixed(2)}`,
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
export default columns_1
