/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 09:57:20
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-06 11:25:44
 * @Description:
 */
import React from 'react'
import { ColumnType } from 'antd/lib/table/interface'
import moment from 'moment'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { getIntl } from '@linkseeks/i18n'

/**
 *
 * @param target string 会员详情路径前缀
 * @returns Table Columns
 */
const intl = getIntl()
const columns = (target = '/marketingAbility/merchantCoupon/unsubmitted/detail'): ColumnType<any>[] => [
  {
    title: 'ID',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: intl.formatMessage({ id: 'merchantCoupon.couponName' }),
    dataIndex: 'name',
    align: 'center',
    render: (text, record) => (
      <DetailAuthButton>
        <EyeAuthButton url={`${target}?id=${record.id}`}>{text} </EyeAuthButton>
      </DetailAuthButton>
    ),
  },
  {
    title: intl.formatMessage({ id: 'merchantCoupon.couponTypeName' }),
    dataIndex: 'typeName',
    align: 'center',
  },
  {
    title: intl.formatMessage({ id: 'merchantCoupon.couponStartTime' }),
    dataIndex: 'releaseTimeStart',
    align: 'center',
    render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
  },
  {
    title: intl.formatMessage({ id: 'merchantCoupon.couponEndTime' }),
    dataIndex: 'releaseTimeEnd',
    align: 'center',
    render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
  },
  {
    title: intl.formatMessage({ id: 'merchantCoupon.effectiveTimeStart' }),
    dataIndex: 'effectiveTimeStart',
    align: 'center',
    render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'),
  },
  {
    title: intl.formatMessage({ id: 'merchantCoupon.effectiveTimeEnd' }),
    dataIndex: 'effectiveTimeEnd',
    align: 'center',
    render: (text, record) =>
      text
        ? moment(text).format('YYYY-MM-DD HH:mm:ss')
        : `${intl.formatMessage({
            id: 'merchantCoupon.components.couponRules.effectiveTimeEnd',
            days: record.invalidDay || '',
          })}`,
  },
  {
    title: intl.formatMessage({ id: 'merchantCoupon.getWayName' }),
    dataIndex: 'getWayName',
    align: 'center',
  },
  {
    title: intl.formatMessage({ id: 'merchantCoupon.denomination' }),
    dataIndex: 'denomination',
  },
  {
    title: intl.formatMessage({ id: 'merchantCoupon.couponAmount' }),
    dataIndex: 'quantity',
  },
  {
    title: intl.formatMessage({ id: 'merchantCoupon.statusName' }),
    dataIndex: 'statusName',
  },
]

export default columns
