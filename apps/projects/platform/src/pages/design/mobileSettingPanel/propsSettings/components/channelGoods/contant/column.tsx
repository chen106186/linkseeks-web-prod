import React from 'react'
import { numFormat, priceFormat } from '@/utils/numberFomat'
import { ImageBox } from '@apps/components'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const showMainPic = (mainPic: string) => <ImageBox width={32} height={32} src={mainPic} />

export const promptCommodityColumn = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.mainPic' }),
    dataIndex: 'mainPic',
    render: (mainPic: string) => showMainPic(mainPic),
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.product.name' }),
    dataIndex: 'name',
    width: 300,
    ellipsis: true,
    // eslint-disable-next-line react/display-name
    render: (name: any) => <div dangerouslySetInnerHTML={{ __html: name }}></div>,
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.category' }),
    ellipsis: true,
    render: (_, record) => (record.customerCategory ? record.customerCategory.name : ''),
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.brand' }),
    ellipsis: true,
    render: (_, record) => (record.brand ? record.brand.name : ''),
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.unitName' }),
    dataIndex: 'min',
    render: (_, record) => `¥${priceFormat(record.min)}`,
  },
]

export const integralCommodityColumn = [
  {
    title: intl.formatMessage({ id: 'editor.columns.mainPic' }),
    dataIndex: 'mainPic',
    render: (mainPic: string) => showMainPic(mainPic),
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.product.name' }),
    dataIndex: 'name',
    width: 300,
    ellipsis: true,
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.integral' }),
    dataIndex: 'min',
    render: (_, record) => `${numFormat(record.min)}`,
  },
]

export const shopColumn = [
  {
    title: intl.formatMessage({ id: 'editor.columns.shop.logo' }),
    dataIndex: 'logo',
    render: (logo: string) => showMainPic(logo),
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.shop.name' }),
    dataIndex: 'memberName',
    width: 300,
    ellipsis: true,
  },
]

export const brandColumn = [
  {
    title: intl.formatMessage({ id: 'editor.columns.brand.logo' }),
    dataIndex: 'logoUrl',
    render: (imageUrl: string) => showMainPic(imageUrl),
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.brand.name' }),
    dataIndex: 'name',
    width: 360,
    ellipsis: true,
  },
]

export const informationColumn = [
  {
    title: intl.formatMessage({ id: 'editor.columns.information.img' }),
    dataIndex: 'imageUrl',
    render: (imageUrl: string) => showMainPic(imageUrl),
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.information.title' }),
    dataIndex: 'title',
    width: 360,
    ellipsis: true,
  },
]

const tableColumn = {
  1: promptCommodityColumn,
  2: shopColumn,
  3: brandColumn,
  4: informationColumn,
}

export default tableColumn
