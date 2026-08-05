import React from 'react'
import { Tooltip, Image, Typography } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
const columns_2 = () => {
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
      render: (text) =>
        text
          ? `${translate('web.common.currencySymbol')}${Number(text).toFixed(2)}`
          : `${translate('web.common.currencySymbol')}0`,
    },
    {
      title: (
        <Tooltip
          placement="top"
          title="直降价格为商品价格的直降价格，如原价每件￥20.00的商品，每件降价￥2.00，则直降价格输入框中输入 ￥2.00"
        >
          {intl.formatMessage({ id: 'marketingAbility.straightDownThePrice' })}
          <QuestionCircleOutlined />
        </Tooltip>
      ),
      key: 'plummetPrice',
      dataIndex: 'plummetPrice',
      render: (text) =>
        text
          ? `${translate('web.common.currencySymbol')}${Number(text).toFixed(2)}`
          : `${translate('web.common.currencySymbol')}0`,
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.activityPrice' })}`,
      key: 'activityPrice',
      dataIndex: 'activityPrice',
      render: (text) =>
        text
          ? `${translate('web.common.currencySymbol')}${Number(text).toFixed(2)}`
          : `${translate('web.common.currencySymbol')}0`,
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
export default columns_2
