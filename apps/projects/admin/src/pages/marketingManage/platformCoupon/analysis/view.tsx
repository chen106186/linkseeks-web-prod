/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 11:10:57
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-12 14:14:02
 * @Description: 商家优惠券执行
 */
import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button } from 'antd'
import { AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
// import moment from 'moment'
import { getMarketingCouponPlatformWaiteExecutePage } from '@apps/apis'
import commonColumn from '../common/columns/coupon'
import useSelectOptions from './services/hooks/useSelectOptions'

type SearchValueType = {
  name: string
  id: string
  releaseTimeStart: string | number
  releaseTimeEnd: string | number
  effectiveTimeStart: string | number
  effectiveTimeEnd: string | number
  type: number
  getWay: number
  status: number
  current: number
  pageSize: number
}

type ParamsType = Omit<
  SearchValueType,
  'releaseTimeStart' | 'releaseTimeEnd' | 'effectiveTimeStart' | 'effectiveTimeEnd'
> & {
  releaseTimeStart: number | undefined
  releaseTimeEnd: number | undefined
  effectiveTimeStart: number | undefined
  effectiveTimeEnd: number | undefined
}

const PlatformCouponAnalysis: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const fetchData = async (params: SearchValueType) => {
    const payload = { ...params }
    const res = await getMarketingCouponPlatformWaiteExecutePage(payload as any)
    return res.data
  }

  const baseColumns: RecordColumns<any>[] = commonColumn('/marketingManage/platformCoupon/analysis/detail')
  baseColumns.pop()
  const defaultColumns = baseColumns.concat([
    {
      title: '已领取',
      key: 'obtainQuantity',
    },
    {
      title: '已使用',
      key: 'useQuantity',
    },
    {
      title: '已过期',
      key: 'dueQuantity',
    },
    {
      title: '内部状态',
      key: 'statusName',
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <>
          {record.release && (
            <AuthButton type="custom" code="deliver">
              <Button
                type="link"
                onClick={() => history.push(`/marketingManage/platformCoupon/analysis/deliver?id=${record.id}`)}
              >
                发券
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ])

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={defaultColumns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        searchSelectMaps={selectData}
      />
    </PageHeaderWrapper>
  )
}

export default PlatformCouponAnalysis
