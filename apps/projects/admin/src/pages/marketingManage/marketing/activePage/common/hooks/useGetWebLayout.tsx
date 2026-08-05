import { useEffect, useState } from 'react'
import { updatePageConfig } from '@apps/design-react'
import DEFAULT_DATA from '../mock/web.json'
import type { GetMarketingWebActivityPageGetResponse } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import { arrayToMap } from '@/utils'
import { getCommodityShopDetails, getMarketingWebActivityPageGet } from '@apps/apis'
import { getMarketingAdornActivityGoodsAdorn, postMarketingCouponPlatformActivityPageSelectDetail } from '@apps/apis'

type DataSourceItemType = {
  sort: number
  dataIndex: string
  props: {
    theme?: 0 | 1 | (2 & number)
    visible: boolean
    childrenData?: any[]
  } & Record<string, any>
}
type DataSourceType = Record<string, DataSourceItemType>
type DetailType = Omit<GetMarketingWebActivityPageGetResponse, 'adornContent'> & {
  adornContent: DataSourceType
  logoUrl?: string
}

/** 请求钱处理 */
const formatData = {
  coupon: (data: { id: number; type: 1 | 2 | (number & { label: string }) }[]) => {
    return {
      couponList: data.map((_item) => ({
        belongType: _item.type,
        couponId: _item.id,
      })),
    }
  },
  hot: (data: number[]) => ({ ids: data }),
  specialOffer: (data: number[]) => ({ ids: data }),
  plummet: (data: number[]) => ({ ids: data }),
  discount: (data: number[]) => ({ ids: data }),
  fullQuantitySub: (data: number[]) => ({ ids: data }),
  fullQuantityDiscount: (data: number[]) => ({ ids: data }),
  fullMoneySub: (data: number[]) => ({ ids: data }),
  fullMoneyDiscount: (data: number[]) => ({ ids: data }),
  giveProduct: (data: number[]) => ({ ids: data }),
  giveCoupon: (data: number[]) => ({ ids: data }),
  morePiece: (data: number[]) => ({ ids: data }),
  combination: (data: number[]) => ({ ids: data }),
  groupPurchase: (data: number[]) => ({ ids: data }),
  bargain: (data: number[]) => ({ ids: data }),
  secKill: (data: number[]) => ({ ids: data }),
  fullSwap: (data: number[]) => ({ ids: data }),
  buySwap: (data: number[]) => ({ ids: data }),
  preSale: (data: number[]) => ({ ids: data }),
  setMeal: (data: number[]) => ({ ids: data }),
  attempt: (data: number[]) => ({ ids: data }),
  // suggestProductItem: (data: number[]) => ({ids: data.map((_item))}),
}

/** key 对应组件名 */
const COMPONENT_NAME = {
  top: 'WebAdvertise',
  coupon: 'WebCouponContainer',
  hot: 'WebHotCommoditySwiper',
  specialOffer: 'WebCommodityContainer',
  plummet: 'WebCommodityContainer',
  discount: 'WebCommodityContainer',
  fullQuantitySub: 'WebCommodityContainer',
  fullQuantityDiscount: 'WebCommodityContainer',
  fullMoneySub: 'WebCommodityContainer',
  fullMoneyDiscount: 'WebCommodityContainer',
  giveProduct: 'WebCommodityContainer',
  giveCoupon: 'WebCommodityContainer',
  morePiece: 'WebCommodityContainer',
  combination: 'WebCommodityContainer',
  groupPurchase: 'WebCommodityContainer',
  bargain: 'WebCommodityContainer',
  secKill: 'WebCommodityContainer',
  fullSwap: 'WebCommodityContainer',
  buySwap: 'WebCommodityContainer',
  preSale: 'WebCommodityContainer',
  setMeal: 'WebMealCommodityContainer',
  attempt: 'WebCommodityContainer',
  suggestProduct: 'WebCustomCommodity',
}

/** key 对应子节点ComponentName */
const CHILD_COMPONENT_NAME = {
  coupon: 'WebCoupon',
  hot: 'WebHotCommodityItem',
  plummet: 'WebCommodity',
  specialOffer: 'WebCommodity',
  discount: 'WebCommodity',
  fullQuantitySub: 'WebCommodity',
  fullQuantityDiscount: 'WebCommodity',
  fullMoneySub: 'WebCommodity',
  fullMoneyDiscount: 'WebCommodity',
  giveProduct: 'CommodityList.SwapProduct',
  giveCoupon: 'CommodityList.SwapCoupon',
  morePiece: 'WebCommodity',
  combination: 'WebCommodity',
  groupPurchase: 'WebCommodity',
  bargain: 'WebCommodity',
  secKill: 'WebCommodity',
  fullSwap: 'WebCommodity',
  buySwap: 'WebCommodity',
  preSale: 'WebCommodity',
  setMeal: 'CommodityList.WebCommodityTab',
  attempt: 'WebCommodity',
  suggestProduct: 'WebCommodityContainer',
}

/**
 * key 对应接口
 */
const service = {
  coupon: postMarketingCouponPlatformActivityPageSelectDetail,
  hot: getMarketingAdornActivityGoodsAdorn,
  specialOffer: getMarketingAdornActivityGoodsAdorn,
  plummet: getMarketingAdornActivityGoodsAdorn,
  discount: getMarketingAdornActivityGoodsAdorn,
  fullQuantitySub: getMarketingAdornActivityGoodsAdorn,
  fullQuantityDiscount: getMarketingAdornActivityGoodsAdorn,
  fullMoneySub: getMarketingAdornActivityGoodsAdorn,
  fullMoneyDiscount: getMarketingAdornActivityGoodsAdorn,
  giveProduct: getMarketingAdornActivityGoodsAdorn,
  giveCoupon: getMarketingAdornActivityGoodsAdorn,
  morePiece: getMarketingAdornActivityGoodsAdorn,
  combination: getMarketingAdornActivityGoodsAdorn,
  groupPurchase: getMarketingAdornActivityGoodsAdorn,
  bargain: getMarketingAdornActivityGoodsAdorn,
  secKill: getMarketingAdornActivityGoodsAdorn,
  fullSwap: getMarketingAdornActivityGoodsAdorn,
  buySwap: getMarketingAdornActivityGoodsAdorn,
  preSale: getMarketingAdornActivityGoodsAdorn,
  setMeal: getMarketingAdornActivityGoodsAdorn,
  attempt: getMarketingAdornActivityGoodsAdorn,
  suggestProductItem: getMarketingAdornActivityGoodsAdorn,
}

const DEFAULT_RES = []
const COMMON_FORMAT = ({ code, data }) => {
  if (code === 1000) {
    return data
  }
  return DEFAULT_RES
}
/**
 * 请求后处理
 */
const afterRequestFormat = {
  coupon: COMMON_FORMAT,
  hot: COMMON_FORMAT,
  specialOffer: COMMON_FORMAT,
  plummet: COMMON_FORMAT,
  discount: COMMON_FORMAT,
  fullQuantitySub: COMMON_FORMAT,
  fullQuantityDiscount: COMMON_FORMAT,
  fullMoneySub: COMMON_FORMAT,
  fullMoneyDiscount: COMMON_FORMAT,
  giveProduct: COMMON_FORMAT,
  giveCoupon: COMMON_FORMAT,
  morePiece: COMMON_FORMAT,
  combination: COMMON_FORMAT,
  groupPurchase: COMMON_FORMAT,
  bargain: COMMON_FORMAT,
  secKill: COMMON_FORMAT,
  fullSwap: COMMON_FORMAT,
  buySwap: COMMON_FORMAT,
  preSale: COMMON_FORMAT,
  setMeal: COMMON_FORMAT,
  suggestProductItem: COMMON_FORMAT,
}

const title = {
  top: '广告图',
  coupon: `优惠券`,
  hot: `热门推荐`,
  suggestProduct: `自定义区块`,
}

function useGetWebLayout(type: 'preview' | 'edit') {
  const { id } = usePageStatus()
  const [detail, setDetail] = useState<DetailType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchMallInfo = async (shopId: number) => {
    const param: any = {
      id: shopId,
    }
    const res = await getCommodityShopDetails(param)
    if (res.code === 1000) {
      return res.data
    }
    return undefined
  }

  useEffect(() => {
    let isValid = true
    async function fetchData() {
      setLoading(true)
      const { code, data } = await getMarketingWebActivityPageGet({ id: id })
      if (!isValid) {
        return
      }
      setLoading(false)
      if (code === 1000) {
        const mallInfo = await fetchMallInfo(data.shopId)
        const isEmptyObject = Object.keys(data.adornContent).length === 0
        const tempData = {
          ...data,
          ...mallInfo,
          adornContent: isEmptyObject ? DEFAULT_DATA : data.adornContent,
        }
        // setDetail(isEmptyObject ? DEFAULT_DATA : data as unknown as DetailType);
        setDetail(tempData as unknown as DetailType)
      }
    }
    if (type !== 'preview') {
      fetchData()
    } else {
      setDetail({
        adornContent: DEFAULT_DATA,
      })
    }

    return () => {
      isValid = false
    }
  }, [id])

  /** 设置pageConfig */
  useEffect(() => {
    if (!detail) {
      return
    }
    console.log(detail)
    /** @review 该方法需要优化，因为suggestProduct 写多了一遍 */
    async function setData() {
      setLoading(true)
      const { adornContent } = detail!
      const themeStyle = adornContent.themeStyle
      let startKey = 0
      const firstChildKeys: string[] = []
      let pageConfig = {}
      /** 未排序数组 */
      const dataSourceList: { key: keyof typeof adornContent; sort: number }[] = []
      Object.keys(adornContent).map((_item: keyof typeof adornContent) => {
        dataSourceList.push({
          key: _item,
          sort: adornContent[_item].sort,
        })
      })
      const sortedList = dataSourceList.sort((a, b) => a.sort - b.sort).filter((_item) => _item.key !== 'themeStyle')
      for (const _row of sortedList) {
        startKey = startKey + 1
        firstChildKeys.push(startKey.toString())
        const target = adornContent[_row.key]
        const currentProps = target.props
        const childrenData = currentProps.childrenData || []
        const props =
          _row.key === 'top'
            ? {
                imageUrl: currentProps.imageUrl,
                visible: currentProps.visible ?? true,
              }
            : {
                visible: currentProps.visible ?? true,
                theme: currentProps.theme || 0,
                title: currentProps.title,
              }
        const suggestProductSonProps =
          _row.key === 'suggestProduct'
            ? {
                childComponentName: `WebCommodity`,
                hideAction: true,
                addBtnText: '添加商品节点',
                childProps: {
                  otherProps: {
                    type: `suggestProductItem`,
                  },
                },
              }
            : {}
        const childPropsData =
          _row.key === 'top'
            ? {}
            : {
                childComponentName: `${CHILD_COMPONENT_NAME[_row.key]}`,
                addBtnText: '添加子节点',
                childProps: {
                  otherProps: {
                    type: _row.key === 'suggestProduct' ? 'suggestProduct' : `${_row.key}Item`,
                  },
                  ...suggestProductSonProps,
                },
              }
        let tempConfig: any = {
          hideAction: true,
          componentName: COMPONENT_NAME[_row.key],
          title: title[_row.key] || currentProps.title,
          props: {
            ...props,
          },
          otherProps: {
            type: _row.key,
          },
          canDelete: false,
          ...childPropsData,
          childNodes: [],
        }
        const childNodesKeys: string[] = []
        if (childrenData.length > 0 && _row.key !== 'suggestProduct') {
          const formatedData = formatData[_row.key]?.(childrenData.filter(Boolean))
          const length =
            typeof formatedData.ids !== 'undefined' ? formatedData?.ids?.length : formatedData?.couponList.length
          if (length > 0) {
            const requestData = await service[_row.key]?.(formatedData, { ctlType: 'none' })
            const afterRequestFormatedData = afterRequestFormat[_row.key]?.(requestData)
            for (let _index = 0; _index < afterRequestFormatedData.length; _index++) {
              const _item = afterRequestFormatedData[_index]
              const keyNum = `${startKey}-${_index + 1}`
              childNodesKeys.push(keyNum)
              const sonConfig = {
                componentName: `${CHILD_COMPONENT_NAME[_row.key]}`,
                title: _item?.productName || _item.name,
                props: {
                  ..._item,
                },
                otherProps: {
                  type: `${_row.key}Item`,
                },
                childNodes: [],
              }
              pageConfig[keyNum] = sonConfig
            }
          }
        } else if (_row.key === 'suggestProduct') {
          // const suggestDataKeys: string[] = [];
          let _index = 0
          for (const _item of childrenData) {
            const keyNum = `${startKey}-${++_index}`
            childNodesKeys.push(keyNum)
            const suggestConfig = {
              componentName: 'WebCommodityContainer',
              title: _item.title,
              props: {
                title: _item.title,
                theme: _item.theme,
              },
              otherProps: {
                type: _row.key,
              },
              childNodes: [],
              childComponentName: `WebCommodity`,
              addBtnText: '添加子节点',
              childProps: {
                otherProps: {
                  type: `suggestProductItem`,
                },
              },
            }
            const suggestSonKeys: string[] = []
            if (_item.childrenData?.length > 0) {
              const requestData = await service.suggestProductItem?.({
                ids: _item.childrenData.map((_u: { id: number }) => _u.id).join(','),
              } as any)
              const arrayToMapData = arrayToMap<{ id: string; label?: string }>(_item.childrenData, 'id')
              const afterRequestFormatedData = afterRequestFormat.suggestProductItem?.(requestData)
              for (let _itemIndex = 0; _itemIndex < afterRequestFormatedData.length; _itemIndex++) {
                const sonKeyNum = `${keyNum}-${_itemIndex + 1}`
                suggestSonKeys.push(sonKeyNum)
                const sonConfig = {
                  componentName: `WebCommodity`,
                  title: _item?.productName || _item.name,
                  props: {
                    ..._item,
                    label: arrayToMapData[_item.id]?.label,
                  },
                  otherProps: {
                    type: `suggestProductItem`,
                  },
                  childNodes: [],
                }
                pageConfig[sonKeyNum] = sonConfig
              }
            }
            pageConfig[keyNum] = {
              ...suggestConfig,
              childNodes: suggestSonKeys,
            }
          }
          // childNodesKeys
        }

        tempConfig = {
          ...tempConfig,
          childNodes: childNodesKeys,
        }
        pageConfig[startKey] = tempConfig
      }
      pageConfig = {
        0: {
          componentName: 'WebLayout',
          title: '组件树',
          props: {
            backgroundColor: themeStyle?.props.color,
            logo: detail?.logoUrl,
          },
          childNodes: firstChildKeys,
        },
        ...pageConfig,
      }
      setLoading(false)
      console.log('pageConfig', pageConfig)
      updatePageConfig(pageConfig)
    }
    setData()
  }, [detail])
  return { detail, loading }
}

export default useGetWebLayout
