import React from 'react'
import { Tooltip, Image, Typography } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const columns_6 = ({ dataSource, setDataSource, handleDelete, form }) => {
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
        <Tooltip placement="top" title="第一个用户帮砍价时的起始价格">
          起始价格 <QuestionCircleOutlined />
        </Tooltip>
      ),
      key: 'plummetPrice',
      dataIndex: 'plummetPrice',
      render: (text) => `￥${Number(text).toFixed(2)}`,
    },
    {
      title: (
        <Tooltip placement="top" title="砍价过程中最后一次砍价不能超过砍价底价">
          砍价底价 <QuestionCircleOutlined />
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
export default columns_6
