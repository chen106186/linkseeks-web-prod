import { useMemo } from 'react'
import { useSelector } from '@apps/design-react'

type ActivityProductData = {
  id: number
  activityId: number
}
/**
 * 格式化props
 * 这里的@key 对应的是pageConfig 下的dataIndex
 */
const formatProps = {
  coupon: (_props: { id: number }) => _props.id,
  /** 活动热荐 */
  hot: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  specialOffer: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 直降促销 */
  plummet: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 折扣促销 */
  discount: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 满量促销--满量减 */
  fullQuantitySub: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 满量促销--满量折 */
  fullQuantityDiscount: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 满额促销--满额减 */
  fullMoneySub: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 满额促销--满额折 */
  fullMoneyDiscount: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 赠送促销--赠送商品(满额赠+买商品赠) */
  giveProduct: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 赠送促销--赠送优惠券(满额赠+买商品赠)*/
  giveCoupon: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 多件促销 */
  morePiece: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 组合促销 */
  combination: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 拼团 */
  groupPurchase: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 砍价 */
  bargain: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 秒杀 */
  secKill: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 换购-满额换购 */
  fullSwap: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 换购-买商品换购 */
  buySwap: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 预售 */
  preSale: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 套餐 */
  setMeal: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
  /** 试用 */
  attempt: (_props: ActivityProductData) => `${_props.id}_${_props.activityId}`,
}

type OptionsType = {
  isWeb: boolean
}

const useGetSameKeys = (options?: OptionsType) => {
  const { isWeb = false } = options || {}
  const { pageConfig } = useSelector<any, any>(['pageConfig'])
  // console.log('pageConfigpageConfigpageConfig', pageConfig)
  const sameKeys = useMemo(() => {
    if (pageConfig === null || Object.keys(pageConfig).length === 0) {
      return {}
    }
    const result = {}
    const childrenNode = pageConfig?.[0]?.childNodes
    if (childrenNode?.length === 0) {
      return {}
    }
    childrenNode.forEach((_nodeKey) => {
      const element = pageConfig[_nodeKey]
      if (!element) {
        return
      }
      // const { dataIndex, childNodes, otherProps: { type } } = element;
      const {
        childNodes,
        otherProps: { type },
      } = element
      const dataIndex = type

      /** 活动广告图 直接跳过 */
      if (dataIndex === 'top') {
        return
      }
      if (dataIndex !== 'suggestProduct' && typeof result[dataIndex] === 'undefined') {
        result[dataIndex] = []
      }

      // web装修页面不走这个，因为 web装修页面只有一层
      // web商城走 下边的逻辑
      if (dataIndex === 'combination' && !isWeb) {
        /** combination 单独处理， 这里不使用递归了 */
        childNodes?.forEach((_son, _index) => {
          const sonElement = pageConfig[_son]
          result[`combination_${_index}`] = []
          sonElement?.childNodes?.forEach((_row) => {
            const rowData = pageConfig[_row]
            result[`combination_${_index}`].push(`${rowData?.props?.id}_${rowData?.props?.activityId}`)
          })
        })
        return
      }

      if (dataIndex !== 'suggestProduct') {
        childNodes?.forEach((_son) => {
          const sonElement = pageConfig[_son]
          const formatedData = formatProps[dataIndex]?.(sonElement?.props || {})
          if (formatProps) {
            result[dataIndex].push(formatedData)
          }
        })
        return
      }
      /** 对suggestProduct 单独处理， 这里不使用递归了 */
      childNodes?.forEach((_son, _index) => {
        const sonElement = pageConfig[_son]
        result[`suggestProduct_${_index}`] = []
        sonElement?.childNodes?.forEach((_row) => {
          const rowData = pageConfig[_row]
          result[`suggestProduct_${_index}`].push(`${rowData?.props?.id}_${rowData?.props?.activityId}`)
        })
      })
    })
    return result
  }, [pageConfig])

  return { sameKeys }
}

export default useGetSameKeys
