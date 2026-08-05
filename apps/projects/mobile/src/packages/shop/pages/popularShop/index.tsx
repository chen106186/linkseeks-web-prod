import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import Router from '@/utils/router'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { observer } from 'mobx-react-lite'
import { View, Text, Image, ScrollView } from '@apps/mobile-ui'
import ImageBox from '@/components/ImageBox'
import ShopCreditInfo from '@/components/ShopCreditInfo'
import TopTitle from '@/components/TopTitle'
import { priceFormat } from '@/utils/numberFormat'
import { getCommodityMobileStoreMobilePopularStore } from '@apps/apis'
import { getManageContentAdvertFindAllByColumnType } from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import { useIntl } from '@linkseeks/i18n'
import { THEME_COLORS } from '@/constants/theme'
import useStores from '@/store/useStores'
import styles from './index.module.scss'
const Top1Icon = getOssUrlPath('/miniprogram/assets/images/TOP1.png')
const Top2Icon = getOssUrlPath('/miniprogram/assets/images/TOP2.png')
const Top3Icon = getOssUrlPath('/miniprogram/assets/images/TOP3.png')
const Top4Icon = getOssUrlPath('/miniprogram/assets/images/TOP4.png')
const PopularStoreDefault = getOssUrlPath('/miniprogram/assets/images/PopularStore.png')
type GetManageContentAdvertFindAllByColumnTypeResponse = {
  /**
   * 主键id
   */
  id: number
  /**
   * 标题
   */
  title: string
  /**
   * 投放渠道 1-WEB 2-APP
   */
  channel: number
  /**
   * 栏目：
   * WEB：1-会员首页一号活动广告、2-会员首页二号活动广告、3-会员首页三号活动广告
   * APP：4-找店铺广告、5-人气店铺广告、6-商品询价广告
   */
  columnType: number
  /**
   * 广告排序
   */
  sort: number
  /**
   * 跳转链接
   */
  link: string
  /**
   * 广告图片
   */
  imageUrl: string
  /**
   * 状态 1-待上架 2-已上架 3-已下架
   */
  status: number
  /**
   * 创建时间
   */
  createTime: number
}
const TOP_ICON = {
  1: Top1Icon,
  2: Top2Icon,
  3: Top3Icon,
  4: Top4Icon,
}
const PopularShop: React.FC = () => {
  const [advertInfo, setAdvertInfo] = useState<GetManageContentAdvertFindAllByColumnTypeResponse>()
  const [dataList, setDataList] = useState<any[]>([])
  const [advertOpacity, setAdvertOpacity] = useState<string>('1')
  const [topOpacity, setTopOpacity] = useState<string>('0')
  const intl = useIntl()
  const {
    locationStore: { currentCity },
  } = useStores()

  /**
   * 获取广告图片
   */
  const getAdvertInfo = () => {
    getManageContentAdvertFindAllByColumnType({
      columnType: '52',
    }).then((res) => {
      if (res.code === 1000) {
        setAdvertInfo(res.data[0])
      }
    })
  }

  /**
   * 获取人气店铺数据
   */
  const fetchDataList = () => {
    const params = {
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    }
    getCommodityMobileStoreMobilePopularStore(params).then((res: any) => {
      if (res.code === 1000) {
        setDataList(res.data)
      }
    })
  }
  useEffect(() => {
    getAdvertInfo()
    fetchDataList()
  }, [])

  // 店铺区域
  const showArea = (value: string) => {
    if (value) {
      const areaList = value.split(',')
      if (areaList && areaList.length > 1) {
        const result: string[] = []
        areaList.forEach((item) => {
          const city = item.split('/')[1]
          if (city !== '所有') {
            result.push(city)
          }
        })
        return result.join(',')
      }
      const text = value.split('/')[1]
      if (text === '所有') {
        return value.split('/')[0]
      }
      return text
    }
    return ''
  }

  // 排名
  const renderShopRank = (rank: number) => {
    switch (rank) {
      case 1:
      case 2:
      case 3:
      case 4:
        return (
          <Image
            style={{
              width: pxTransform(40),
              height: pxTransform(40),
            }}
            src={TOP_ICON[rank]}
          />
        )
      default:
        return (
          <View className={styles['rank-text-wrap']}>
            <Text
              style={{
                fontSize: pxTransform(14),
              }}
            >
              {rank}
            </Text>
          </View>
        )
    }
  }
  const renderPriceByType = (productItem) => {
    switch (productItem.priceType) {
      case 2:
        return (
          <View className={styles['product-list-item-extra-left']}>
            <View className={styles['ask-commodity-price']}>
              <Text className={styles['ask-commodity-price-text']}>
                {intl.formatMessage({
                  id: 'shopItem_price_inquiry',
                  defaultMessage: '在线询价',
                })}
              </Text>
            </View>
          </View>
        )
      default:
        return (
          <View className={styles['goods-priceWrap']}>
            <Text className={styles['goods-priceUnit']}>
              {intl.formatMessage({
                id: 'currency',
              })}
            </Text>
            <Text className={styles['goods-price']}>{priceFormat(productItem.min)}</Text>
          </View>
        )
    }
  }

  //
  const renderListByType = ({ item, index }: { item: any; index: number }) => (
    <View
      key={item.id + index}
      className={styles['scroll-item']}
      onClick={() =>
        Router.navigateTo('shop/home', {
          id: item.id,
        })
      }
    >
      <View className={styles['shop-header']}>
        <View className={styles['shop-logo']}>{renderShopRank(index + 1)}</View>
        <View className={styles['shop-info']}>
          <View className={styles['shop-name-wrapper']}>
            <Text className={styles['store-name']}>{item.name || item.memberName}</Text>
          </View>
          <ShopCreditInfo hideYear creditPoint={item.creditPoint || 0} registerYears={item.registerYears} />
        </View>
        <View className={styles['areas-text-wrap']}>
          <Text className={styles['areas-text']}>{showArea(item.areas)}</Text>
        </View>
      </View>
      {item.productList && item.productList.length > 0 && (
        <View className={styles['goods-list']}>
          {item.productList.map(
            (productItem: any, productItemIndex: number) =>
              productItemIndex < 3 && (
                <View className={styles['goods-item']} key={productItem.id}>
                  <ImageBox
                    className={styles['goods-item-image']}
                    width="100%"
                    height="100%"
                    source={productItem.mainPic || ''}
                  />
                  <Text className={styles['goods-name']}>{productItem.name}</Text>
                  {renderPriceByType(productItem)}
                </View>
              ),
          )}
        </View>
      )}
    </View>
  )

  // 监听滚动
  const onScroll = (e) => {
    const { scrollTop } = e.detail
    if (scrollTop < 100) {
      setAdvertOpacity(((100 - scrollTop) / 100).toFixed(2))
      if (scrollTop < 50) {
        setTopOpacity('0')
      } else {
        setTopOpacity('0.5')
      }
    } else {
      setAdvertOpacity('0')
      setTopOpacity('1')
    }
  }

  // 滚到底部
  const onScrollToLower = (e) => {
    const { direction } = e.detail
    if (direction === 'bottom') {
      setAdvertOpacity('0')
      setTopOpacity('1')
    }
  }

  // 导航栏临界点计算
  const calcCritical = () => {
    return topOpacity === '0'
  }
  return (
    <View className={styles['show-case']}>
      <TopTitle
        title={
          calcCritical()
            ? ''
            : intl.formatMessage({
                id: 'popular_shop_title',
              })
        }
        bgColor={calcCritical() ? 'rgba(0, 0, 0, 0)' : THEME_COLORS.surface}
        fontColor={THEME_COLORS.title}
        iconColor={calcCritical() ? THEME_COLORS.surface : THEME_COLORS.title}
        style={{
          paddingBottom: 0,
          opacity: calcCritical() ? '1' : topOpacity,
        }}
      />
      <ScrollView
        scrollY
        refresherEnabled
        lowerThreshold={1}
        onScroll={onScroll}
        onScrollToLower={onScrollToLower}
        className={styles['body']}
      >
        <ImageBox
          height={pxTransform(200)}
          width="100%"
          borderRadius={0}
          resizeMode="heightFix"
          source={advertInfo?.imageUrl || PopularStoreDefault}
          style={{
            backgroundColor: 'transparent',
            opacity: advertOpacity,
          }}
        />
        {dataList?.map((item, index) => {
          return renderListByType({
            item,
            index,
          })
        })}
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(observer(PopularShop))
