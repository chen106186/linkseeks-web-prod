import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react'
import { pxTransform, getSystemInfoSync, createSelectorQuery } from '@apps/mobile-services/utils/taro'
import { Swiper, SwiperItem } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { View, Text, Tabs } from '@apps/mobile-ui'
import { CurrentCityType } from '@/store/locationStore/model'
import { getMarketingAdornGoodsListAdorn, getMarketingMobileActivityGoodsAreaAdorn } from '@apps/apis'
import Commodity from './components/Commodity'
import Shops from './components/Shops'
import Brand from './components/Brand'
import Information from './components/Information'
import { postCommodityWebStoreWebMemberShopInCommodityListAdorn } from '@apps/apis'
import { getProductCommodityTemplateGetBrandList } from '@apps/apis'
import { getManageContentInformationListAdorn } from '@apps/apis'
import styles from './index.module.scss'

interface ItemType {
  num: number
  type: number
  explain: string
  title: string
  details: any[]
  id?: number[]
  manageWay?: number
  // customize: CustomizeType[] | undefined
}

interface RecommendProps {
  shopId?: number
  details: ItemType[]
  scroll?: boolean
  ref?: any
  currentCity: CurrentCityType | undefined
  refreshing: boolean
  onScrollToUpper?: (state: boolean) => void
}

const Recommend: React.FC<RecommendProps> = (props) => {
  const { details, scroll, shopId, currentCity } = props
  const [activeKey, setActiveKey] = useState<number>(0)
  const [productList, setProductList] = useState<any[]>([])
  const scrollTop = useRef<number>(0)
  const [swiperHeight, setSwiperHeight] = useState<number>(0)
  const WINHEIGHT = getSystemInfoSync().windowHeight
  const BOTTOM_HEIGHT = 30

  useLayoutEffect(() => {
    setTimeout(() => {
      createSelectorQuery()
        .select(`#swiperItem_view_${activeKey}`)
        .boundingClientRect((rect) => {
          if (rect) {
            setSwiperHeight(rect.height + BOTTOM_HEIGHT)
          }
        })
        .exec()
    }, 500)
  }, [activeKey, productList])

  const _getListByIds = (ids: number[], list: any[]) => {
    const result: any = []
    list &&
      list.forEach((item) => {
        if (ids.includes(item.id)) {
          result.push(item)
        }
      })
    return result
  }

  const _getCommodityListByType = async (type: number, num: number) => {
    if (type) {
      const param: any = {
        shopId,
        type,
        current: 1,
        pageSize: num || 50,
        provinceCode: currentCity?.provinceCode,
        cityCode: currentCity?.cityCode,
      }
      const res = await getMarketingMobileActivityGoodsAreaAdorn(param)
      if (res.code === 1000 && res.data) {
        return (
          res.data.data &&
          res.data.data.map((item) => ({
            productName: item.name,
            productImg: item.mainPic,
            discount: item.min,
            productId: item.id,
            dataType: 1,
          }))
        )
      }
    }
    return []
  }

  /**
   * 根据类型获取数据
   * @param type
   * @param manageWay
   * @param num
   * @returns
   */
  const _getListByType = async (type: number, manageWay: number | undefined, num: number) => {
    let listRes: any = []
    let idsRes: any[] = []
    const list = details
    if (list && Array.isArray(list) && list.length > 0) {
      switch (type) {
        case 1:
          if (manageWay === 3) {
            const selectIds = list.filter((item: any) => item.type === type)[0].id || []
            idsRes = selectIds
            if (idsRes && idsRes.length > 0) {
              const param: any = {
                idInList: idsRes.join(','),
                shopId,
                current: 1,
                pageSize: 50,
                provinceCode: currentCity?.provinceCode,
                cityCode: currentCity?.cityCode,
              }
              const res = await getMarketingAdornGoodsListAdorn(param)
              if (res.code === 1000) {
                listRes =
                  res.data.data &&
                  res.data.data.map((item) => ({
                    productName: item.name,
                    productImg: item.mainPic,
                    discount: item.min,
                    productId: item.id,
                  }))
              }
            }
          } else if (manageWay) {
            listRes = await _getCommodityListByType(manageWay, num)
          }
          break
        case 2:
          const shopDetails = list.filter((item: any) => item.type === type)[0].details || []
          const shopResList: any[] = []
          if (shopDetails && shopDetails.length > 0) {
            const storeInCommodityList: any = []
            shopDetails.forEach((detailsItem: any) => {
              storeInCommodityList.push({
                storeId: detailsItem.shopId,
                commodityIdList: detailsItem.productIds,
              })
            })
            const param: any = {
              shopId,
              storeInCommodityList,
              provinceCode: currentCity?.provinceCode,
              cityCode: currentCity?.cityCode,
            }
            try {
              const res = await postCommodityWebStoreWebMemberShopInCommodityListAdorn(param, {
                headers: { environment: 3 },
              })
              if (res.code === 1000) {
                const allShopList: any[] = res.data
                allShopList.forEach((item) => {
                  shopResList.push({
                    ...item,
                    productList: item.commodityVOList,
                    productIds: item.commodityVOList && item.commodityVOList.map((goodItem: any) => goodItem.id),
                  })
                })
              }
            } catch (error) {}
          }
          listRes = shopResList
          break
        case 3:
          const brandDetails = list.filter((item: any) => item.type === type)[0].details || []
          let brandDetailsIds: any = []
          const brandResList: any[] = []
          brandDetails.forEach((detailsItem: any) => {
            brandDetailsIds = [...brandDetailsIds, ...detailsItem.brandIds]
          })
          if (brandDetailsIds && brandDetailsIds.length > 0) {
            const param: any = {
              idInList: brandDetailsIds.join(','),
              shopId,
              current: 1,
              pageSize: 100,
            }
            const res = await getProductCommodityTemplateGetBrandList(param)
            let allBrandList: any[] = []
            if (res.code === 1000) {
              allBrandList = res.data.data

              brandDetails.forEach((detailsItem: any) => {
                brandResList.push({
                  ...detailsItem,
                  brandList: _getListByIds(detailsItem.brandIds, allBrandList),
                })
              })
            }
          }
          listRes = brandResList
          break
        case 4:
          const infoIds = list.filter((item: any) => item.type === type)[0]?.selectIds || []
          idsRes = infoIds
          if (idsRes && idsRes.length > 0) {
            const param: any = {
              idInList: infoIds.join(','),
              shopId,
              current: 1,
              pageSize: 50,
            }
            const res = await getManageContentInformationListAdorn(param)
            if (res.code === 1000) {
              listRes =
                res.data.data &&
                res.data.data.map((item) => ({
                  ...item,
                }))
            }
          }
          break
        default:
          break
      }
    }

    return {
      list: listRes,
      ids: idsRes,
    }
  }

  const fetchAllDataList = async () => {
    const finalList: any[] = []
    for (let i = 0; i < details.length; i++) {
      const item = details[i]
      if (item?.type) {
        const { list } = await _getListByType(item?.type, item?.manageWay, item.num)
        finalList.push({
          index: i,
          dataType: item.type,
          list: list,
        })
      } else {
        finalList.push({
          index: i,
          height: BOTTOM_HEIGHT,
          list: [],
        })
      }
    }

    setProductList(finalList)
  }

  useEffect(() => {
    if (details) {
      fetchAllDataList()
    }
  }, [details, currentCity])

  const _renderTabItems = useMemo(() => {
    if (details && details.length > 0) {
      const _tabItemList: any[] = []
      for (const item of details) {
        if (item.title) {
          _tabItemList.push({
            title: (
              <View className={styles['tab-item']}>
                <Text className={styles['tab-item-title']}>{item?.title}</Text>
                <Text className={styles['tab-item-explain']}>{item?.explain}</Text>
              </View>
            ),
          })
        }
      }
      return _tabItemList
    }
    return []
  }, [details])

  const handleTabClick = (index: number) => {
    setActiveKey(index)
  }

  const handleSwiperChange = (e) => {
    setActiveKey(e.detail.current)
  }

  const handleTouchMove = () => {
    if (!scroll && scrollTop.current <= 5) {
      // console.log(scrollTop.current, 'scrollTop.current')
      // onScrollToUpper(true)
    }
  }

  const renderComponentByType = (info: any) => {
    switch (info.dataType) {
      case 1:
        return <Commodity list={info.list || []} />
      case 2:
        return <Shops list={info.list || []} shopId={shopId} currentCity={currentCity} />
      case 3:
        return <Brand list={info.list || []} />
      case 4:
        return <Information list={info.list || []} />
      default:
        return null
    }
  }

  return (
    <View className={styles[`mall-recommend`]} id="mallRecommend" onTouchMove={handleTouchMove}>
      <Tabs
        className={styles['mall-recommend-tabs']}
        current={activeKey}
        tabList={_renderTabItems}
        onClick={handleTabClick}
        transparentBg
        hideUnderLine
        activeColor="#C45124"
      />
      {productList && productList.length > 0 && (
        <Swiper
          className={styles['mall-recommend-swiper']}
          current={activeKey}
          duration={300}
          style={{ minHeight: pxTransform(swiperHeight || 120) }}
          onChange={handleSwiperChange}
        >
          {productList.map((productItem) => (
            <SwiperItem key={`pannel_${productItem.index}`}>
              <View id={`swiperItem_view_${productItem.index}`}>{renderComponentByType(productItem)}</View>
            </SwiperItem>
          ))}
        </Swiper>
      )}
    </View>
  )
}

Recommend.defaultProps = {
  scroll: true,
}

export default observer(Recommend)
