import React from 'react'
import { Image, Typography } from 'antd'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const columns_5 = ({ dataSource, setDataSource, handleDelete, form }) => {
  return [
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.productID' })}`,
      key: 'productId',
      dataIndex: 'productId',
      render: (text) => (
        <Typography.Link target="_blank" href={`/commodityAbility/commodity/products/detail?id=${text}`}>
          {text}
        </Typography.Link>
      ),
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.commodityImages' })}`,
      key: 'productImgUrl',
      dataIndex: 'productImgUrl',
      render: (text) => <Image width={32} height={32} src={text} />,
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.nameOfCommodity' })}`,
      key: 'productName',
      dataIndex: 'productName',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.category' })}`,
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.brand' })}`,
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.unit' })}`,
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.commodityPrices' })}`,
      key: 'price',
      dataIndex: 'price',
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.groupPurchasePrice' })}`,
      key: 'activityPrice',
      dataIndex: 'activityPrice',
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.individualPurchaseQuantity' })}`,
      key: 'restrictNum',
      dataIndex: 'restrictNum',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.numberPurchasingActivities' })}`,
      key: 'restrictTotalNum',
      dataIndex: 'restrictTotalNum',
    },
  ]
}
export default columns_5
