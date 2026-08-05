import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Description: 换购列表
 */
import React, { useState, useEffect, useRef } from 'react'
import { useRouter, showToast, hideToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Button, Checkbox } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import classNames from 'classnames'
import { useStores } from '@/store/useStores'
import { dateFormat } from '@/utils/date'
import { themeLayout } from '@/constants/theme'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import { useSafeArea } from '@apps/mobile-services'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import PageLayout from '@/components/PageLayout'
import Nav from '@/components/NavBar'
import Loading from '@/components/Loading'
import {
  getProductMobileShopPurchaseGetPurchaseList,
  GetProductMobileShopPurchaseGetPurchaseListResponse,
  postMarketingMobileActivityGoodsRelationGoodsList,
  PostMarketingMobileActivityGoodsRelationGoodsListResponse,
} from '@apps/apis'
import { postProductMobileShopPurchaseSavePurchaseBatch } from '@apps/apis'
import CampaignPoster from '../components/CampaignPoster'
import ProductCard, { ProductCardData } from './components/ProductCard'
import './index.scss'
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
  /**
   * 已选中的商品skuId，多个 skuId以 ',' 分开
   */
  skuIds: string
}
type SalesCampaignDataType = Omit<PostMarketingMobileActivityGoodsRelationGoodsListResponse, 'commodityList'> & {
  commodityList: ProductCardData[]
}
let toastIns: any = null
const ChangeProduct: React.FC = () => {
  const router = useRouter<RouteParams>()
  const {
    params: { activityId, belongType, skuId, skuIds },
  } = router
  const defaultChoice = skuIds
    ? decodeURIComponent(skuIds)
        .split(',')
        .map((item) => +item)
    : []
  const [currentProduct, setCurrentProduct] = useState<ProductCardData | null>(null)
  const [salesCampaignData, setSalesCampaignData] = useState<SalesCampaignDataType | null>()
  const [loading, setLoading] = useState(false)
  const [choice, setChoice] = useState<number[]>(defaultChoice)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const { jmpProductDetail } = useProductDetailJump()
  const {
    userStore: { shopAndSite },
    locationStore: { currentCity },
  } = useStores()
  const { safeBottomHeight } = useSafeArea()
  const intl = useIntl()
  const purchaseListRef = useRef<GetProductMobileShopPurchaseGetPurchaseListResponse>([])

  /** 获取购物车列表数据 */
  const getPurchaseList = (): Promise<GetProductMobileShopPurchaseGetPurchaseListResponse> => {
    return new Promise((resolve) => {
      getProductMobileShopPurchaseGetPurchaseList()
        .then((res) => {
          if (res.code === 1000 && res.data && res.data.length > 0) {
            resolve(res.data)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }
  const updatePurchaseList = async () => {
    purchaseListRef.current = await getPurchaseList()
  }
  useEffect(() => {
    updatePurchaseList()
  }, [])
  const _normalizeList = (
    data: PostMarketingMobileActivityGoodsRelationGoodsListResponse['commodityList'],
  ): ProductCardData[] => {
    const ret: ProductCardData[] = []
    data.forEach((item) => {
      const atom: ProductCardData = {
        id: item.productId,
        skuId: item.skuId,
        name: item.productName,
        describe: item.slogan,
        picture: item.mainPic,
        priceType: item.priceType,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: 1,
        memberId: item.memberId,
        storeId: item.storeId,
      }
      ret.push(atom)
    })
    return ret
  }
  const fetchRelationGoodsList = () => {
    setLoading(true)
    postMarketingMobileActivityGoodsRelationGoodsList({
      shopId: shopAndSite?.id!,
      activityId: +activityId,
      belongType: +belongType,
      skuId: +skuId,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { commodityList = [], mainGoods } = res.data
          if (mainGoods) {
            setCurrentProduct(_normalizeList([mainGoods])[0])
          }
          setSalesCampaignData({
            ...res.data,
            commodityList: _normalizeList(commodityList),
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    fetchRelationGoodsList()
  }, [])
  const handleChoiceChange = (value: React.Key[]) => {
    setChoice(value as number[])
  }
  const handleCurrentProductChange = () => {
    toastIns && hideToast(toastIns)
    toastIns = showToast({
      title: intl.formatMessage({
        id: 'commodityMerge.changeProduct.tip',
        defaultMessage: '主商品必须选中才能换购商品哦！',
      }),
      icon: 'none',
    })
  }
  const handleClickProduct = (record: ProductCardData) => {
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, {
      commodityId: record.id,
      skuId: record.skuId,
    })
  }
  const handleConfirm = () => {
    const checked = salesCampaignData?.commodityList?.filter((item) => choice.includes(item.skuId))
    if (!checked || !checked.length) {
      toastIns && hideToast(toastIns)
      toastIns = showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.changeProduct.choice.required',
          defaultMessage: '请选择需要换购的商品',
        }),
        icon: 'none',
      })
      return
    }
    console.log(currentProduct, skuId, 'currentProduct')
    setConfirmLoading(true)
    const purchaseBatchList: any = checked.map((item) => ({
      id: 0,
      commoditySkuId: item.skuId,
      setMealId: currentProduct?.skuId,
      purchaseCommodityType: 4,
      // 换购商品
      count: item.quantity,
      isMain: false,
      // true 为主商品
      parentSkuId: currentProduct?.skuId,
    }))

    // 判断购物车中是否已有主商品
    const itemCartInfo = purchaseListRef.current.find(
      (item) => item.purchaseSkuResp.id === Number(currentProduct?.skuId),
    )
    if (!itemCartInfo) {
      purchaseBatchList.unshift({
        commoditySkuId: currentProduct?.skuId,
        setMealId: currentProduct?.skuId,
        purchaseCommodityType: 4,
        // 换购商品
        count: currentProduct?.quantity || 1,
        // 默认一件
        isMain: true,
        // true 为主商品
        parentSkuId: undefined,
      })
    }

    postProductMobileShopPurchaseSavePurchaseBatch({
      purchaseBatchList,
    })
      .then((res) => {
        if (res.code === 1000) {
          showToast({
            title: intl.formatMessage({
              id: 'commodityMerge.changeProduct.confirm.success',
              defaultMessage: '添加成功',
            }),
            icon: 'none',
          })
          setTimeout(() => {
            // 存在skuIds表示是从购物车跳进来的，目前是这样的
            if (!skuIds) {
              Router.redirectTo('order/Purchase', {
                routerShopId: currentProduct?.storeId,
                routerSkuId: currentProduct?.skuId,
                hasTab: true,
              })
            } else {
              Router.navigateBack()
            }
          }, 1000)
        } else {
          setConfirmLoading(false)
        }
        if (res.code !== 1000 && res.message) {
          showToast({
            title: res.message,
            icon: 'none',
          })
        }
      })
      .catch(() => {
        setConfirmLoading(false)
      })
  }
  const paddingBottom = safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs'])
  return (
    <PageLayout
      renderHeader={
        <>
          <Nav
            title={intl.formatMessage({
              id: 'commodityMerge.changeProduct.nav',
              defaultMessage: '换购商品',
            })}
          />
        </>
      }
    >
      {!loading ? (
        <>
          <View className="changeProduct">
            <View className="changeProduct-current">
              <View className={classNames('changeProduct-list-item', 'changeProduct-current-item')}>
                <View className={classNames('changeProduct-list-item-left', 'changeProduct-current-left')}>
                  <Checkbox value="current" onChange={handleCurrentProductChange} checked />
                </View>
                <View className="changeProduct-list-item-right">
                  {currentProduct && <ProductCard data={currentProduct} />}
                </View>
              </View>
            </View>
            <CampaignPoster
              title={salesCampaignData?.activityDescription! || salesCampaignData?.activityName!}
              startDate={salesCampaignData?.startTime ? dateFormat(new Date(salesCampaignData?.startTime)) : ''}
              endDate={salesCampaignData?.endTime ? dateFormat(new Date(salesCampaignData?.endTime)) : ''}
            />
            <View className="changeProduct-scroll">
              <Checkbox.Group value={choice} onChange={handleChoiceChange}>
                <ScrollView className="changeProduct-scrollView" scrollY>
                  <View className="changeProduct-list">
                    {salesCampaignData?.commodityList.map((item) => (
                      <View key={item.id} className="changeProduct-list-item">
                        <View className="changeProduct-list-item-left">
                          <Checkbox value={item.skuId} />
                        </View>
                        <View className="changeProduct-list-item-right">
                          <ProductCard data={item} onClick={handleClickProduct} />
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </Checkbox.Group>
            </View>
            <View
              style={{
                paddingBottom,
              }}
              className="changeProduct-fixed"
            >
              <View className="changeProduct-fixed-left">
                <Text className="changeProduct-choice">
                  {intl.formatMessage({
                    id: 'commodityMerge.changeProduct.choice',
                    len: `${choice.length}/${salesCampaignData?.commodityList.length || 0}`,
                    interpolation: {
                      escapeValue: false,
                    },
                  })}
                </Text>
              </View>
              <View className="changeProduct-fixed-right">
                <Button
                  className="changeProduct-fixed-confirm"
                  type="primary"
                  onClick={handleConfirm}
                  loading={confirmLoading}
                >
                  {intl.formatMessage({
                    id: 'commodityMerge.changeProduct.confirm',
                    defaultMessage: '确 定',
                  })}
                </Button>
              </View>
            </View>
          </View>
        </>
      ) : (
        <Loading loading={loading} noMore noMoreText="" />
      )}
    </PageLayout>
  )
}
export default GlobalWrapper(ChangeProduct)
