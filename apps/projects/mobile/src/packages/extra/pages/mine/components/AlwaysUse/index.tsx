import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Text, View, Icons, Image } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { RouterKeys } from '@/routes'
import styles from './index.module.scss'
import useStores from '@/store/useStores'
import {
  getMemberMobileCommentWaitPage,
  getOrderMobileBuyerValidatePayPage,
  getOrderMobileBuyerValidateReceivePage,
} from '@apps/apis'
import { useDidShow } from '@apps/mobile-services/utils/taro'
import { requestSubscribeMessage } from '@tarojs/taro'
import { IS_WEB } from '@/constants'

const evaluate = getOssUrlPath('/Images/evaluate1.svg')
const goods = getOssUrlPath('/Images/goods.svg')
const payment = getOssUrlPath('/Images/payment.svg')
const exchange = getOssUrlPath('/Images/exchange.svg')

interface BacklogCountType {
  /** 待支付 */
  waitPay: number
  /** 待收货 */
  waiReceipt: number
  /** 待评价 */
  waitEvaluate: number
  /** 售后 */
  waitAfeter: number
}

const AlwaysUse: React.FC = () => {
  const intl = useIntl()
  const {
    userStore: { userInfo },
  } = useStores()
  // 待办数量
  const [backlogCount, setBacklogCount] = useState<BacklogCountType>({
    waitPay: 0,
    waiReceipt: 0,
    waitEvaluate: 0,
    waitAfeter: 0,
  })

  useDidShow(() => {
    // 获取待办数量
    const getBacklogCount = async () => {
      const param: any = {
        current: '1',
        pageSize: '8',
      }
      const waitPayRes = await getOrderMobileBuyerValidatePayPage(param)
      const waitReceiptRes = await getOrderMobileBuyerValidateReceivePage(param)
      const waitEvaluate = await getMemberMobileCommentWaitPage(param)
      // const waitAfeter = await getAftersalesCommonGetAfterSaleTallyNew(param);

      setBacklogCount({
        waitPay: waitPayRes?.data?.totalCount || 0,
        waiReceipt: waitReceiptRes?.data?.totalCount || 0,
        waitEvaluate: waitEvaluate?.data?.totalCount || 0,
        waitAfeter: 0,
      })
    }
    if (userInfo) {
      getBacklogCount()
    }
  })

  const data = useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'mine.daifukuan', defaultMessage: '待付款' }),
        url: 'order/mycommodityList',
        Index: 1,
        icon: payment,
        count: backlogCount.waitPay || 0,
      },
      {
        title: intl.formatMessage({ id: 'mine.daishouhuo', defaultMessage: '待收货' }),
        url: 'order/mycommodityList',
        Index: 3,
        icon: goods,
        count: backlogCount.waiReceipt || 0,
      },
      {
        title: intl.formatMessage({ id: 'mine.yiwancheng', defaultMessage: '已完成' }),
        url: 'order/mycommodityList',
        Index: 4,
        icon: evaluate,
        count: backlogCount.waitEvaluate || 0,
      },
      {
        title: intl.formatMessage({ id: 'mine.tuihuanshouhou', defaultMessage: '退换/售后' }),
        url: 'afterService/afterRecords/refundRecords',
        icon: exchange,
        count: backlogCount.waitAfeter || 0,
      },
    ]
  }, [backlogCount, intl])

  const isNavigatingCard = useRef(false)

  const handleCardClick = async (item: (typeof data)[0]) => {
    if (isNavigatingCard.current) return
    isNavigatingCard.current = true

    // if (!IS_WEB) {
    //   if (item.url === 'afterService/afterRecords/refundRecords') {
    //     // 小程序授权订阅消息-售后状态通知
    //     await requestSubscribeMessage({
    //       tmplIds: ['UKQ2Aw81Af_CyNE9HpT8apmFcR-b6IYEjzYTH8f13xo'],
    //       entityIds: [],
    //     }).catch(() => {})
    //   }
    // }

    Router.navigateTo(item.url as RouterKeys, { Index: item.Index })

    setTimeout(() => {
      isNavigatingCard.current = false
    }, 500)
  }

  return (
    <View className={styles['use-card']}>
      <View className={styles['use-card-header']}>
        <Text className={styles['use-card-title']}>
          {intl.formatMessage({ id: 'mine.wodedingdan', defaultMessage: '我的订单' })}
        </Text>
        <View className={styles['use-card-allWarp']}>
          <View onClick={() => Router.navigateTo('order/mycommodityList', { Index: 0 })}>
            <View className={styles['use-card-allWarp']}>
              <Text className={styles['use-card-allText']}>
                {intl.formatMessage({ id: 'mine.quanbu', defaultMessage: '全部' })}
              </Text>
              <Icons name="ChevronRight" size={12} />
            </View>
          </View>
        </View>
      </View>
      <View className={styles['use-card-content']}>
        {data.map((item) => (
          <View
            className={styles['use-card-item']}
            key={item.title}
            onClick={() => handleCardClick(item)}
            // onClick={() => Router.navigateTo(item.url as RouterKeys, { Index: item.Index })}
          >
            <Image src={item.icon} className={styles['use-card-svg']} />
            <Text className={styles['use-card-text']}>{item.title}</Text>
            {item.count > 0 && (
              <View className={styles['use-card-item-badge-count']}>
                <Text>{item.count}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  )
}
export default AlwaysUse
