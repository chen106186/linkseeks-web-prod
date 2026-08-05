/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 18:06:53
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 19:43:45
 * @Description: 执行明细
 */
import React, { useRef } from 'react'
import { createFormActions } from '@apps/formily'
import { DatePicker } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import moment from 'moment'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import NiceForm from '@/components/NiceForm'
import MellowCard from '@/components/MellowCard'
import { querySchema } from './schema'
import { getMarketingCouponWaiteExecuteDetailPage, getMarketingCouponWaiteExecuteDetailPageCondition } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

const formActions = createFormActions()

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

const translate = getWebIntl()

const RunningInfo: React.FC<IProps> = (props) => {
  const intl = useIntl()
  const { couponId, dataSource, ...rest } = props

  const ref = useRef<any>({})

  const fetchData = async (params: FetchParams & FetchExtraParams) => {
    if (!couponId) {
      return { data: [], totalCount: 0 }
    }
    const res = await getMarketingCouponWaiteExecuteDetailPage({
      ...params,
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
      status: params.status ? `${params.status}` : undefined,
      suitableMemberType: params.suitableMemberType ? `${params.suitableMemberType}` : undefined,
      shopId: params.shopId ? `${params.shopId}` : undefined,
      createTimeStart: params.createTimeStart ? `${moment(params.createTimeStart).valueOf()}` : undefined,
      createTimeEnd: params.createTimeEnd ? `${moment(params.createTimeEnd).valueOf()}` : undefined,
      useTimeStart: params.useTimeStart ? `${moment(params.useTimeStart).valueOf()}` : undefined,
      useTimeEnd: params.useTimeEnd ? `${moment(params.useTimeEnd).valueOf()}` : undefined,
      couponId: `${couponId}`,
    })
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const columns: ColumnType<ListItemDataType>[] = [
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.Couponcode' })}`,
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.Couponstatus' })}`,
      dataIndex: 'statusName',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.customID' })}`,
      dataIndex: 'subMemberId',
      ellipsis: true,
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.Customername' })}`,
      dataIndex: 'subMemberName',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.suitUsers' })}`,
      dataIndex: 'suitableMemberTypeName',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.LeadSend' })}`,
      dataIndex: 'createTime',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.effectiveTimeEnd' })}`,
      dataIndex: 'validTimeStart',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.effectiveTimeStart' })}`,
      dataIndex: 'validTimeEnd',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.Associationorder' })}`,
      dataIndex: 'orderNo',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.OrderUseTime' })}`,
      dataIndex: 'useTime',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.Mall' })}`,
      dataIndex: 'shopName',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.orderamount' })}`,
      dataIndex: 'amount',
      render: (text) => `${translate('web.common.currencySymbol')}${text || '0'}`,
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.OrderStatus' })}`,
      dataIndex: 'orderStatusName',
    },
  ]

  // 初始化高级筛选选项
  const fetchTypeEnums = async () => {
    if (!couponId) {
      return {}
    }
    const res = await getMarketingCouponWaiteExecuteDetailPageCondition({
      id: `${couponId}`,
    })

    if (res.code === 1000) {
      const { statusList = [], suitableMemberTypeList = [], shopList = [] } = res.data

      return {
        status: statusList.map((item) => ({ label: item.name, value: item.value })),
        suitableMemberType: suitableMemberTypeList.map((item) => ({ label: item.name, value: item.value })),
        shopId: shopList.map((item) => ({ label: item.name, value: item.value })),
      }
    }
    return {}
  }

  return (
    <MellowCard title={intl.formatMessage({ id: 'merchantCoupon.runningInfo' })} {...rest}>
      <StandardTable
        tableProps={{
          rowKey: 'id',
        }}
        columns={columns}
        currentRef={ref}
        fetchTableData={(params: FetchParams & FetchExtraParams) => fetchData(params)}
        controlRender={
          <NiceForm
            actions={formActions}
            components={{
              RangePicker: DatePicker.RangePicker,
            }}
            onSubmit={(values) => ref.current.reload(values)}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'memberName', FORM_FILTER_PATH)
              useAsyncInitSelect(['status', 'suitableMemberType', 'shopId'], fetchTypeEnums)
            }}
            schema={querySchema}
          />
        }
      />
    </MellowCard>
  )
}

export default RunningInfo
