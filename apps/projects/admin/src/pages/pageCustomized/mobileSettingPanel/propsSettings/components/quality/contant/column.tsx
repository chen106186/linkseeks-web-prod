import React from 'react'
import { numFormat, priceFormat } from '@/utils/numberFomat'
import { ImageBox } from '@apps/components'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'

const showMainPic = (mainPic: string) => <ImageBox width={32} height={32} src={mainPic} />

export const promptCommodityColumn: RecordColumns<any>[] = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '商品图片',
    key: 'mainPic',
    render: (mainPic: string) => showMainPic(mainPic),
  },
  {
    title: '商品名称',
    key: 'name',
    width: 300,
    ellipsis: true,
    searchField: {
      main: true,
    },
    render: (name: any) => <div dangerouslySetInnerHTML={{ __html: name }}></div>,
  },
  {
    title: '品类',
    ellipsis: true,
    key: 'customerCategory',
    searchField: {
      name: 'customerCategoryId',
      type: 'SearchSelect',
    },
    render: (_, record) => (record.customerCategory ? record.customerCategory.name : ''),
  },
  {
    title: '品牌',
    key: 'brand',
    ellipsis: true,
    searchField: {
      name: 'brandId',
      type: 'SearchSelect',
    },
    render: (_, record) => (record.brand ? record.brand.name : ''),
  },
  {
    title: '价格',
    key: 'min',
    render: (_, record) => `¥${priceFormat(record.min)}`,
  },
]

export const integralCommodityColumn: RecordColumns<any>[] = [
  {
    title: '商品图片',
    key: 'mainPic',
    render: (mainPic: string) => showMainPic(mainPic),
  },
  {
    title: '商品名称',
    key: 'name',
    ellipsis: true,
    searchField: {
      type: 'Input',
      name: 'name',
      title: '搜索',
    },
    render: (name: any) => <div dangerouslySetInnerHTML={{ __html: name }}></div>,
  },
  {
    title: '需要积分',
    key: 'min',
    render: (_, record) => `${numFormat(record.min)}`,
  },
]

export const shopColumn: RecordColumns<any>[] = [
  {
    title: '店铺图片',
    key: 'logo',
    render: (logo: string) => showMainPic(logo),
  },
  {
    title: '店铺名称',
    key: 'memberName',
    ellipsis: true,
    searchField: {
      type: 'Input',
      name: 'name',
      title: '搜索',
    },
  },
]

export const brandColumn: RecordColumns<any>[] = [
  {
    title: '品牌logo',
    key: 'logoUrl',
    render: (imageUrl: string) => showMainPic(imageUrl),
  },
  {
    title: '品牌名称',
    key: 'name',
    ellipsis: true,
    searchField: {
      type: 'Input',
      name: 'name',
      title: '搜索',
    },
  },
]

export const informationColumn: RecordColumns<any>[] = [
  {
    title: '资讯图片',
    key: 'imageUrl',
    render: (imageUrl: string) => showMainPic(imageUrl),
  },
  {
    title: '资讯标题',
    key: 'title',
    ellipsis: true,
    searchField: {
      type: 'Input',
      name: 'name',
      title: '搜索',
    },
  },
]

const tableColumn = {
  1: promptCommodityColumn,
  2: shopColumn,
  3: brandColumn,
  4: informationColumn,
}

export default tableColumn
