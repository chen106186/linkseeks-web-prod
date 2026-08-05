import React, { useState, useEffect, useRef } from 'react'
import { pxTransform, setClipboardData } from '@apps/mobile-services/utils/taro'
import { View, Text, Image, Toast } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { ScrollView } from '@tarojs/components'
import Router from '@/utils/router'
import { THEME_COLORS } from '@/constants/theme'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

interface Iprops {
  dataSource?: any[]
  sendInfo?: any
  setSendInfo?: Function
  isLogistics?: boolean
}
const Receiving = (props: Iprops) => {
  const { dataSource = [], sendInfo, setSendInfo, isLogistics } = props
  const [win, setwin] = useState(0)
  const [Index, setCurrentIndex] = useState<number>(0)
  const intl = useIntl()
  useEffect(() => {
    const width = dataSource.length === 1 ? 358 : 322
    setwin(width)
  }, [])
  useEffect(() => {
    setSendInfo?.({
      ...sendInfo,
      outerStatusName: dataSource[Index]?.innerStatusName,
      batchNo: dataSource[Index]?.batchNo,
      showReceive: dataSource[Index]?.showReceive,
    })
  }, [Index])

  const clipboard = (dataText: any) => {
    setClipboardData({
      data: dataText,
      success: () => {
        Toast.show({
          title: intl.formatMessage({ id: 'inquiry.fuzhichenggong', defaultMessage: '内容复制成功' }),
          icon: 'none',
        })
      },
    })
  }

  const handleHeaderCardClick = (index: number) => {
    setCurrentIndex(index)
    if (!isLogistics) {
      Router.navigateTo('order/logisticsDetail')
    }
  }

  return (
    <View className={styles.container}>
      <View
        className={styles.tab}
        style={
          isLogistics
            ? {
                marginTop: pxTransform(0),
                backgroundColor: THEME_COLORS.primary,
                padding: `${pxTransform(16)} ${pxTransform(0)}`,
                display: 'flex',
                flexDirection: 'column',
              }
            : {}
        }
      >
        <ScrollView scrollX className={styles['tab-nav-wrap']}>
          <View className={styles['tab-nav-flex']}>
            {dataSource?.map((item: any, index: number) => (
              <View
                key={`${item.logisticsNo}_${index}`}
                className={`${styles['header-card']} ${dataSource.length > 1 && styles['header-card-more']} ${
                  Index === index && styles['header-card-border']
                }`}
                onClick={() => handleHeaderCardClick(index)}
              >
                <View className={styles.box}>
                  {item.logisticsNo ? (
                    <View className={styles.left}>
                      {/*  onClick={() => Router.navigateToKuaiDi100(item.logisticsNo)} */}
                      <Text className={styles.num}>{item.logisticsNo}</Text>
                      <Text
                        className={styles.tag}
                        onClick={(event) => {
                          event.stopPropagation()
                          clipboard(item.logisticsNo)
                        }}
                      >
                        {intl.formatMessage({ id: 'order.fuzhi', defaultMessage: '复制' })}
                      </Text>
                    </View>
                  ) : (
                    <View />
                  )}
                  <Text className={styles.status}>
                    {!item.showReceive
                      ? intl.formatMessage({ id: 'order.yiquerenshouhuo', defaultMessage: '已确认收货' })
                      : intl.formatMessage({ id: 'order.daiquerenshouhuo', defaultMessage: '待确认收货' })}
                  </Text>
                </View>
                {!!item.company && (
                  <View className={styles.box} onClick={() => Router.navigateToKuaiDi100(item.logisticsNo)}>
                    <View className={styles.left}>
                      <Text className={styles.express}>{item.company}</Text>
                    </View>
                    <Image
                      src={getOssUrlPath(`/Images/arrow-ios-right.svg`)}
                      style={{ width: pxTransform(15), height: pxTransform(15) }}
                    />
                  </View>
                )}
                <View className={styles.box}>
                  <View className={styles.left}>
                    <Text className={styles.num}>
                      {intl.formatMessage({ id: 'order.fahuoshijian', defaultMessage: '发货时间：' })}
                      {(item.deliveryTime || item.deliverTime)?.split(' ')[0]}
                    </Text>
                  </View>
                </View>
                {!!item.receiptTime && (
                  <View className={styles.box}>
                    <View className={styles.left}>
                      <Text className={styles.num}>
                        {intl.formatMessage({ id: 'order.shouhuoshijian', defaultMessage: '收货时间：' })}
                        {item.receiptTime}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
            {dataSource.length > 1 && <View style={{ minWidth: pxTransform(1) }}></View>}
          </View>
        </ScrollView>
        {isLogistics && (
          <Text style={{ marginTop: pxTransform(16), fontSize: pxTransform(12), color: '#fff', textAlign: 'center' }}>
            {intl.formatMessage({ id: 'order.cidingdanbaohan', defaultMessage: '此订单包含' })}
            {dataSource.length} {intl.formatMessage({ id: 'order.gewuliudan', defaultMessage: '个物流单' })}
          </Text>
        )}
      </View>
      {dataSource.length > 0 && dataSource[Index]?.selfCode ? (
        <View className={styles['mention']}>
          <View className={styles['mentionCell']}>
            {intl.formatMessage({ id: 'order.zitima', defaultMessage: '自提码' })}
          </View>
          <View className={`${styles['mentionCell']} ${styles['code']}`}>{dataSource[Index]?.selfCode}</View>
          <View className={`${styles['mentionCell']} ${styles['tip']}`}>
            {intl.formatMessage({ id: 'order.bufenshangpinweiziti', defaultMessage: '(部分商品为自提)' })}
          </View>
        </View>
      ) : null}

      {/* 列表 */}
      <View className={styles['item-card']}>
        {dataSource[Index]?.products?.map((item: any) => (
          <View className={styles['cell']} key={`${item.deliveryProductId}`}>
            <View className={styles['cellbox']}>
              <Image
                src={String(item.logo)}
                style={{
                  borderRadius: pxTransform(4),
                  marginRight: pxTransform(10),
                  width: pxTransform(48),
                  height: pxTransform(48),
                }}
              />
              <View className={styles.right}>
                <Text className={styles['cell-title']}>{item.name}</Text>
                <View className={styles['cell-flex']}>
                  <Text className={styles.symbol} style={{ color: '#91959B' }}>
                    {item.spec}
                  </Text>
                </View>
              </View>
            </View>
            <View className={styles.cellfoot}>
              <View className={styles['cellfoot-box']}>
                <View>
                  <Text className={styles['left-text']}>
                    {intl.formatMessage({ id: 'order.fahuoshuliang', defaultMessage: '发货数量' })}({item.unit}
                    )：
                  </Text>
                  <Text className={styles['right-text']}>{item.delivered}</Text>
                </View>
                <View>
                  <Text className={styles['left-text']}>
                    {intl.formatMessage({ id: 'order.shouhuoshuliang', defaultMessage: '收货数量' })}({item.unit}
                    )：
                  </Text>
                  <Text className={styles['right-text']}>{item.received}</Text>
                </View>
              </View>
              <View className={styles.speed}>
                <View
                  style={{
                    width: `${(item.received / item.delivered) * 100}%`,
                    height: pxTransform(4),
                    backgroundColor: THEME_COLORS.primary,
                    borderRadius: pxTransform(10),
                    position: 'relative',
                  }}
                >
                  <Image
                    src={getOssUrlPath(`/Images/receiving.svg`)}
                    style={{
                      width: pxTransform(16),
                      height: pxTransform(16),
                      position: 'absolute',
                      right: pxTransform(-5),
                      top: pxTransform(-9),
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
export default Receiving
