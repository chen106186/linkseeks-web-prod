import React, { useState } from 'react'
import { View } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { INNER_STATUS_AGREE_BTN, INNER_STATUS_DISAGREE_BTN } from '@/constants/const/order'
import styles from './index.module.scss'

export type PropsType = {
  source: any
}

const FooterWrap = ({ source }: PropsType) => {
  const { safeBottomHeight } = useSafeArea()

  return (
    <View className={styles['btn-wrap']} style={{ paddingBottom: pxTransform(safeBottomHeight || 6) }}>
      <View
        className={styles['disagree']}
        onClick={() =>
          Router.navigateTo('orderExamine/orderExamineConfirm', { type: 'DISAGREE', orderId: source.orderId })
        }
      >
        {INNER_STATUS_DISAGREE_BTN[source.innerStatus]}
      </View>
      <View
        className={styles['agree']}
        onClick={() =>
          Router.navigateTo('orderExamine/orderExamineConfirm', { type: 'AGREE', orderId: source.orderId })
        }
      >
        {INNER_STATUS_AGREE_BTN[source.innerStatus]}
      </View>
    </View>
  )
}

export default FooterWrap
