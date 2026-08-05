import React, { useEffect } from 'react'
import cx from 'classnames'
import { View, Text, Image } from '@apps/mobile-ui'
import useFetchState from '@/hooks/useFetchState'
import ImageBox from '@/components/ImageBox'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { CurrentCityType } from '@/store/locationStore/model'
import { getCommodityMobileStoreMobileMemberShopList } from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'

const hotIcon = getOssUrlPath('/miniprogram/assets/images/fire-fill@2x.png')
const creditIcon = getOssUrlPath('/miniprogram/assets/images/credit.png')
const creditBgIcon = getOssUrlPath('/miniprogram/assets/images/credit_bg.png')

interface ShopsHotRankProps {
  currentCity: CurrentCityType | undefined
}

const ShopsHotRank: React.FC<ShopsHotRankProps> = (props) => {
  const { currentCity } = props
  const [shopList, setShopList] = useFetchState<any[]>([])
  const intl = useIntl()
  const fetchShopList = () => {
    const param: any = {
      current: 1,
      pageSize: 9,
      orderType: 2,
      priceType: 1,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    }
    getCommodityMobileStoreMobileMemberShopList(param).then((res) => {
      if (res.code === 1000) {
        setShopList(res.data.data)
      }
    })
  }

  useEffect(() => {
    fetchShopList()
  }, [])

  const showRank = (level: number) => {
    switch (level) {
      case 1:
        return (
          <View className={cx(styles['rankBox'], styles['level1'])}>
            <Text className={cx(styles['rankText'], styles['topText'])}>TOP1</Text>
          </View>
        )
      case 2:
        return (
          <View className={cx(styles['rankBox'], styles['level2'])}>
            <Text className={cx(styles['rankText'], styles['topText'])}>TOP2</Text>
          </View>
        )
      case 3:
        return (
          <View className={cx(styles['rankBox'], styles['level3'])}>
            <Text className={cx(styles['rankText'], styles['topText'])}>TOP3</Text>
          </View>
        )
      default:
        return (
          <View className={styles['rankBox']}>
            <Text className={styles['rankText']}>TOP</Text>
            <Text className={styles['rankText']}>{level}</Text>
          </View>
        )
    }
  }

  return shopList && shopList.length > 0 ? (
    <View className={styles['shophotrank']}>
      <View className={styles['header']}>
        <Text className={styles['title']}>
          {intl.formatMessage({ id: 'search.dianpupaihang', defaultMessage: '店铺排行' })}
        </Text>
        <ImageBox width={16} height={16} source={hotIcon} />
      </View>
      <View className={styles['shopList']}>
        {shopList.map(
          (shopItem, shopIndex: number) =>
            shopItem.status !== 0 && (
              <View
                className={styles['shopItem']}
                key={`shopItem${shopItem.id}`}
                onClick={() => Router.navigateTo('shop/home', { id: shopItem.id })}
              >
                <ImageBox className={styles['logoBox']} width={48} height={48} source={shopItem.logo} />
                <View className={styles['shopInfo']}>
                  <View className={styles['shopInfoWrap']}>
                    <Text className={styles['shopName']}>{shopItem.name || shopItem.memberName}</Text>
                    {showRank(shopIndex + 1)}
                  </View>
                  <View className={styles['shopDetail']}>
                    <View className={styles['shopDetailInfo']}>
                      <ImageBox width={16} height={16} source={creditIcon} className={styles['shopIcon']} />
                      <Image src={creditBgIcon} mode="aspectFit" className={styles['creditBgIcon']}>
                        <Text className={cx(styles['tagText'], styles['creditPoint'])}>
                          {shopItem.creditPoint || 0}
                        </Text>
                      </Image>
                    </View>
                    <View className={cx(styles['shopDetailInfo'], styles['yearDetail'])}>
                      <Text className={cx(styles['tagText'], styles['yearText'])}>
                        {intl.formatMessage({ id: 'search.ruzhu', defaultMessage: '入驻' })}
                        {shopItem.registerYears || 0}
                        {intl.formatMessage({ id: 'search.nian', defaultMessage: '年' })}
                      </Text>
                    </View>
                  </View>
                </View>
                {shopItem.productList &&
                  shopItem.productList.map(
                    (productItem: any, productIndex: number) =>
                      productIndex < 1 && (
                        <View className={styles['recommend']} key={`productItem${productItem.id}`}>
                          <View className={styles['imageBox']}>
                            <Image src={productItem.mainPic || ''} style={{ width: '100%', height: '100%' }} />
                          </View>
                          <View className={styles['tag']}>
                            <Text className={styles['price']}>
                              {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                            </Text>
                            <Text className={styles['price']}>{productItem.min}</Text>
                          </View>
                        </View>
                      ),
                  )}
              </View>
            ),
        )}
      </View>
    </View>
  ) : null
}

export default ShopsHotRank
