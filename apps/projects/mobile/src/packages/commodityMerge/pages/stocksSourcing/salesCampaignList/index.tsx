import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-30 15:35:22
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 16:23:58
 * @Description: 促销商品列表
 */
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { ScrollView } from '@tarojs/components'
import { useIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import useStores from '@/store/useStores'
import { dateFormat } from '@/utils/date'
import {
  postMarketingMobileActivityGoodsRelationTag,
  PostMarketingMobileActivityGoodsRelationTagResponse,
} from '@apps/apis'
import NavBar from '@/components/NavBar'
import Search from '@/components/Search'
import PageLayout from '@/components/PageLayout'
import ProductList from '@/components/ProductList'
import { ProductItem } from '@/components/ProductList/Item'
import Loading from '@/components/Loading'
import CampaignPoster from '../components/CampaignPoster'
import './index.scss'
import { usePageInit } from '@/hooks/usePageInit'
type RouteParams = {
  /**
   * 活动id
   */
  activityId: string
  /**
   * 活动类型
   */
  belongType: string
  /**
   * 商品skuId
   */
  skuId: string
}
interface ListParams {
  /**
   * 商品名称
   */
  name?: string
}
type SalesCampaignDataType = Omit<PostMarketingMobileActivityGoodsRelationTagResponse, 'commodityList'> & {
  commodityList: ProductItem[]
}
const ConponSimilarList: React.FC = () => {
  const router = useRouter<RouteParams>()
  const {
    params: { activityId, belongType, skuId },
  } = router
  const [name, setName] = useState('')
  const [salesCampaignData, setSalesCampaignData] = useState<SalesCampaignDataType | null>(null)
  const [loading, setLoading] = useState(false)
  const {
    userStore: { shopAndSite },
    locationStore: { currentCity },
  } = useStores()
  const pageRef = useRef<number>(1)
  const searchValue = useRef<ListParams>({})
  const intl = useIntl()
  usePageInit()
  const _normalizeList = (
    data: PostMarketingMobileActivityGoodsRelationTagResponse['commodityList'],
  ): ProductItem[] => {
    const ret: ProductItem[] = []
    data.forEach((item) => {
      const atom: ProductItem = {
        id: item.productId,
        name: item.productName,
        describe: item.slogan,
        price: item.price,
        unit: item.unitName,
        salesVolume: item.sold,
        picture: item.mainPic,
        priceType: item.priceType,
        storeId: item.storeId,
        supplierInfo: {
          id: item.memberId,
          roleId: item.memberRoleId,
          name: item.storeName || item.memberName,
        },
        saleTags: item.tagList,
        min: item.min,
        max: item.max,
      }
      ret.push(atom)
    })
    return ret
  }
  const getSalesCampaignData = (): Promise<SalesCampaignDataType> => {
    if (loading) {
      return Promise.reject()
    }
    setLoading(true)
    return new Promise((resolve, reject) => {
      postMarketingMobileActivityGoodsRelationTag({
        shopId: shopAndSite?.id!,
        activityId: +activityId,
        belongType: +belongType,
        skuId: +skuId,
        productName: name,
        provinceCode: currentCity?.provinceCode,
        cityCode: currentCity?.cityCode,
      })
        .then((res) => {
          if (res.code === 1000) {
            const { commodityList = [] } = res.data
            resolve({
              ...res.data,
              commodityList: _normalizeList(commodityList),
            })
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }
  useEffect(() => {
    getSalesCampaignData()
      .then((res) => {
        setSalesCampaignData(res)
      })
      .catch(() => {})
  }, [])
  const handleSearch = (keyword: string) => {
    if (loading) {
      return
    }
    pageRef.current = 1
    searchValue.current = {
      name: keyword,
    }
    getSalesCampaignData()
      .then((res) => {
        setSalesCampaignData(res)
      })
      .catch(() => {})
  }
  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar
            title={
              <Search
                customClassName="sales-campaign-search"
                value={name}
                onChange={(value) => setName(value)}
                onSearch={(value) => handleSearch(value)}
                shape="round"
                clearable
              />
            }
            greedy
          />
        </>
      }
    >
      <CampaignPoster
        title={salesCampaignData?.activityDescription! || salesCampaignData?.activityName!}
        startDate={salesCampaignData?.startTime ? dateFormat(new Date(salesCampaignData?.startTime)) : ''}
        endDate={salesCampaignData?.endTime ? dateFormat(new Date(salesCampaignData?.endTime)) : ''}
      />
      <View className="sales-campaign-list">
        <ScrollView className="sales-campaign-scrollView" scrollY>
          <ProductList dataSource={salesCampaignData?.commodityList || []} />
          <Loading
            loading={loading}
            noMore
            noMoreText={intl.formatMessage({
              id: 'commodityMerge.salesCampaignList.noMore',
              defaultMessage: '没有更多商品啦~',
            })}
          />
        </ScrollView>
      </View>
    </PageLayout>
  )
}
export default GlobalWrapper(ConponSimilarList)
