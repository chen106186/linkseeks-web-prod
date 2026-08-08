import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { Tooltip, Image } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export const Columns = (int) => {
  switch (Number(int)) {
    case 1:
      return [
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityImages' })}`,
          key: 'productImgUrl',
          dataIndex: 'productImgUrl',
          render: (text) => <Image width={32} height={32} src={text} />,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityID' })}`,
          key: 'productId',
          dataIndex: 'productId',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.nameOfCommodity' })}`,
          key: 'productName',
          dataIndex: 'productName',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.category' })}`,
          key: 'category',
          dataIndex: 'category',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.brand' })}`,
          key: 'brand',
          dataIndex: 'brand',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.unit' })}`,
          key: 'unit',
          dataIndex: 'unit',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityPrices' })}`,
          key: 'price',
          dataIndex: 'price',
          render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
        },
        {
          title: (
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: 'paltformSign.activityPriceSaidMallDirectlyToTheCommoditiesPriceToSell',
              })}
            >
              {intl.formatMessage({ id: 'paltformSign.activityPrice' })}
              <QuestionCircleOutlined />
            </Tooltip>
          ),
          key: 'activityPrice',
          dataIndex: 'activityPrice',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.individualPurchaseQuantity' })}`,
          key: 'restrictNum',
          dataIndex: 'restrictNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.theTotalNumberForPurchasingActivities' })}`,
          key: 'restrictTotalNum',
          dataIndex: 'restrictTotalNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.operation' })}`,
          key: 'operation',
          dataIndex: 'operation',
          operation: true,
        },
      ]
    case 2:
      return [
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityImages' })}`,
          key: 'productImgUrl',
          dataIndex: 'productImgUrl',
          render: (text) => <Image width={32} height={32} src={text} />,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityID' })}`,
          key: 'productId',
          dataIndex: 'productId',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.nameOfCommodity' })}`,
          key: 'productName',
          dataIndex: 'productName',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.category' })}`,
          key: 'category',
          dataIndex: 'category',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.brand' })}`,
          key: 'brand',
          dataIndex: 'brand',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.unit' })}`,
          key: 'unit',
          dataIndex: 'unit',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityPrices' })}`,
          key: 'price',
          dataIndex: 'price',
          render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
        },
        {
          title: (
            <Tooltip
              placement="top"
              title="直降价格为商品价格的直降价格，如原价每件￥20.00的商品，每件降价￥2.00，则直降价格输入框中输入 ￥2.00"
            >
              {intl.formatMessage({ id: 'paltformSign.straightDownThePrice' })}
              <QuestionCircleOutlined />
            </Tooltip>
          ),
          key: 'plummetPrice',
          dataIndex: 'plummetPrice',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.activityPrice' })}`,
          key: 'activityPrice',
          dataIndex: 'activityPrice',
          render: (text) =>
            text
              ? `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`
              : `${intl.formatMessage({ id: 'common.money' })}0`,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.individualPurchaseQuantity' })}`,
          key: 'restrictNum',
          dataIndex: 'restrictNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.theTotalNumberForPurchasingActivities' })}`,
          key: 'restrictTotalNum',
          dataIndex: 'restrictTotalNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.operation' })}`,
          key: 'operation',
          dataIndex: 'operation',
          operation: true,
        },
      ]
    case 3:
      return [
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityImages' })}`,
          key: 'productImgUrl',
          dataIndex: 'productImgUrl',
          render: (text) => <Image width={32} height={32} src={text} />,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityID' })}`,
          key: 'productId',
          dataIndex: 'productId',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.nameOfCommodity' })}`,
          key: 'productName',
          dataIndex: 'productName',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.category' })}`,
          key: 'category',
          dataIndex: 'category',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.brand' })}`,
          key: 'brand',
          dataIndex: 'brand',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.unit' })}`,
          key: 'unit',
          dataIndex: 'unit',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityPrices' })}`,
          key: 'price',
          dataIndex: 'price',
          render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
        },
        {
          title: (
            <Tooltip placement="top" title={intl.formatMessage({ id: 'paltformSign.discount85' })}>
              {intl.formatMessage({ id: 'paltformSigniscount' })}
              <QuestionCircleOutlined />
            </Tooltip>
          ),
          key: 'discount',
          dataIndex: 'discount',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.activityPrice' })}`,
          key: 'activityPrice',
          dataIndex: 'activityPrice',
          render: (text) =>
            text
              ? `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`
              : `${intl.formatMessage({ id: 'common.money' })}0`,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.individualPurchaseQuantity' })}`,
          key: 'restrictNum',
          dataIndex: 'restrictNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.theTotalNumberForPurchasingActivities' })}`,
          key: 'restrictTotalNum',
          dataIndex: 'restrictTotalNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.operation' })}`,
          key: 'operation',
          dataIndex: 'operation',
          operation: true,
        },
      ]
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 13:
    case 15:
    case 16:
      return [
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityImages' })}`,
          key: 'productImgUrl',
          dataIndex: 'productImgUrl',
          render: (text) => <Image width={32} height={32} src={text} />,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityID' })}`,
          key: 'productId',
          dataIndex: 'productId',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.nameOfCommodity' })}`,
          key: 'productName',
          dataIndex: 'productName',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.category' })}`,
          key: 'category',
          dataIndex: 'category',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.brand' })}`,
          key: 'brand',
          dataIndex: 'brand',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.unit' })}`,
          key: 'unit',
          dataIndex: 'unit',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityPrices' })}`,
          key: 'price',
          dataIndex: 'price',
          render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.individualPurchaseQuantity' })}`,
          key: 'restrictNum',
          dataIndex: 'restrictNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.theTotalNumberForPurchasingActivities' })}`,
          key: 'restrictTotalNum',
          dataIndex: 'restrictTotalNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.operation' })}`,
          key: 'operation',
          dataIndex: 'operation',
          operation: true,
        },
      ]
    case 9:
      return [
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityImages' })}`,
          key: 'productImgUrl',
          dataIndex: 'productImgUrl',
          render: (text) => <Image width={32} height={32} src={text} />,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityID' })}`,
          key: 'productId',
          dataIndex: 'productId',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.nameOfCommodity' })}`,
          key: 'productName',
          dataIndex: 'productName',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.category' })}`,
          key: 'category',
          dataIndex: 'category',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.brand' })}`,
          key: 'brand',
          dataIndex: 'brand',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.unit' })}`,
          key: 'unit',
          dataIndex: 'unit',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityPrices' })}`,
          key: 'price',
          dataIndex: 'price',
          render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.groupPurchasePrice' })}`,
          key: 'activityPrice',
          dataIndex: 'activityPrice',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.individualPurchaseQuantity' })}`,
          key: 'restrictNum',
          dataIndex: 'restrictNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.theTotalNumberForPurchasingActivities' })}`,
          key: 'restrictTotalNum',
          dataIndex: 'restrictTotalNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.operation' })}`,
          key: '',
          dataIndex: '',
        },
      ]
    case 11:
      return [
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityImages' })}`,
          key: 'productImgUrl',
          dataIndex: 'productImgUrl',
          render: (text) => <Image width={32} height={32} src={text} />,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityID' })}`,
          key: 'productId',
          dataIndex: 'productId',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.nameOfCommodity' })}`,
          key: 'productName',
          dataIndex: 'productName',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.category' })}`,
          key: 'category',
          dataIndex: 'category',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.brand' })}`,
          key: 'brand',
          dataIndex: 'brand',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.unit' })}`,
          key: 'unit',
          dataIndex: 'unit',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityPrices' })}`,
          key: 'price',
          dataIndex: 'price',
          render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
        },
        {
          title: (
            <Tooltip
              placement="top"
              title={intl.formatMessage({ id: 'paltformSign.whenTheFirstUserToHelpNegotiateTheStartingPrice' })}
            >
              {intl.formatMessage({ id: 'paltformSign.theStartingPrice' })}
              <QuestionCircleOutlined />
            </Tooltip>
          ),
          key: 'plummetPrice',
          dataIndex: 'plummetPrice',
          editable: true,
        },
        {
          title: (
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: 'paltformSign.theLastTimeInTheProcessOfBargainingBargainingCannotExceedBargainPrice',
              })}
            >
              {intl.formatMessage({ id: 'paltformSign.bargainPrice' })}
              <QuestionCircleOutlined />
            </Tooltip>
          ),
          key: 'activityPrice',
          dataIndex: 'activityPrice',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.individualPurchaseQuantity' })}`,
          key: 'restrictNum',
          dataIndex: 'restrictNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.theTotalNumberForPurchasingActivities' })}`,
          key: 'restrictTotalNum',
          dataIndex: 'restrictTotalNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.operation' })}`,
          key: 'operation',
          dataIndex: 'operation',
          operation: true,
        },
      ]
    case 12:
      return [
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityImages' })}`,
          key: 'productImgUrl',
          dataIndex: 'productImgUrl',
          render: (text) => <Image width={32} height={32} src={text} />,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityID' })}`,
          key: 'productId',
          dataIndex: 'productId',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.nameOfCommodity' })}`,
          key: 'productName',
          dataIndex: 'productName',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.category' })}`,
          key: 'category',
          dataIndex: 'category',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.brand' })}`,
          key: 'brand',
          dataIndex: 'brand',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.unit' })}`,
          key: 'unit',
          dataIndex: 'unit',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityPrices' })}`,
          key: 'price',
          dataIndex: 'price',
          render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
        },
        {
          title: (
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: 'paltformSign.pricesInSecondsKillKillTimePeriodMallDirectlyToDownThePriceOfTheGoodsSales',
              })}
            >
              {intl.formatMessage({ id: 'paltformSignownThePrice' })}
              <QuestionCircleOutlined />
            </Tooltip>
          ),
          key: 'activityPrice',
          dataIndex: 'activityPrice',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.individualPurchaseQuantity' })}`,
          key: 'restrictNum',
          dataIndex: 'restrictNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.theTotalNumberForPurchasingActivities' })}`,
          key: 'restrictTotalNum',
          dataIndex: 'restrictTotalNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.operation' })}`,
          key: 'operation',
          dataIndex: 'operation',
          operation: true,
        },
      ]
    case 14:
      return [
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityImages' })}`,
          key: 'productImgUrl',
          dataIndex: 'productImgUrl',
          render: (text) => <Image width={32} height={32} src={text} />,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityID' })}`,
          key: 'productId',
          dataIndex: 'productId',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.nameOfCommodity' })}`,
          key: 'productName',
          dataIndex: 'productName',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.category' })}`,
          key: 'category',
          dataIndex: 'category',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.brand' })}`,
          key: 'brand',
          dataIndex: 'brand',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.unit' })}`,
          key: 'unit',
          dataIndex: 'unit',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.commodityPrices' })}`,
          key: 'price',
          dataIndex: 'price',
          render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.openToBookingAPrice' })}`,
          key: 'activityPrice',
          dataIndex: 'activityPrice',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.unitOfTheDeposit' })}`,
          key: 'activityPrice',
          dataIndex: 'activityPrice',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.theDepositDeductionPrice' })}`,
          key: 'activityPrice',
          dataIndex: 'activityPrice',
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.individualPurchaseQuantity' })}`,
          key: 'restrictNum',
          dataIndex: 'restrictNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.theTotalNumberForPurchasingActivities' })}`,
          key: 'restrictTotalNum',
          dataIndex: 'restrictTotalNum',
          editable: true,
        },
        {
          title: `${intl.formatMessage({ id: 'paltformSign.operation' })}`,
          key: '',
          dataIndex: '',
        },
      ]
  }
}
