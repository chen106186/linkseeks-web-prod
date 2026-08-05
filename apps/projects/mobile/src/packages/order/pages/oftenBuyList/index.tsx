import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: Crayon
 * @Date: 2021-10-26 16:46:42
 * @LastEditTime: 2021-11-16 10:25:36
 * @LastEditors: Crayon
 * @Description:
 * @FilePath: \lingxi-mobile\src\packages\order\pages\oftenBuyList\index.tsx
 */
import React, { useEffect, useRef, useState } from 'react'
import { pxTransform, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Text, Toast, Image, ScrollView } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { getProductMobileCommodityOftenBuyGetOftenBuyCommodityList } from '@apps/apis'
import { postProductShopPurchaseSaveOrUpdatePurchase } from '@apps/apis'
import Search from '@/components/Search'
import Loading from '@/components/Loading'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import { checkMore } from '@/utils'
import { useIntl } from '@linkseeks/i18n'
import { SHOP_TYPE } from '@/constants/const/shop'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { message } from 'antd'
const purchaseIconSvg = getOssUrlPath('/miniprogram/assets/images/purchase_icon.svg')
const PAGE_SIZE = 10

// 根据当前 商城类型 请求相应的 详情接口
const normalHeaders = {
  type: SHOP_TYPE.ENTERPRISE,
}

// 提取价格
const getPrice = (unitPrice: Object) => {
  if (unitPrice) {
    return Object.values(unitPrice)[0] || null
  }
  return null
}
const OftenBuyList: React.FC = () => {
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  usePageInit()
  // setNavigationBarTitle({ title: intl.formatMessage({ id: 'oftenBuyList_product_title', defaultMessage: '常购清单' }) })
  const nameRef = useRef<string>('')
  const pageRef = useRef<number>(1)
  const clickFlag = useRef<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [oftenBuyCommodityList, setOftenBuyCommodityList] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState<string>()

  /**
   * 详情跳转
   * @param item 商品信息
   */
  const handleJumpDetail = (item: any) => {
    if (!item.isPublish) {
      Toast.show({
        icon: 'none',
        title: intl.formatMessage({
          id: 'oftenBuyList_product_down',
          defaultMessage: '商品已下架',
        }),
      })
      return
    }
    const commodityId = item.commoditySku?.commodityId
    const type = item.commoditySku?.priceType
    jmpProductDetail(type, {
      commodityId,
    })
  }

  /**
   * 获取常购清单列表
   * @param current 页码
   * @param name 商品名称
   */
  const getOftenBuyCommodityList = (concat = false) => {
    setLoading(true)
    getProductMobileCommodityOftenBuyGetOftenBuyCommodityList({
      current: pageRef.current,
      pageSize: PAGE_SIZE,
      name: nameRef.current,
    })
      .then((res: any) => {
        const { code, data } = res
        if (code === 1000) {
          console.log(`res`, res)
          setHasMore(checkMore(pageRef.current, PAGE_SIZE, (data.data || []).length, res.data.totalCount))
          const listData = data.data || []
          const newListData = concat ? oftenBuyCommodityList.concat(listData) : listData
          setOftenBuyCommodityList(newListData)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /**
   * 上拉下一页
   * @returns
   */
  const handleCommodityLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    getOftenBuyCommodityList(true)
  }

  /**
   * 搜索常购清单商品
   */
  const onSearchCommodity = (value: string) => {
    pageRef.current = 1
    nameRef.current = value
    getOftenBuyCommodityList()
  }

  /**
   * 搜索值改变
   * @param e
   */
  const onSearchValueChange = (value: string) => {
    setSearchValue(value)
  }

  /**
   * 加入购物车
   */
  const handleAddToPurchase = (item: any) => {
    if (!item.isPublish) {
      Toast.show({
        icon: 'none',
        title: intl.formatMessage({
          id: 'oftenBuyList_product_down',
          defaultMessage: '商品已下架',
        }),
      })
      return
    }
    if (clickFlag.current) {
      clickFlag.current = false
      const param: any = {
        commoditySkuId: item.commoditySku?.id,
        count: item.commoditySku?.minOrder || 1,
      }
      postProductShopPurchaseSaveOrUpdatePurchase(param, {
        headers: normalHeaders,
      })
        .then((res: any) => {
          if (res.code === 1000) {
            Toast.show({
              title: intl.formatMessage({
                id: 'oftenBuyList_product_addPurchase',
                defaultMessage: '已成功添加到购物车',
              }),
            })
          } else {
            message.error(res.message)
          }
        })
        .finally(() => {
          clickFlag.current = true
        })
    }
  }
  const renderProductItem = ({ item }: any) => {
    const price = getPrice(item.commoditySku?.unitPrice) || '-'
    return (
      <View className={styles['list_item']}>
        <View onClick={() => handleJumpDetail(item)}>
          {!item.isPublish && (
            <View className={styles['list_item_mask']}>
              {intl.formatMessage({
                id: 'oftenBuyList_product_hasdown',
                defaultMessage: '已下架',
              })}
            </View>
          )}
          <Image src={item.commoditySku?.commodityPic[0]} className={styles['list_item_img']} mode="aspectFill" />
        </View>
        <View className={styles['list_item_info']}>
          <View className={styles['list_item_info_main']}>
            <View className={styles['list_item_info_main_name']} onClick={() => handleJumpDetail(item)}>
              {item.commoditySku?.name}
            </View>
            <View className={styles['list_item_info_main_frequency']}>
              <Text className={styles['list_item_info_main_frequency_text']}>
                {intl.formatMessage({
                  id: 'oftenBuyList_product_hasbuy',
                  defaultMessage: '已购{{data}}次',
                  data: item.buyCount,
                })}
              </Text>
            </View>
          </View>
          <View className={styles['list_item_info_footer']}>
            <View className={styles['list_item_info_footer_price']}>
              <Text className={styles['list_item_info_footer_price_currency']}>
                {intl.formatMessage({
                  id: 'currency',
                  defaultMessage: '￥',
                })}
              </Text>
              <Text>{price}</Text>
              {/* <Text className={styles['price_color']}>{`.${priceArr[1]}`}</Text> */}
              {/* <Text className={styles['unit_color']}>{` /${commodityItem.unit}`}</Text> */}
            </View>
            {item.commoditySku?.priceType === PRICE_TYPE_ENUM.SPOT && (
              <Image
                onClick={() => handleAddToPurchase(item)}
                style={{
                  width: pxTransform(24),
                  height: pxTransform(24),
                }}
                src={purchaseIconSvg}
              />
            )}
            {item.commoditySku?.priceType === PRICE_TYPE_ENUM.CONSULTING && (
              <View onClick={() => handleJumpDetail(item)} className={styles['list_item_info_footer_btn']}>
                {intl.formatMessage({
                  id: 'oftenBuyList_product_inquire',
                  defaultMessage: '立即询价',
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }
  useEffect(() => {
    getOftenBuyCommodityList()
  }, [])
  return (
    <View className={styles['page']}>
      <View className={styles['search']}>
        <Search
          placeholder={intl.formatMessage({
            id: 'oftenBuyList_product_search',
            defaultMessage: '请输入商品名称',
          })}
          value={searchValue}
          onChange={onSearchValueChange}
          onSearch={onSearchCommodity}
          clearable
        />
      </View>
      <ScrollView
        scrollY
        className={styles['list']}
        onEndReached={handleCommodityLoadMore}
        onEndReachedThreshold={50}
        listFooterComponent={
          <Loading
            loading={loading}
            noMore={!hasMore}
            noMoreText={intl.formatMessage({
              id: 'oftenBuyList_product_noMore',
              defaultMessage: '没有更多数据啦',
            })}
          />
        }
      >
        <View className={styles['list_product']}>
          {oftenBuyCommodityList?.map((item) => {
            return renderProductItem({
              item,
            })
          })}
        </View>
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(observer(OftenBuyList))
