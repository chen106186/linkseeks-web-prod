import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
export const columns = [
  {
    title: intl.formatMessage({ id: 'detail.purchase.type' }),
    dataIndex: 'name',
    key: 'name',
    render: (t, r) => (
      <>
        <div>{r.code}</div>
        <div>{t}</div>
      </>
    ),
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.guigexinghao' }),
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.pinlei' }),
    dataIndex: 'categoryName',
    key: 'categoryName',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.pinpai' }),
    dataIndex: 'brandName',
    key: 'brandName',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.caigoushuliangdanwei' }),
    dataIndex: 'count',
    key: 'count',
    render: (t, r) => (
      <>
        <div>{t}</div>
        <div>{r.unitName}</div>
      </>
    ),
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.hanshui/shuilü' }),
    dataIndex: 'isTax',
    key: 'isTax',
    render: (t, r) => (
      <>
        <div>
          {t ? intl.formatMessage({ id: 'table.purchase.shi' }) : intl.formatMessage({ id: 'table.purchase.fou' })}
        </div>
        <div>{r.taxRate}%</div>
      </>
    ),
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.taxUnitPrice' }),
    dataIndex: 'price',
    key: 'price',
    render: (t) => `${translate('web.common.currencySymbol')}${t}`,
  },
  // {
  //   title: '中标数量',
  //   dataIndex: 'awardTenderRatio',
  //   key: 'awardTenderRatio',
  //   render: (t, r) => (Number(t)/100 * Number(r.count)).toFixed(2)
  // },
  {
    title: intl.formatMessage({ id: 'detail.purchase.taxPrice' }),
    dataIndex: 'money',
    key: 'money',
    render: (t, r) => `${translate('web.common.currencySymbol')}${Number((r.price * r.count).toFixed(2))}`,
  },
]
