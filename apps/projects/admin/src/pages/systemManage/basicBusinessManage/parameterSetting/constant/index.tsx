import { getIntl } from '@linkseeks/i18n'
import React from 'react'
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
    id: 5,
    title: '积分抵扣订单金额',
    description: '设置下单时积分可抵扣的订单金额。',
    icon: integral_icon,
    type: 'integral',
    isSettting: false,
  },
  {
    id: 6,
    title: '售后有效期',
    description: '设置订单售后有效期，超过售后有效期后，不可申请售后。',
    icon: integral_icon,
    type: 'validity',
    isSettting: false,
  },
  {
    id: 7,
    title: '团购活动设置',
    description: '开启或关闭团购活动',
    icon: integral_icon,
    type: 'groupbuying',
    isSettting: false,
  },
]
