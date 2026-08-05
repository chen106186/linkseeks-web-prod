import { getIntl } from '@linkseeks/i18n'
import React from 'react'
import auto_receive from '@/assets/imgs/auto_receive.png'
import express_time from '@/assets/imgs/express_time.png'
import forcast_time from '@/assets/imgs/forcast_time.png'
import price_line from '@/assets/imgs/price_line.png'
import logistics_icon from '@/assets/imgs/logistics_icon.png'
import integral_icon from '@/assets/imgs/integral_icon.png'

export interface IConfigSource {
  id: number
  title: string
  description: string
  icon: string
  type: string
  isSettting: boolean
}

const intl = getIntl()

export const configSourceData: IConfigSource[] = [
  {
    id: 1,
    title: `${intl.formatMessage({ id: 'systemSetting.priceQuxian' })}`,
    description: `${intl.formatMessage({ id: 'systemSetting.priceLineCommodity' })}`,
    icon: price_line,
    type: 'commodity',
    isSettting: true,
  },
  {
    id: 2,
    title: `${intl.formatMessage({ id: 'systemSetting.zidongshouhuo' })}`,
    description: `${intl.formatMessage({ id: 'systemSetting.autoReceiveOrder' })}`,
    icon: auto_receive,
    type: 'order',
    isSettting: true,
  },
  {
    id: 3,
    title: `${intl.formatMessage({ id: 'systemSetting.DeliveryAppointmentDuration' })}`,
    description: `${intl.formatMessage({ id: 'systemSetting.forcastTimeOrder' })}`,
    icon: forcast_time,
    type: 'order',
    isSettting: true,
  },
  {
    id: 4,
    title: `${intl.formatMessage({ id: 'systemSetting.DeliveryTimePeriod' })}`,
    description: `${intl.formatMessage({ id: 'systemSetting.expressTimeOrder' })}`,
    icon: express_time,
    type: 'order',
    isSettting: true,
  },
  {
    id: 5,
    title: intl.formatMessage({ id: 'systemSetting.jifendikoudingdanjine', defaultMessage: '积分抵扣订单金额' }),
    description: intl.formatMessage({
      id: 'systemSetting.shezhixiadanshijifenke',
      defaultMessage: '设置下单时积分可抵扣的订单金额。',
    }),
    icon: integral_icon,
    type: 'integral',
    isSettting: false,
  },
  {
    id: 6,
    title: intl.formatMessage({ id: 'systemSetting.manebaoyou', defaultMessage: '满额包邮' }),
    description: intl.formatMessage({
      id: 'systemSetting.shezhidingdanmanduoshaojin',
      defaultMessage: '设置订单满多少金额免运费',
    }),
    icon: logistics_icon,
    type: 'logistics',
    isSettting: false,
  },
  {
    id: 7,
    title: intl.formatMessage({ id: 'systemSetting.socialDistribution', defaultMessage: '分销设置' }),
    description: intl.formatMessage({
      id: 'systemSetting.shezhimorenfenxiaobili',
      defaultMessage: '开启或关闭分销设置，设置默认分销比例',
    }),
    icon: auto_receive,
    type: 'socialDistribution',
    isSettting: false,
  },
  {
    id: 8,
    title: '默认仓位库存配置',
    description: '设置是否启用默认商品仓位，并配置默认仓位的仓库以及适用商城。',
    icon: logistics_icon,
    type: 'commodity',
    isSettting: false,
  },
]
