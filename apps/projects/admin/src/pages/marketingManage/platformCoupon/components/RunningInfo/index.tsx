/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 18:06:53
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 19:46:56
 * @Description: 执行明细
 */
import React, { useRef } from 'react'
import MellowCard from '@/components/MellowCard'
import moment from 'moment'
import { getMarketingCouponPlatformWaiteExecuteDetailPage } from '@apps/apis'
import { StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import useSelectOptions from './services/hooks/useSelectOptions'

export type ListItemDataType = {
  /**
   * 数据id
   */
  productId: number
  /**
   * 商品图片
   */
  productImg: string
  /**
   * 商品图片
   */
  productName: string
  /**
   * 商品品类
   */
  category: string
  /**
   * 商品品牌
   */
  brand: string
  /**
   * 商品单位
   */
  unit: string
  /**
   * 商品单价
   */
  price: number
}

export type FetchParams = {
  /**
   * 当前页
   */
  current: number
  /**
   * 每页行数
   */
  pageSize: number
}

export type FetchExtraParams = {
  /**
   * 客户名称
   */
  memberName: string
  /**
   * 券码
   */
  code: string
  /**
   * 券状态
   */
  status: number
  /**
   * 领(发)券起始时间
   */
  createTimeStart: string
  /**
   * 领(发)券截止时间
   */
  createTimeEnd: string
  /**
   * 客户ID
   */
  memberId: string
  /**
   * 适用用户
   */
  suitableMemberType: number
  /**
   * 下单(使用)起始时间
   */
  useTimeStart: string
  /**
   * 下单(使用)截止时间
   */
  useTimeEnd: string
  /**
   * 关联订单号
   */
  orderNo: string
  /**
   * 商城
   */
  shopId: number
}

interface IProps {
  /**
   * 优惠券id
   */
  couponId: number
  /**
   * 数据
   */
  dataSource?: ListItemDataType[]
}

const RunningInfo: React.FC<IProps> = (props) => {
  const { couponId, dataSource, ...rest } = props

  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions(couponId)

  const fetchData = async (params: FetchParams & FetchExtraParams) => {
    if (!couponId) {
      return { data: [], totalCount: 0 }
    }
    const res = await getMarketingCouponPlatformWaiteExecuteDetailPage({
      ...params,
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
      status: params.status ? `${params.status}` : '',
      suitableMemberType: params.suitableMemberType ? `${params.suitableMemberType}` : '',
      shopId: params.shopId ? `${params.shopId}` : '',
      createTimeStart: params.createTimeStart ? `${moment(params.createTimeStart).valueOf()}` : '',
      createTimeEnd: params.createTimeEnd ? `${moment(params.createTimeEnd).valueOf()}` : '',
      useTimeStart: params.useTimeStart ? `${moment(params.useTimeStart).valueOf()}` : '',
      useTimeEnd: params.useTimeEnd ? `${moment(params.useTimeEnd).valueOf()}` : '',
      couponId: `${couponId}`,
    })
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '券码',
      key: 'code',
    },
    {
      title: '券状态',
      key: 'statusName',
      searchField: {
        type: 'Select',
        name: 'status',
      },
    },
    {
      title: '客户ID',
      key: 'subMemberId',
      ellipsis: true,
      searchField: {
        type: 'Input',
        name: 'memberId',
      },
    },
    {
      title: '客户名称',
      key: 'subMemberName',
      searchField: {
        main: true,
        type: 'Input',
        name: 'memberName',
      },
    },
    {
      title: '适用用户',
      key: 'suitableMemberTypeName',
      searchField: {
        type: 'Select',
        name: 'suitableMemberType',
      },
    },
    {
      title: '领(发)放券时间',
      key: 'createTime',
      searchField: {
        type: 'DateRange',
        name: ['createTimeStart', 'createTimeEnd'],
        placeholder: ['领(发)券起始时间', '领(发)券截止时间'],
      },
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '券有效期起始时间',
      key: 'validTimeStart',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '券有效期截止时间',
      key: 'validTimeEnd',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '关联订单',
      key: 'orderNo',
      searchField: 'Input',
    },
    {
      title: '下单(使用)时间',
      key: 'useTime',
      searchField: {
        type: 'DateRange',
        name: ['useTimeStart', 'useTimeEnd'],
        placeholder: ['下单(使用)起始时间', '下单(使用)截止时间'],
      },
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '商城',
      key: 'shopName',
      searchField: {
        type: 'Select',
        name: 'shopId',
      },
    },
    {
      title: '订单金额',
      key: 'amount',
      render: (text) => `¥ ${text || '0'}`,
    },
    {
      title: '订单状态',
      key: 'orderStatusName',
    },
  ]

  return (
    <MellowCard title="执行明细" {...rest}>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        searchSelectMaps={selectData}
      />
    </MellowCard>
  )
}

export default RunningInfo
