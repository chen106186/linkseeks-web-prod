import React, { useEffect, useState } from 'react'
import { omit } from 'lodash'
import { message } from 'antd'
import { updatePageConfig } from '@apps/design-react'
import DEFAULT_DATA from '../mock/index.json'
import { getMarketingWebActivityPageGet, GetMarketingWebActivityPageGetResponse } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import { arrayToMap } from '@/utils'
import { getMarketingAdornActivityGoodsAdorn, postMarketingCouponPlatformActivityPageSelectDetail } from '@apps/apis'
import { ACTIVITY_LIST } from '@/constants/const/activity'

type DataSourceItemType = {
  sort: number
  dataIndex: string
  props: {
    theme?: 0 | 1 | (2 & number)
    visible: boolean
    childrenData?: any[]
  } & {
    [propKeys: string]: any
  }
}
type DataSourceType = {
  [key: string]: DataSourceItemType
}
type DetailType = Omit<GetMarketingWebActivityPageGetResponse, 'adornContent'> & {
  adornContent: DataSourceType
}

/** key 对应组件名 */
const COMPONENT_NAME = {
  top: 'Advertisement',
  coupon: 'Coupon',
  hot: 'CommodityWithProcess',
  specialOffer: 'CommodityList',
  plummet: 'CommodityList',
  discount: 'CommodityList',
  fullQuantitySub: 'CommodityList',
  fullQuantityDiscount: 'CommodityList',
  fullMoneySub: 'CommodityList',
  fullMoneyDiscount: 'CommodityList',
  giveProduct: 'CommodityList',
  giveCoupon: 'CommodityList',
  morePiece: 'CommodityList',
  combination: 'CommodityList',
  groupPurchase: 'CommodityList',
  bargain: 'CommodityList',
  secKill: 'CommodityList',
  fullSwap: 'CommodityList',
  buySwap: 'CommodityList',
  preSale: 'CommodityList',
  setMeal: 'CommodityList',
  attempt: 'CommodityList',
  suggestProduct: 'WrapCommodityList',
}

/** key 对应子节点ComponentName */
const CHILD_COMPONENT_NAME = {
  coupon: 'Coupon.Item',
  hot: 'CommodityWithProcess.Item',
  specialOffer: 'CommodityList.Item',
  plummet: 'CommodityList.Item',
  discount: 'CommodityList.Item',
  fullQuantitySub: 'CommodityList.Item',
  fullQuantityDiscount: 'CommodityList.Item',
  fullMoneySub: 'CommodityList.Item',
  fullMoneyDiscount: 'CommodityList.Item',
  giveProduct: 'CommodityList.SwapProduct',
  giveCoupon: 'CommodityList.SwapCoupon',
  morePiece: 'CommodityList.Item',
  combination: 'Combination',
  groupPurchase: 'CommodityList.Item',
  bargain: 'CommodityList.Item',
  secKill: 'CommodityList.FlashSale',
  fullSwap: 'CommodityList.Item',
  buySwap: 'CommodityList.Item',
  preSale: 'CommodityList.Item',
  setMeal: 'CommodityList.CommodityTab',
  attempt: 'CommodityList.Item',
  suggestProduct: 'CommodityList',
}

const title = {
  top: '广告图',
  coupon: '优惠券',
  hot: '活动推荐',
}

type ComponentConfigType<T = any> = {
  props: T
  title: string
  componentName: string
  otherProps: {
    /** 组件类型， 做区别用， 可以用组件名 */
    type: string
  }
  childNodes: string[]
  rest?: any
}

const createComponentConfig = ({ props, title, componentName, otherProps, childNodes, rest }: ComponentConfigType) => {
  return {
    componentName: componentName,
    title: title,
    props: props,
    otherProps: otherProps,
    childNodes: childNodes,
    ...rest,
  }
}

type ComponentParamsType = {
  /** 组件名， 数组的一项代表的是递归深度所创建的component */
  componentName: string[]
  /**
   * 如果childrenDataItem 包含childrenData 且为数组，那么符合进入递归条件
   * 两种表示方式 [1, 2, 3] 活动商品id，
   * [
   *  {title: string, childrenData: [1,2,3]}
   * ]
   * */
  childrenData: any[]
  /** 这是活动商品或者是优惠券请求回来的数据， 已经做key/value 转换对应 */
  dataSource: any
  /** 生成pageConfig 的startKey, 1 / 1-1 这样表示， 递归会变成 1-1-1 */
  startKey: string | number
  /** 主键， childrenData[i][primaryKey],  */
  primaryKey: string | null
  otherProps: {
    /** 组件类型， 做区别用， 可以用组件名 */
    type: string
  }[]
  /** 用于给suggestProduct， 添加label用 */
  specialKey: string | null
  /** suggestProduct 的label */
  labels: any
}

/** 根据childrenData 递归创建子元素 */
const createComponent = ({
  componentName,
  childrenData,
  startKey,
  dataSource,
  primaryKey,
  otherProps,
  specialKey,
  labels,
}: ComponentParamsType) => {
  const childNodesKeys: string[] = []
  let result = {}
  const floor = `${startKey}`.split('-').length
  for (let i = 0; i < childrenData.length; i++) {
    const keyNum = `${startKey}-${i + 1}`
    const current = childrenData[i]
    const isDept = typeof current.childrenData !== 'undefined' && Array.isArray(current.childrenData)
    let parentChildKeys: string[] = []
    let parentChildConfig = {}
    let configRest = {}
    console.log(isDept, 'isDept: ' + isDept)
    if (isDept) {
      const sonConfig = createComponent({
        componentName,
        childrenData: current.childrenData.filter(Boolean),
        startKey: keyNum,
        dataSource,
        primaryKey,
        otherProps,
        specialKey,
        labels,
      })
      parentChildKeys = sonConfig.keys
      parentChildConfig = sonConfig.config
      configRest = {
        childComponentName: componentName[floor],
        addBtnText: '添加子节点',
        childProps: {
          otherProps: otherProps[floor],
        },
      }
    }
    const key = primaryKey ? current[primaryKey] : current
    childNodesKeys.push(keyNum)
    let childProps = dataSource[key]
    const [startString, ...rest] = keyNum.split('-')
    const config = createComponentConfig({
      componentName: componentName[floor - 1],
      title: childProps?.name || childProps?.productName || `子集${keyNum}`,
      props: isDept
        ? omit(current, ['childrenData'])
        : specialKey && specialKey === otherProps[floor - 1].type
        ? { label: labels[`${rest.join('-')}-${childProps.id}`] || [], ...childProps }
        : childProps,
      otherProps: otherProps[floor - 1],
      childNodes: parentChildKeys,
      rest: configRest,
    })
    result = {
      ...result,
      [keyNum]: config,
      ...parentChildConfig,
    }
  }
  return { config: result, keys: childNodesKeys }
}

function useGetLayout(type: 'preview' | 'edit') {
  const { id } = usePageStatus()
  const [detail, setDetail] = useState<DetailType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

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
        const isEmptyObject = Object.keys(data.adornContent).length === 0
        console.log(DEFAULT_DATA)
        const tempData = {
          ...data,
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
      const themeStyle = adornContent['themeStyle']
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
      /** 优惠券请求体 */
      const couponRequestData = adornContent.coupon.props.childrenData || []
      /** 获取自定义区域请求体 */
      const customizeAreaRequestData =
        adornContent!.suggestProduct!.props?.childrenData?.reduce(
          (prev, next, _index) => {
            const labelsWithId = {}
            const result = next.childrenData?.map((_item, _key) => {
              labelsWithId[`${_index + 1}-${_key + 1}-${_item.id}`] = _item.label
              return _item.id
            })
            prev = {
              ids: [...prev.ids, ...result],
              labelsWithId: labelsWithId,
            }
            return prev
          },
          { ids: [], label: {} },
        ) || []
      /** 获取组合促销请求体 */
      const combinationRequestData =
        adornContent.combination?.props?.childrenData?.reduce((prev, next, _index) => {
          prev = [...prev, ...(next.childrenData || [])]
          return prev
        }, []) || []
      /** 获取其他活动的请求体 */
      const activityRequestData =
        Object.keys(adornContent).reduce((all: any, _item) => {
          if (ACTIVITY_LIST.includes(_item as any) && _item !== 'combination') {
            all = [...all, ...((adornContent[_item] as any)?.props?.childrenData.filter(Boolean) || [])]
          }
          return all
        }, []) || []

      const getCouponData = async (couponData) => {
        if (couponData.length === 0) {
          return []
        }
        const formated = couponData.map((_item) => ({
          belongType: _item.type,
          couponId: _item.id,
        }))

        const { code, data } = await postMarketingCouponPlatformActivityPageSelectDetail({ couponList: formated })
        message.destroy()
        return data
      }

      const getActivityData = async (datas) => {
        // 没有活动数据不做请求，一般出现在新增装修页面
        if (!datas || !datas.length) {
          return []
        }
        const { code, data } = await getMarketingAdornActivityGoodsAdorn({ ids: datas.join(',') })
        return data
      }

      const getResponseData = await Promise.all([
        getCouponData(couponRequestData),
        getActivityData(
          Array.from(new Set([...customizeAreaRequestData.ids, ...activityRequestData, ...combinationRequestData])),
        ),
      ])
      const activityDataResponse = arrayToMap(getResponseData[1] || [], 'id')
      const couponResponseData = arrayToMap(getResponseData[0] || [], 'id')

      for (const _row of sortedList) {
        startKey = startKey + 1
        firstChildKeys.push(startKey.toString())
        const target = adornContent[_row.key]
        const currentProps = target.props
        const childrenData = currentProps.childrenData || []
        /** 当前组件的props */
        let props = {}
        /** 设置左边菜单栏 属性，是否允许隐藏，是否允许删除，添加子节点信息等等 */
        let sideControllerData = {}
        /** 点击左侧菜单添加按钮时， 创建子节点的组件信息 */
        let childrenComponentInfo = {}

        /** 如果为顶部活动图 */
        if (_row.key === 'top') {
          props = {
            imageUrl: currentProps.imageUrl,
            visible: currentProps.visible ?? true,
          }
        } else {
          /** 优惠券，活动等等 */
          props = {
            /** 是否显示 */
            status: currentProps.visible ?? true,
            visible: currentProps.visible ?? true,
            theme: currentProps.theme || 0,
            title: currentProps.title,
          }
          /** 第三层节点信息 */
          let thirdFloorData = {}
          if (_row.key === 'suggestProduct') {
            thirdFloorData = {
              hideAction: true,
              childComponentName: `CommodityList.Item`,
              addBtnText: `添加商品节点`,
              childProps: {
                otherProps: {
                  type: `suggestProductItem`,
                },
              },
            }
          } else if (_row.key === 'combination') {
            thirdFloorData = {
              hideAction: true,
              childComponentName: `Combination.Item`,
              addBtnText: `添加组合促销商品`,
              childProps: {
                otherProps: {
                  type: `combinationItem`,
                },
              },
            }
          }
          /** 组件类型，selectInfo 时判断显示的装修类容 */
          const otherPropsType =
            _row.key === 'suggestProduct'
              ? 'suggestProduct'
              : _row.key === 'combination'
              ? 'combinationItemProduct'
              : `${_row.key}Item`

          /** 点击左侧菜单添加按钮时， 创建子节点的组件信息 */
          childrenComponentInfo = {
            /** 儿子组件 */
            childComponentName: `${CHILD_COMPONENT_NAME[_row.key]}`,
            addBtnText: `添加子节点`,
            childProps: {
              otherProps: {
                type: otherPropsType,
              },
              ...thirdFloorData,
            },
          }
        }
        /** 设置左边菜单栏属性 */
        sideControllerData = {
          hideAction: true,
          /** 当前组件名， 需要注册schema， 以及组件 */
          componentName: COMPONENT_NAME[_row.key],
          title: title[_row.key] || currentProps.title,
          props: props,
          otherProps: {
            type: _row.key,
          },
          canDelete: false,
          childNodes: [],
          ...childrenComponentInfo,
        }
        // 创建当前组件内容
        pageConfig[startKey] = sideControllerData

        /** 创建子节点信息 */
        let childNodesKeys: string[] = []

        if (childrenData.length === 0) {
          continue
        }

        if (_row.key === 'coupon') {
          const { config, keys } = createComponent({
            componentName: [`${CHILD_COMPONENT_NAME[_row.key]}`],
            childrenData: childrenData.filter(Boolean),
            startKey: startKey,
            dataSource: couponResponseData,
            primaryKey: 'id',
            otherProps: [
              {
                type: `${_row.key}Item`,
              },
            ],
            specialKey: null,
            labels: {},
          })
          childNodesKeys = [...childNodesKeys, ...keys]
          pageConfig = {
            ...pageConfig,
            ...config,
          }
        } else if (_row.key === 'combination') {
          // 组合促销时
          const { config, keys } = createComponent({
            componentName: [`Combination`, `Combination.Item`],
            childrenData: childrenData.filter(Boolean),
            startKey: startKey,
            dataSource: activityDataResponse,
            primaryKey: null,
            otherProps: [{ type: `combinationItemProduct` }, { type: `${_row.key}Item` }],
            specialKey: null,
            labels: {},
          })
          childNodesKeys = [...childNodesKeys, ...keys]
          pageConfig = {
            ...pageConfig,
            ...config,
          }
        } else if (_row.key !== 'suggestProduct') {
          const { config, keys } = createComponent({
            componentName: [`${CHILD_COMPONENT_NAME[_row.key]}`],
            childrenData: childrenData.filter(Boolean),
            startKey: startKey,
            dataSource: activityDataResponse,
            primaryKey: null,
            otherProps: [
              {
                type: `${_row.key}Item`,
              },
            ],
            specialKey: null,
            labels: {},
          })
          childNodesKeys = [...childNodesKeys, ...keys]
          pageConfig = {
            ...pageConfig,
            ...config,
          }
        } else {
          const { config, keys } = createComponent({
            componentName: [`CommodityList`, 'CommodityList.Item'],
            childrenData: childrenData.filter(Boolean),
            startKey: startKey,
            dataSource: activityDataResponse,
            primaryKey: 'id',
            otherProps: [{ type: `${_row.key}` }, { type: `${_row.key}Item` }],
            specialKey: `${_row.key}Item`,
            labels: customizeAreaRequestData.labelsWithId,
          })
          childNodesKeys = [...childNodesKeys, ...keys]
          pageConfig = {
            ...pageConfig,
            ...config,
          }
        }
        pageConfig[startKey].childNodes = childNodesKeys
      }
      pageConfig = {
        0: {
          componentName: 'MobileLayout',
          title: `组件树`,
          props: {
            backgroundColor: themeStyle?.props?.color || '#00A98F',
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

export default useGetLayout
