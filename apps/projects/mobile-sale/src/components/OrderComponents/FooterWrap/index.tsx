import React, { useState } from 'react'
import { View } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { useSafeArea } from '@apps/mobile-services'
import Router from '@/utils/router'
import { ORDER_INNER_STATUS } from '@/constants/const/order'
import styles from './index.module.scss'
import { getIntl } from '@linkseeks/i18n'

export type PropsType = {
  source: any
}

const FooterWrap = ({ source }: PropsType) => {
  const { safeBottomHeight } = useSafeArea()

  const INNER_STATUS_AGREE_BTN = {
    [ORDER_INNER_STATUS.TO_BE_SUBMITTED]: getIntl().formatMessage({ id: 'order.approved', defaultMessage: '审核通过' }),
    [ORDER_INNER_STATUS.REVIEWED_LEVEL_1]: getIntl().formatMessage({
      id: 'order.approved',
      defaultMessage: '审核通过',
    }),
    [ORDER_INNER_STATUS.REVIEWED_LEVEL_2]: getIntl().formatMessage({
      id: 'order.approved',
      defaultMessage: '审核通过',
    }),
    [ORDER_INNER_STATUS.TO_BE_CONFIRMED]: getIntl().formatMessage({
      id: 'order.confirmationPassed',
      defaultMessage: '确认通过',
    }),
  }

  const INNER_STATUS_DISAGREE_BTN = {
    [ORDER_INNER_STATUS.TO_BE_SUBMITTED]: getIntl().formatMessage({
      id: 'order.notApproved',
      defaultMessage: '审核不通过',
    }),
    [ORDER_INNER_STATUS.REVIEWED_LEVEL_1]: getIntl().formatMessage({
      id: 'order.notApproved',
      defaultMessage: '审核不通过',
    }),
    [ORDER_INNER_STATUS.REVIEWED_LEVEL_2]: getIntl().formatMessage({
      id: 'order.notApproved',
      defaultMessage: '审核不通过',
    }),
    [ORDER_INNER_STATUS.TO_BE_CONFIRMED]: getIntl().formatMessage({
      id: 'order.confirmationFailed',
      defaultMessage: '确认不通过',
    }),
  }

  return (
    <View className={styles['btn-wrap']} style={{ paddingBottom: pxTransform(safeBottomHeight || 6) }}>
      <View
        className={styles['disagree']}
        onClick={() =>
          Router.redirectTo('root/orderExamine/orderExamineConfirm', { type: 'DISAGREE', orderId: source.orderId })
        }
      >
        {INNER_STATUS_DISAGREE_BTN[source.innerStatus]}
      </View>
      <View
        className={styles['agree']}
        onClick={() =>
          Router.redirectTo('root/orderExamine/orderExamineConfirm', { type: 'AGREE', orderId: source.orderId })
        }
      >
        {INNER_STATUS_AGREE_BTN[source.innerStatus]}
      </View>
    </View>
  )
}

export default FooterWrap
