/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 11:10:57
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-26 18:25:44
 * @Description: 商家优惠券执行
 */
import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Card, Space, Button } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { DatePicker } from '@apps/formily'
import moment from 'moment'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import NiceForm from '@/components/NiceForm'
import {
  getMarketingCouponTypeList,
  getMarketingCouponWaiteExecutePage,
  GetMarketingCouponWaiteExecutePageResponseDetail,
} from '@apps/apis'
import useSpliceArray from '@/hooks/useSpliceArray'
import { MERCHANT_COUPON_RECEIVE_DESIGNATED } from '@/constants/marketing'
import verifySchema from '../common/schemas/verify'
import commonColumn from '../common/columns/coupon'
import { useIntl } from '@linkseeks/i18n'
import { AuthButton } from '@apps/components'

const formActions = createFormActions()

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
  releaseTimeStart: number
  releaseTimeEnd: number
  effectiveTimeStart: number
  effectiveTimeEnd: number
}

const MerchantCouponAnalysis: React.FC = () => {
  const intl = useIntl()
  const ref = useRef<any>({})

  const fetchData = async (value: SearchValueType) => {
    const { releaseTimeStart, releaseTimeEnd, effectiveTimeStart, effectiveTimeEnd, ...rest } = value
    const params: ParamsType = {
      releaseTimeStart: null,
      releaseTimeEnd: null,
      effectiveTimeStart: null,
      effectiveTimeEnd: null,
      ...rest,
    }

    params.releaseTimeStart = releaseTimeStart ? moment(releaseTimeStart).valueOf() : null
    params.releaseTimeEnd = releaseTimeEnd ? moment(releaseTimeEnd).valueOf() : null
    params.effectiveTimeStart = effectiveTimeStart ? moment(effectiveTimeStart).valueOf() : null
    params.effectiveTimeEnd = effectiveTimeEnd ? moment(effectiveTimeEnd).valueOf() : null

    let res = await getMarketingCouponWaiteExecutePage(params as any)
    return res.data
  }

  const baseColumns: ColumnType<GetMarketingCouponWaiteExecutePageResponseDetail>[] = commonColumn(
    '/marketingAbility/merchantCoupon/analysis/detail',
  )
  baseColumns.pop()
  const defaultColumns = baseColumns.concat([
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.Havereceived' })}`,
      dataIndex: 'obtainQuantity',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.Used' })}`,
      dataIndex: 'useQuantity',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.expired' })}`,
      dataIndex: 'dueQuantity',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.innerState' })}`,
      dataIndex: 'statusName',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.operation' })}`,
      dataIndex: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          {record.release && (
            <AuthButton type="custom" code="deliver">
              <Button
                type="link"
                onClick={() => history.push(`/marketingAbility/merchantCoupon/analysis/deliver?id=${record.id}`)}
              >
                {intl.formatMessage({ id: 'merchantCoupon.Shuttlecoupon' })}
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ])

  const [columns, columnsHandle] = useSpliceArray<ColumnType<any>>(defaultColumns)

  // 初始化高级筛选选项
  const fetchTypeEnums = async () => {
    const res = await getMarketingCouponTypeList()

    if (res.code === 1000) {
      const { data = [] } = res

      return {
        type: data.map((item) => ({ label: item.name, value: item.value })),
      }
    }
    return {}
  }

  const ControllerBtns = () => null

  return (
    <Card>
      <StandardTable
        tableProps={{
          rowKey: 'id',
        }}
        columns={columns}
        currentRef={ref}
        fetchTableData={(params: any) => fetchData(params)}
        controlRender={
          <NiceForm
            actions={formActions}
            components={{
              ControllerBtns,
              RangePicker: DatePicker.RangePicker,
            }}
            onSubmit={(values) => ref.current.reload(values)}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              useAsyncInitSelect(['type'], fetchTypeEnums)
            }}
            schema={verifySchema}
          />
        }
      />
    </Card>
  )
}

export default MerchantCouponAnalysis
