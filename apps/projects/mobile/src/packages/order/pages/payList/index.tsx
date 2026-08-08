import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import { pxTransform, getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { getOrderMobileBuyerDetail } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const PayList = () => {
  const { orderId }: any = getCurrentInstance()?.router?.params
  const [list, setpayments] = useState<any>([]) // 数据集合
  const intl = useIntl()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({id: 'order.zhakanzhifuxinxi', defaultMessage: '查看支付信息'}) })
    getOrderMobileBuyerDetail({
      orderId,
    }).then((res: { data: any }) => {
      setpayments(res.data.payments)
    })
  }, [])
  const renderItem = (item: any) => (
    <View className={styles.card}>
      <View className={styles['card-title']}>
        <View className={styles.box}>
          <Text className={styles.name}>{item.payNode}</Text>
          <Text className={styles.tag}>{`${intl.formatMessage({
            id: 'order.di',
            defaultMessage: '第',
          })}${item.tag}${intl.formatMessage({
            id: 'order.ci',
            defaultMessage: '次',
          })}`}</Text>
        </View>
        <Text className={styles['status-name']}>{item['inner-status-name']}</Text>
      </View>
      <View className={styles['item']}>
        <Text className={styles['price-left']}>
          {intl.formatMessage({
            id: 'order.zhifujine',
            defaultMessage: '支付金额：',
          })}
        </Text>
        <Text className={styles['Price']}>{`${intl.formatMessage({
          id: 'currency',
          defaultMessage: '支付金额：',
        })}${item.payAmount}`}</Text>
      </View>
      <View className={styles['warp']}>
        <Text className={styles['price-left']}>
          {intl.formatMessage({
            id: 'order.zhifubili',
            defaultMessage: '支付比例：',
          })}
        </Text>
        <Text className={styles['price-left']}>{`${item.payRate}%`}</Text>
      </View>
      <View className={styles['warp']}>
        <Text className={styles['price-left']}>
          {intl.formatMessage({
            id: 'order.zhifufangshi',
            defaultMessage: '支付方式：',
          })}
        </Text>
        <Text className={styles['price-left']}>{item.payChannelName}</Text>
      </View>
      <View className={styles['warp']}>
        <Text className={styles['price-left']}>
          {intl.formatMessage({
            id: 'order.zhifushijian',
            defaultMessage: '支付时间：',
          })}
        </Text>
        <Text className={styles['price-left']}>{item.payTime}</Text>
      </View>
      {item.payChannel === 5 && (
        <View className={styles['warp']}>
          <Text className={styles['price-left']}>
            {intl.formatMessage({
              id: 'order.zhifupingzheng',
              defaultMessage: '支付凭证：',
            })}
          </Text>
          <View className={styles.flex}>
            {item.vouchers.map((item: any, index: number) => (
              <Image
                key={`${item}_${index}`}
                style={{
                  width: pxTransform(86),
                  height: pxTransform(40),
                  marginRight: pxTransform(10),
                }}
                src={String(item)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  )
  return (
    <View className={styles['list']}>
      <ScrollView scrollY className={styles['list-scroll']}>
        {list.map((item) => {
          return renderItem(item)
        })}
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(PayList)
