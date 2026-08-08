import React from 'react'
import { numFormat, priceFormat } from '@/utils/numberFomat'
import { ImageBox } from '@apps/components'

const showMainPic = (mainPic: string) => <ImageBox width={32} height={32} src={mainPic} />

export const promptCommodityColumn = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '商品图片',
    dataIndex: 'mainPic',
    render: (mainPic: string) => showMainPic(mainPic),
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    width: 300,
    ellipsis: true,
    // eslint-disable-next-line react/display-name
    render: (name: any) => <div dangerouslySetInnerHTML={{ __html: name }}></div>,
  },
  {
    title: '品类',
    ellipsis: true,
    render: (_, record) => (record.customerCategory ? record.customerCategory.name : ''),
  },
  {
    title: '品牌',
    ellipsis: true,
    render: (_, record) => (record.brand ? record.brand.name : ''),
  },
  {
    title: '价格',
    dataIndex: 'min',
    render: (_, record) => `¥${priceFormat(record.min)}`,
  },
]

export const integralCommodityColumn = [
  {
    title: '商品图片',
    dataIndex: 'mainPic',
    render: (mainPic: string) => showMainPic(mainPic),
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    width: 300,
    ellipsis: true,
    // eslint-disable-next-line react/display-name
    render: (name: any) => <div dangerouslySetInnerHTML={{ __html: name }}></div>,
  },
  {
    title: '需要积分',
    dataIndex: 'min',
    render: (_, record) => `${numFormat(record.min)}`,
  },
]

export const shopColumn = [
  {
    title: '店铺图片',
    dataIndex: 'logo',
    render: (logo: string) => showMainPic(logo),
  },
  {
    title: '店铺名称',
    dataIndex: 'memberName',
    width: 300,
    ellipsis: true,
  },
]

export const brandColumn = [
  {
    title: '品牌logo',
    dataIndex: 'logoUrl',
    render: (imageUrl: string) => showMainPic(imageUrl),
  },
  {
    title: '品牌名称',
    dataIndex: 'name',
    width: 360,
    ellipsis: true,
  },
]

const tableColumn = {
  1: promptCommodityColumn,
  2: integralCommodityColumn,
  3: shopColumn,
  4: brandColumn,
}

export default tableColumn
