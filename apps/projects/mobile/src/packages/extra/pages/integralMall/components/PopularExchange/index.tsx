import React, { useEffect, useState } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { THEME_COLORS } from '@/constants/theme'
import { View, Text, Image } from '@apps/mobile-ui'
import useStores from '@/store/useStores'
import Skeleton from '@/components/Skeleton'
import ImageBox from '@/components/ImageBox'
import { useIntl } from '@linkseeks/i18n'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import { postProductMobileShopScoreGetCommodityList } from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'

const hotExchangeIcon = getOssUrlPath('/miniprogram/assets/images/hot_exchange_icon.png')

interface PopularExchangePropsType {
  refreshing: boolean
}

const PopularExchange = (props: PopularExchangePropsType) => {
  const { refreshing } = props
  const intl = useIntl()
  const [dataList, setDataList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const {
    userStore: { shopAndSite },
    locationStore: { currentCity },
  } = useStores()
  const { jmpProductDetail } = useProductDetailJump()

  const fetchDataList = () => {
    const param: any = {
      current: 1,
      pageSize: 6,
      orderType: 1,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
      priceTypeList: [3],
    }

    const headers: any = {
      type: 2,
      shopId: shopAndSite?.id,
    }

    postProductMobileShopScoreGetCommodityList(param, { headers })
      .then((res) => {
        if (res.code === 1000) {
          const { data } = res.data
          setDataList(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (shopAndSite) {
      fetchDataList()
    }
  }, [shopAndSite, shopAndSite])

  useEffect(() => {
    if (refreshing) {
      fetchDataList()
    }
  }, [refreshing])

  return !loading ? (
    dataList && dataList.length > 0 ? (
      <View className={styles['popularExchange']}>
        <View className={styles['popularExchange-exchange_title']}>
          <Image className={styles['popularExchange-exchange_icon']} src={hotExchangeIcon} />
          <Text className={styles['popularExchange-exchange_title_text']}>
            {intl.formatMessage({ id: 'integral.remenduihuan', defaultMessage: '热门兑换' })}
          </Text>
        </View>
        {dataList.map((item) => {
          let soleRate: number = 0
          let stockCount: number = item.stockCount === 0 ? item.sold : item.stockCount
          if (item.sold && stockCount) {
            soleRate = (item.sold / stockCount) * 100
          }

          return (
            <View
              className={styles['popularExchange-scrollItem']}
              key={`scrollItem${item.id}`}
              onClick={() => jmpProductDetail(PRICE_TYPE_ENUM.INTEGRAL, { commodityId: item.id })}
            >
              <ImageBox
                height={104}
                width={104}
                source={item.mainPic}
                style={{ border: `${pxTransform(1)} solid ${THEME_COLORS.borderLight}`, borderRadius: pxTransform(4) }}
              />
              <View className={styles['popularExchange-commodityInfo']}>
                <Text className={styles['popularExchange-name']}>{item.name}</Text>
                <View className={styles['popularExchange-soldInfo']}>
                  <View className={styles['popularExchange-soldRateBox']}>
                    <View className={styles['popularExchange-soldRate']} style={{ width: `${soleRate}%` }} />
                  </View>
                  <View className={styles['popularExchange-soldCountBox']}>
                    <Text className={styles['popularExchange-soldCount']}>
                      {intl.formatMessage({ id: 'integral.yiduihuan', defaultMessage: '已兑换' })}
                      {item.sold}
                    </Text>
                    <Text className={styles['popularExchange-soldCount']} style={{ marginLeft: 'auto' }}>
                      {intl.formatMessage({ id: 'integral.haisheng', defaultMessage: '还剩' })}
                      {item.stockCount}
                    </Text>
                  </View>
                </View>
                <View className={styles['popularExchange-scrollItemLine']}>
                  <View className={styles['popularExchange-commodityPriceWrap']}>
                    <Text className={styles['popularExchange-commodityPrice']}>{item.min}</Text>
                    <Text className={styles['popularExchange-commodityPrice']}>
                      {intl.formatMessage({ id: 'integral.jifen1', defaultMessage: '积分' })}
                    </Text>
                  </View>
                  <View className={styles['popularExchange-saleCountWrap']}>
                    <View className={styles['popularExchange-exchangeBtn']}>
                      <Text className={styles['popularExchange-exchangeBtnText']}>
                        {intl.formatMessage({ id: 'integral.lijiduihuan', defaultMessage: '立即兑换' })}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )
        })}
      </View>
    ) : null
  ) : (
    <View className={styles['popularExchange']}>
      <View className={styles['popularExchange-exchange_title']}>
        <Image className={styles['popularExchange-exchange_icon']} src={hotExchangeIcon} />
        <Text className={styles['popularExchange-exchange_title_text']}>
          {intl.formatMessage({ id: 'integral.remenduihuan', defaultMessage: '热门兑换' })}
        </Text>
      </View>
      <Skeleton.Vertical style={{ padding: `0 ${pxTransform(8)}` }}>
        <Skeleton
          style={{ backgroundColor: THEME_COLORS.surface, height: pxTransform(128), padding: `${pxTransform(12)} ${pxTransform(0)}` }}
        >
          <Skeleton.Avatar width="{104}" height={104} style={{ margin: `${pxTransform(0)} ${pxTransform(12)}` }} />
          <Skeleton.Vertical style={{ flex: 1, paddingRight: pxTransform(12) }}>
            <Skeleton height={16} style={{ marginBottom: pxTransform(12) }} />
            <Skeleton height={16} style={{ width: pxTransform(100) }} />
            <Skeleton height={16} style={{ marginTop: 'auto' }} />
          </Skeleton.Vertical>
        </Skeleton>
        <Skeleton
          style={{ backgroundColor: THEME_COLORS.surface, height: pxTransform(128), padding: `${pxTransform(12)} ${pxTransform(0)}` }}
        >
          <Skeleton.Avatar width={104} height={104} style={{ margin: `${pxTransform(0)} ${pxTransform(12)}` }} />
          <Skeleton.Vertical style={{ flex: 1, paddingRight: pxTransform(12) }}>
            <Skeleton height={16} style={{ marginBottom: pxTransform(12) }} />
            <Skeleton height={16} style={{ width: pxTransform(100) }} />
            <Skeleton height={16} style={{ marginTop: 'auto' }} />
          </Skeleton.Vertical>
        </Skeleton>
        <Skeleton
          style={{ backgroundColor: THEME_COLORS.surface, height: pxTransform(128), padding: `${pxTransform(12)} ${pxTransform(0)}` }}
        >
          <Skeleton.Avatar width={104} height={104} style={{ margin: `${pxTransform(0)} ${pxTransform(12)}` }} />
          <Skeleton.Vertical style={{ flex: 1, paddingRight: pxTransform(12) }}>
            <Skeleton height={16} style={{ marginBottom: pxTransform(12) }} />
            <Skeleton height={16} style={{ width: pxTransform(100) }} />
            <Skeleton height={16} style={{ marginTop: 'auto' }} />
          </Skeleton.Vertical>
        </Skeleton>
      </Skeleton.Vertical>
    </View>
  )
}
export default PopularExchange
