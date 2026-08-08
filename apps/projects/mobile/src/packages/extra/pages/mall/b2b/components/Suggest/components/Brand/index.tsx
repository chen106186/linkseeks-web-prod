import React, { useEffect, useState } from 'react'
import ImageBox from '@/components/ImageBox'
import { View, Text } from '@apps/mobile-ui'
import { getProductCommodityTemplateGetBrandList } from '@apps/apis'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { ItemType } from '../..'
import styles from './index.module.scss'

interface BrandItem {
  id: number
  logoUrl: string
  name: string
}

interface BrandItemType {
  brandList: BrandItem[]
  id: number
  image: string
  name: string
}

interface BrandProps {
  id: string
  actived: boolean
  shopId: number | undefined
  tabInfo: ItemType
  onSwiperHeightChange?: (height: number) => void
}

const Brand: React.FC<BrandProps> = (props) => {
  const { tabInfo, shopId, actived } = props
  const intl = useIntl()
  const [dataList, setDataList] = useState<BrandItemType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const _getListByIds = (ids: number[], list: any[]) => {
    const result: any = []
    list &&
      list.forEach((item) => {
        if (ids.includes(item.id)) {
          result.push(item)
        }
      })

    const sortResult: any = []
    for (const id of ids) {
      const current = result.find((item) => item.id === id)
      if (current) {
        sortResult.push(current)
      }
    }

    return sortResult
  }

  const getDataList = (): Promise<any[]> => {
    if (loading) {
      return Promise.reject()
    }

    setLoading(true)
    return new Promise(async (resolve, reject) => {
      try {
        let brandDetailsIds: any = []
        const brandDetails = tabInfo?.details || []
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
            resolve(brandResList)
            setHasMore(false)
          }
        }
        setLoading(false)
      } catch (error) {
        reject()
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    if (tabInfo && actived && hasMore) {
      getDataList()
        .then((res) => {
          setDataList(res)
        })
        .catch(() => {})
    }
  }, [tabInfo, actived])

  const _listFooter = () => (
    <Text className={styles['footer']}>
      {intl.formatMessage({ id: 'mall_client_suggestProduct_item_footer_1', defaultMessage: '已经到底啦～' })}
    </Text>
  )

  const handleBrandFilter = (info: BrandItem) => {
    Router.navigateTo('commodityMerge/stocksSourcing/index', { brandId: info.id })
  }

  return dataList && dataList.length > 0 ? (
    <View className={styles['recommend-brand-list']}>
      {dataList.map((item) => (
        <View className={styles['recommend-brand-list-item']} key={`brand_${item.id}`}>
          <View className={styles['recommend-brand-list-item-header']}>
            <View className={styles['recommend-brand-list-item-header-logo']}>
              <ImageBox width={40} height={40} source={item.image} />
            </View>
            <View className={styles['shopInfo']}>
              <View className={styles['shopNameWrapper']}>
                <Text className={styles['shopName']}>{item.name}</Text>
              </View>
            </View>
          </View>
          <View className={styles['brand-list']}>
            {item.brandList &&
              item.brandList.map((brandItem: any, brandIndex: number) => (
                <View
                  className={styles['brand-list-item']}
                  key={`brandItem_${item.id}_${brandIndex}`}
                  onClick={() => handleBrandFilter(brandItem)}
                >
                  <View className={styles['brand-list-item-body']}>
                    <ImageBox width={80} height={32} source={brandItem.logoUrl} />
                  </View>
                </View>
              ))}
          </View>
        </View>
      ))}
      {_listFooter()}
    </View>
  ) : null
}

export default Brand
