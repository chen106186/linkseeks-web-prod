import { useEffect, useState } from 'react'
import { updatePageConfig } from '@apps/design-react'
import DEFAULT_DATA from '../mock/web'
import type { GetMarketingWebActivityPageGetResponse } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import { arrayToMap } from '@/utils'
import { getMarketingAdornActivityGoodsAdorn, postMarketingCouponActivityPageSelectDetail } from '@apps/apis'
import { getCommodityShopDetails, getMarketingWebActivityPageGet } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

/**
 * TODO 往后会修改改 useGetLayout 一样，因为pc组合促销没搞，先这样
 */

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

/** 请求前处理 */
const formatData = {
  coupon: (data: { id: number; type: 1 | 2 | (number & { label: string }) }[]) => {
    return {
      couponList:
        data && data.length > 0
          ? data.map((_item) => ({
              belongType: _item.type,
              couponId: _item.id,
            }))
          : [],
    }
  },
  hot: (data: number[]) => ({ ids: data?.join(',') }),
  specialOffer: (data: number[]) => ({ ids: data?.join(',') }),
  plummet: (data: number[]) => ({ ids: data?.join(',') }),
  discount: (data: number[]) => ({ ids: data?.join(',') }),
  fullQuantitySub: (data: number[]) => ({ ids: data?.join(',') }),
  fullQuantityDiscount: (data: number[]) => ({ ids: data?.join(',') }),
  fullMoneySub: (data: number[]) => ({ ids: data?.join(',') }),
  fullMoneyDiscount: (data: number[]) => ({ ids: data?.join(',') }),
  giveProduct: (data: number[]) => ({ ids: data?.join(',') }),
  giveCoupon: (data: number[]) => ({ ids: data?.join(',') }),
  morePiece: (data: number[]) => ({ ids: data?.join(',') }),
  combination: (data: number[]) => ({ ids: data?.join(',') }),
  groupPurchase: (data: number[]) => ({ ids: data?.join(',') }),
  bargain: (data: number[]) => ({ ids: data?.join(',') }),
  secKill: (data: number[]) => ({ ids: data?.join(',') }),
  fullSwap: (data: number[]) => ({ ids: data?.join(',') }),
  buySwap: (data: number[]) => ({ ids: data?.join(',') }),
  preSale: (data: number[]) => ({ ids: data?.join(',') }),
  setMeal: (data: number[]) => ({ ids: data?.join(',') }),
  attempt: (data: number[]) => ({ ids: data?.join(',') }),
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
  coupon: postMarketingCouponActivityPageSelectDetail,
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
  top: `${intl.formatMessage({ id: 'marketingAbility.guanggaotu' })}`,
  coupon: `${intl.formatMessage({ id: 'marketingAbility.youhuiquan' })}`,
  hot: `${intl.formatMessage({ id: 'marketingAbility.huodongtuijian' })}`,
  suggestProduct: `${intl.formatMessage({ id: 'marketingAbility.zidingyiquyu' })}`,
}

function useGetWebLayout() {
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
      const { code, data } = await getMarketingWebActivityPageGet({ id: id as string })
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
    fetchData()
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
                addBtnText: `${intl.formatMessage({
                  id: 'marketingAbility.tianjiashangpinjiedian',
                })}`,
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
                addBtnText: `${intl.formatMessage({ id: 'marketingAbility.tianjiazijiedian' })}`,
                childProps: {
                  otherProps: {
                    type: _row.key === 'suggestProduct' ? 'suggestProduct' : `${_row.key}Item`,
                  },
                  ...suggestProductSonProps,
                },
              }
        let tempConfig = {
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
              addBtnText: `${intl.formatMessage({ id: 'marketingAbility.tianjiazijiedian' })}`,
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
              // console.log(requestData, _item.childrenData, arrayToMapData);
              const afterRequestFormatedData = afterRequestFormat.suggestProductItem?.(requestData)
              // console.log(afterRequestFormatedData, arrayToMapData);
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
          title: `${intl.formatMessage({ id: 'marketingAbility.zujianshu' })}`,
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
