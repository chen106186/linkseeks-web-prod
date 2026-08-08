/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 09:57:20
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-06 11:25:44
 * @Description:
 */
import React from 'react'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'

/**
 *
 * @param target string 会员详情路径前缀
 * @returns Table Columns
 */
const columns = (
  target = '/marketingManage/platformCoupon/unsubmitted/detail',
  hideTime?: string[],
): RecordColumns<any>[] => [
  {
    title: 'ID',
    key: 'id',
    fixed: 'left',
    width: 60,
    searchField: 'Input',
  },
  {
    title: '优惠券名称',
    key: 'name',
    searchField: {
      main: true,
    },
    fixed: 'left',
    render: (text, record) => <EyeAuthButton url={`${target}?id=${record.id}`}>{text}</EyeAuthButton>,
  },
  {
    title: '优惠券类型',
    key: 'type',
    searchField: {
      type: 'Select',
      name: 'type',
    },
    render: (_, recode) => recode.typeName,
  },
  {
    title: '领(发)券起始时间',
    key: 'releaseTimeStart',
    searchField:
      hideTime && hideTime.includes('releaseTime')
        ? undefined
        : {
            type: 'DateRange',
            title: '领(发)券时间',
            name: ['releaseTimeStart', 'releaseTimeEnd'],
            placeholder: ['领(发)券起始时间', '领(发)券结束时间'],
          },
    render: (text) => (text ? formatTimeString(text) : ''),
  },
  {
    title: '领(发)券截止时间',
    key: 'releaseTimeEnd',
    render: (text) => (text ? formatTimeString(text) : ''),
  },
  {
    title: '券有效期起始时间',
    key: 'effectiveTimeStart',
    searchField:
      hideTime && hideTime.includes('effectiveTime')
        ? undefined
        : {
            type: 'DateRange',
            title: '券有效期时间',
            name: ['effectiveTimeStart', 'effectiveTimeEnd'],
            placeholder: ['券有效起始时间', '券有效结束时间'],
          },
    render: (text) => (text ? formatTimeString(text) : '-'),
  },
  {
    title: '券有效期截止时间',
    key: 'effectiveTimeEnd',
    render: (text, record) => (text ? formatTimeString(text) : `领取${record.invalidDay}天后失效`),
  },
  {
    title: '领券方式',
    key: 'getWayName',
  },
  {
    title: '券面额',
    key: 'denomination',
  },
  {
    title: '发券数量',
    key: 'quantity',
  },
  {
    title: '内部状态',
    key: 'statusName',
  },
]

export default columns
