import React, { useEffect } from 'react'
import { View, Text } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import useStores from '@/store/useStores'
import { postProductMobileShopEnterpriseGetCommodityList } from '@apps/apis'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import useFetchState from '@/hooks/useFetchState'
import { numFormat } from '@/utils/numberFormat'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import ImageBox from '@/components/ImageBox'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'

const hotIcon = getOssUrlPath('/miniprogram/assets/images/fire-fill@2x.png')
const top1Icon = getOssUrlPath('/miniprogram/assets/images/top1@2x.png')
const top2Icon = getOssUrlPath('/miniprogram/assets/images/top2@2x.png')
const top3Icon = getOssUrlPath('/miniprogram/assets/images/top3@2x.png')

type ParamsType = { commodityId: number } & { [key: string]: any }

const CommodityHotRank: React.FC<{}> = () => {
  const [commodityList, setCommodityList] = useFetchState<any[]>([])
  const intl = useIntl()
  const {
    locationStore: { currentCity },
  } = useStores()
  const { jmpProductDetail, jmpProductDetailGroup } = useProductDetailJump()
  const fetchCommodityList = () => {
    const param: any = {
      current: 1,
      pageSize: 9,
      orderType: 1, // 销量从高到低
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    }

    postProductMobileShopEnterpriseGetCommodityList(param).then((res) => {
      if (res.code === 1000) {
        setCommodityList(res.data.data)
      }
    })
  }

  useEffect(() => {
    fetchCommodityList()
  }, [])

  const showRank = (level: number) => {
    switch (level) {
      case 1:
        return <ImageBox className={styles['rankIcon']} width={64} height={20} source={top1Icon} />
      case 2:
        return <ImageBox className={styles['rankIcon']} width={64} height={20} source={top2Icon} />
      case 3:
        return <ImageBox className={styles['rankIcon']} width={64} height={20} source={top3Icon} />
      default:
        return (
          <View className={styles['rank']}>
            <Text className={styles['rankText']}>TOP</Text>
            <Text className={styles['rankText']}>{level}</Text>
          </View>
        )
    }
  }

  /**
   * @param commodityId 商品id
   * @param type 产品定价类型
   */
  const handleJmpProductDetail = (priceType: number, params: ParamsType, groupPurchase?: boolean) => {
    if (groupPurchase) {
      jmpProductDetailGroup(params)
    } else {
      jmpProductDetail(priceType, params)
    }
  }

  return commodityList && commodityList.length > 0 ? (
    <View className={styles['hotrank']}>
      <View className={styles['header']}>
        <Text className={styles['title']}>
          {intl.formatMessage({ id: 'search.remenpaihang', defaultMessage: '热门排行' })}
        </Text>
        <ImageBox width={pxTransform(16)} height={pxTransform(16)} source={hotIcon} />
      </View>
      <View className={styles['commodityList']}>
        {commodityList.map((commodityItem, index: number) => (
          <View
            className={styles['commodityItem']}
            key={commodityItem.id}
            onClick={() =>
              handleJmpProductDetail(
                commodityItem.priceType,
                { commodityId: commodityItem.id },
                commodityItem.groupPurchase,
              )
            }
          >
            {/* <View style="font-size:24rpx;color:#ffffff;border-radius:4rpx;background:#f81638;position:absolute;left:0;top:0;padding: 10rpx;z-index: 99;">团购商品</View> */}
            <ImageBox width={pxTransform(72)} height={pxTransform(72)} source={commodityItem.mainPic || ''} />
            <View className={styles['commodityInfo']}>
              {showRank(index + 1)}
              <View className={styles['commidtyName']}>
                <Text className={styles['commidtyNameText']}>{commodityItem.name}</Text>
              </View>
              <View className={styles['commidtyRecord']}>
                <Text className={styles['soldText']}>{numFormat(commodityItem.sold)}</Text>
                <Text className={styles['soldText']}>
                  {intl.formatMessage({ id: 'search.chengjiao', defaultMessage: '成交' })}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  ) : null
}

export default CommodityHotRank
