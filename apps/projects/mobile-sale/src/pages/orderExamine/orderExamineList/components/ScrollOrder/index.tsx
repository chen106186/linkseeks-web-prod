import React, { useState, forwardRef, useEffect } from 'react'
import { View } from '@apps/mobile-ui'
import { useDidShow } from '@apps/mobile-services/utils/taro'
import { getIntl } from '@linkseeks/i18n'
import { ORDER_INNER_STATUS } from '@/constants/const/order'
import ListScrollView from '@/components/ListScrollView'
import { Tabs } from '@/components/Tabs'
import Badge from '@/components/Badge'
import OrderItemCard, { btnType } from '@/components/OrderComponents/OrderItemCard'
import {
  getOrderMobileVendorValidatePage,
  getOrderMobileVendorValidateSubmitPage,
  getOrderMobileVendorValidateGradeOnePage,
  getOrderMobileVendorValidateGradeTwoPage,
  getOrderMobileVendorValidateConfirmPage,
  getOrderMobileVendorValidateSubscripts,
} from '@apps/apis'
import Router from '@/utils/router'

type badgeType = {
  innerStatus: number
  orderCount: number
}

const fnTabList = (badgesData: badgeType[]) => {
  // 订单审核状态
  const ORDER_EXAMINE_STATUS = {
    ALL: getIntl().formatMessage({ id: 'order.all', defaultMessage: '全部' }),
    TO_BE_SUBMITTED: getIntl().formatMessage({ id: 'order.toBeSubmitted', defaultMessage: '待提交审核' }),
    REVIEWED_LEVEL_1: getIntl().formatMessage({ id: 'order.reviewedLevel1', defaultMessage: '待审核(一级)' }),
    REVIEWED_LEVEL_2: getIntl().formatMessage({ id: 'order.reviewedLevel2', defaultMessage: '待审核(二级)' }),
    TO_BE_CONFIRMED: getIntl().formatMessage({ id: 'order.toBeConfirmed', defaultMessage: '待确认' }),
  }

  const badgesObj: any = {}
  badgesData.forEach((item) => {
    badgesObj[item.innerStatus] = item.orderCount
  })
  return [
    // 全部
    { title: ORDER_EXAMINE_STATUS.ALL },
    // 待提交审核
    {
      title: (
        <Badge value={badgesObj[ORDER_INNER_STATUS.TO_BE_SUBMITTED] || 0}>{ORDER_EXAMINE_STATUS.TO_BE_SUBMITTED}</Badge>
      ),
    },
    // 待审核(一级)
    {
      title: (
        <Badge value={badgesObj[ORDER_INNER_STATUS.REVIEWED_LEVEL_1] || 0}>
          {ORDER_EXAMINE_STATUS.REVIEWED_LEVEL_1}
        </Badge>
      ),
    },
    // 待审核(二级)
    {
      title: (
        <Badge value={badgesObj[ORDER_INNER_STATUS.REVIEWED_LEVEL_2] || 0}>
          {ORDER_EXAMINE_STATUS.REVIEWED_LEVEL_2}
        </Badge>
      ),
    },
    // 待确认
    {
      title: (
        <Badge value={badgesObj[ORDER_INNER_STATUS.TO_BE_CONFIRMED] || 0}>{ORDER_EXAMINE_STATUS.TO_BE_CONFIRMED}</Badge>
      ),
    },
  ]
}

const TAB_LIST = ['ALL', 'TO_BE_SUBMITTED', 'REVIEWED_LEVEL_1', 'REVIEWED_LEVEL_2', 'TO_BE_CONFIRMED']

const TAB_API = {
  ALL: getOrderMobileVendorValidatePage,
  TO_BE_SUBMITTED: getOrderMobileVendorValidateSubmitPage,
  REVIEWED_LEVEL_1: getOrderMobileVendorValidateGradeOnePage,
  REVIEWED_LEVEL_2: getOrderMobileVendorValidateGradeTwoPage,
  TO_BE_CONFIRMED: getOrderMobileVendorValidateConfirmPage,
}

const ScrollOrder = ({}, ref) => {
  const [tabActiveIndex, setTabActiveIndex] = useState<number>(0)
  const [badges, setBadges] = useState<badgeType[]>([])

  // 获取角标数据
  const getBadge = () => {
    getOrderMobileVendorValidateSubscripts().then(({ code, data }) => {
      if (code === 1000) {
        setBadges(data || [])
      }
    })
  }

  // tab 切换
  const onTab = (index: number) => {
    setTabActiveIndex(index)
  }

  const INNER_STATUS_LIST_BTN = {
    [ORDER_INNER_STATUS.TO_BE_SUBMITTED]: getIntl().formatMessage({
      id: 'order.submitForReview',
      defaultMessage: '提交审核',
    }),
    [ORDER_INNER_STATUS.REVIEWED_LEVEL_1]: getIntl().formatMessage({ id: 'order.review', defaultMessage: '审核' }),
    [ORDER_INNER_STATUS.REVIEWED_LEVEL_2]: getIntl().formatMessage({ id: 'order.review', defaultMessage: '审核' }),
    [ORDER_INNER_STATUS.TO_BE_CONFIRMED]: getIntl().formatMessage({ id: 'order.confirm', defaultMessage: '确认' }),
  }

  const renderItem = ({ item }: { item: any }) => {
    const btnConfig: btnType[] = [
      {
        name: INNER_STATUS_LIST_BTN[item.innerStatus],
        onClick: () => Router.redirectTo('root/orderExamine/orderExamineDetail', { orderId: item.orderId }),
      },
    ]
    return (
      <OrderItemCard
        itemData={item}
        btnConfig={btnConfig}
        showInnerStatus
        onClick={() => Router.redirectTo('root/orderExamine/orderExamineDetail', { orderId: item.orderId })}
      />
    )
  }

  useDidShow(() => {
    getBadge()
  })

  useEffect(() => {
    ref.current?.updateList()
  }, [tabActiveIndex])

  return (
    <>
      <Tabs scroll current={tabActiveIndex} tabList={fnTabList(badges)} onClick={onTab} />
      <ListScrollView
        ref={ref}
        requestApi={TAB_API[TAB_LIST[tabActiveIndex]]}
        renderItem={renderItem}
        initFetch={false}
      />
    </>
  )
}

export default forwardRef(ScrollOrder)
