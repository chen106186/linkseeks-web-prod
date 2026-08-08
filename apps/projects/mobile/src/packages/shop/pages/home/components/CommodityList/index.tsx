import React, { useEffect, useState } from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import { ColumnCommodity } from '@/components/Commodity'
import { getMarketingAdornGoodsListAdorn, getMarketingMobileActivityGoodsAreaAdorn } from '@apps/apis'
import Router from '@/utils/router'
import { ShopInfoType } from '@/store/templateStore/model'
import { useIntl } from '@linkseeks/i18n'
import { CurrentCityType } from '@/store/locationStore/model'
import styles from './index.module.scss'

export interface ProductItemType {
  categoryId: number
  idList: number[]
  dataList: any[]
  manageWay: number | undefined
  title: string
}

interface CommodityListPropsType {
  details: ProductItemType[]
  shopId: number | undefined
  shopInfo: ShopInfoType
  currentCity: CurrentCityType | undefined
}

const CommodityList = (props: CommodityListPropsType) => {
  const [productList, setProductList] = useState<ProductItemType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [current] = useState<number>(1)
  const [pageSize] = useState<number>(50)
  const { details, shopId, shopInfo, currentCity } = props
  const intl = useIntl()

  const _normalizeList = (data: any[]): any[] => {
    const ret: any[] = []
    data.forEach((item) => {
      const _obj: any = {
        productName: item.name,
        productImg: item.mainPic,
        discount: item.price || item.min,
        productId: item.id,
        priceType: item.priceType,
        tagList: item.tagList,
        activityTypeList: item.activityTypeList,
        min: item.min,
        max: item.max,
        price: item.price,
      }

      ret.push(_obj)
    })
    return ret
  }

  const _getListByIds = (ids: number[], list: any[]) => {
    const result: any = []
    list &&
      list.forEach((item) => {
        if (ids.includes(item.productId)) {
          result.push(item)
        }
      })
    return result
  }

  const _getCommodityListByType = async (categoryId: number, type: number, num: number) => {
    if (type && categoryId) {
      const param: any = {
        shopId,
        memberId: shopInfo?.memberId,
        memberRoleId: shopInfo?.roleId,
        customerCategoryId: categoryId,
        type,
        current,
        pageSize: num || pageSize,
        provinceCode: currentCity?.provinceCode,
        cityCode: currentCity?.cityCode,
        priceTypeList: [1],
      }
      const res = await getMarketingMobileActivityGoodsAreaAdorn(param)
      if (res.code === 1000 && res.data) {
        return _normalizeList(res.data.data)
      }
    }
    return []
  }

  const _getCommodityList = async (list: any[]) => {
    let listRes: any = []
    if (list && Array.isArray(list) && list.length > 0) {
      let commodityIds: any = []
      const commodityResList: any[] = []
      list.forEach((detailsItem) => {
        if (detailsItem.idList) {
          if (commodityIds.length === 0) {
            commodityIds = [...detailsItem.idList]
          } else {
            commodityIds = [...commodityIds, ...detailsItem.idList]
          }
        }
      })
      let allCommodityList: any[] = []
      if (commodityIds && commodityIds.length > 0) {
        const param: any = {
          idInList: commodityIds.join(','),
          shopId,
          current: 1,
          pageSize: 80,
        }
        const res = await getMarketingAdornGoodsListAdorn(param)

        if (res.code === 1000) {
          allCommodityList = _normalizeList(res.data.data)
        }
      }
      for (let i = 0; i < list.length; i += 1) {
        const detailsItem = list[i]
        if (detailsItem?.manageWay === 3) {
          commodityResList.push({
            ...detailsItem,
            dataList: _getListByIds(detailsItem.idList || [], allCommodityList),
          })
        } else {
          const commodityList = await _getCommodityListByType(
            detailsItem.categoryId,
            detailsItem.manageWay,
            detailsItem?.num,
          )
          commodityResList.push({
            ...detailsItem,
            dataList: commodityList,
          })
        }
      }
      listRes = commodityResList
    }

    setLoading(false)

    console.log('listRes', listRes)
    setProductList(listRes)
  }

  useEffect(() => {
    if (details && details.length > 0 && shopId) {
      _getCommodityList(details)
    }
  }, [details])

  const renderItem = ({ item }: { item: ProductItemType }) => (
    <View className={styles['productList']}>
      <View className={styles['productItem']}>
        <View className={styles['productItem_title']}>
          <Text className={styles['productItem_title_text']}>{item.title}</Text>
          <View
            className={styles['productItem_title_more']}
            onClick={() => {
              if (item.categoryId) {
                Router.navigateTo('commodityMerge/stocksSourcing/index', {
                  categoryId: item.categoryId,
                  id: shopInfo?.id,
                })
              }
            }}
          >
            <Text className={styles['productItem_title_more_text']}>
              {intl.formatMessage({ id: 'shop_home_commodity_list_more', defaultMessage: '更多' })}
            </Text>
            <Icons name="ChevronRight" size={10} />
          </View>
        </View>
        {item.dataList && item.dataList.length > 0 && <ColumnCommodity dataSource={item.dataList} />}
      </View>
    </View>
  )

  return details && !loading ? (
    <View className={styles['shop-commodity-list']}>
      {productList && productList.map((productItem: ProductItemType) => renderItem({ item: productItem }))}
    </View>
  ) : null
}

export default CommodityList
