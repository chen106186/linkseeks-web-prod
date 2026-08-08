import React from 'react'
import { Image, Typography } from 'antd'

const columns_5 = ({ dataSource, setDataSource, handleDelete, form }) => {
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
      title: '团购价格',
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
export default columns_5
