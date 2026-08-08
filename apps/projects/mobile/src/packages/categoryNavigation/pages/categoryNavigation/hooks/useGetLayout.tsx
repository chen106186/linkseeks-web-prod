import React, { useEffect, useState, useMemo } from 'react'
import { arrayToMap } from '@/utils'
import { getCommodityAdornManageFind, GetCommodityAdornManageFindResponse } from '@apps/apis'

import { CurrentCityType } from '@/store/locationStore/model'
import {
  getMarketingAdornActivityGoodsAdorn,
  GetMarketingAdornActivityGoodsAdornResponse,
  getMarketingAdornGoodsListAdorn,
  GetMarketingAdornGoodsListAdornResponseDetail,
  getMarketingMobileActivityGoodsAreaAdorn,
  GetMarketingMobileActivityGoodsAreaAdornResponseDetail,
} from '@apps/apis'
import {
  getProductCommodityTemplateGetBrandList,
  GetProductCommodityTemplateGetBrandListResponseDetail,
} from '@apps/apis'

type SecondaryType = {
  id: number
  icon: string
  name: string
}
type CategoryAdornContent = {
  style: number
  category: TabItemType[]
}

type TabItemType = {
  id: number
  name: string
  visible: boolean
  children: {
    secondary: {
      title: string
      children: SecondaryType[]
      sort: number
    }
    flashSale: {
      title: string
      visible?: boolean
      children: number[]
      sort: number
    }
    saleRanking: {
      visible: boolean
      title: string
      sort: number
      children: {
        id: number
        sale: string
      }[]
    }
    brand: {
      visible: boolean
      title: string
      sort: number
      children: number[]
    }
    suggestProduct: {
      visible: boolean
      title: string
      /** 1 => 按销量排序， 2 =》 按上架时间排序， 3 => 自定义 */
      type: 1 | 2 | 3
      /** 展示数量， 默认50 */
      num: number
      sort: number
      children: {
        id: number
        label: string[]
      }[]
    }
  }
}

type TabPostData = {
  secondary: SecondaryType[]
  flashSale: number[]
  saleRanking: {
    id: number
    sale: string
  }[]
  brand: number[]
  suggestProduct: {
    id: number
    label: string[]
  }[]
}

type PostDataType = {
  flashSale: number[]
  brand: number[]
  saleRanking: number[]
  suggestProduct: {
    children: number[]
    num: number
    type: 1 | 2 | 3
  }
}

export type HasRequestTabPaneDataType = {
  id: number
  content: {
    secondary: SecondaryType[]
    flashSale: GetMarketingAdornActivityGoodsAdornResponse
    saleRanking: (GetMarketingAdornGoodsListAdornResponseDetail & {
      sale: number
    })[]
    brand: GetProductCommodityTemplateGetBrandListResponseDetail[]
    suggestProduct: (GetMarketingMobileActivityGoodsAreaAdornResponseDetail & {
      label: string[]
    })[]
    suggestProductNoMore?: boolean
  }
}

/** 根据销量排行 */
const ACCORDING_TO_SALE = 1
/** 根据时间排 */
const ACCORDING_TO_TIME = 2
/** 自定义 */
const ACCORDING_TO_CUSTOM = 3

type OptionsType = {
  id?: number
  shopId: number
  /** 默认选中的品类 */
  categoryId?: number
  /** 是否是自营商城，与渠道商城互斥 */
  isSelfMall?: boolean
  selfInfo?: {
    memberId: number
    roleId: number
  }
  currentCity: CurrentCityType
  /** 设计缺陷， 如果是自营商城，那么有个父级shopid， 这个id 是用来请求装修内容的。。。所以如果是自营商城的话，shopId 跟 selfMallShopId 有点不同 */
  selfMallShopId: number
}

function useGetLayout(id: number, options: OptionsType) {
  const [info, setInfo] = useState<GetCommodityAdornManageFindResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  /** tab页loading */
  const [tabContentLoading, setTabContentLoading] = useState<boolean>(true)
  /** 已经请求过的tabpane 数据  */
  const [hasRequestTabPaneData, setHasRequestTabPaneData] = useState<HasRequestTabPaneDataType[]>([])
  /** 目前处于高亮的tab */
  const [activeTabKey, setActiveTabKey] = useState<string>('0')
  /** 分页loading */
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  /** 下拉刷新 */
  const [refresh, setRefresh] = useState<boolean>(false)

  useEffect(() => {
    if (!id) {
      return
    }

    async function getLayout() {
      setLoading(true)
      // eslint-disable-next-line no-nested-ternary
      const services = getCommodityAdornManageFind
      try {
        const { data, code } = await services({ adornId: id.toString() } as any)

        if (code === 1000) {
          setInfo(data)
        }
      } finally {
        setLoading(false)
      }
    }
    getLayout()
  }, [])

  /* 保存标签也的props, 还有需要提交的数据 */
  const data = useMemo(() => {
    if (info === null) {
      return {
        postData: [],
        tabs: [],
      }
    }

    const categoryAdornContent: CategoryAdornContent = info.categoryAdornContent as unknown as CategoryAdornContent
    const { category = [] } = categoryAdornContent || {}

    const postData: { id: number; postData: TabPostData }[] = []
    const tabsList: { id: number; name: string; otherProps: any }[] = []
    /* TODO 后续改成for */
    category.forEach((_item: TabItemType, _index) => {
      const children = ['secondary', 'flashSale', 'saleRanking', 'brand', 'suggestProduct']
      const tabProps = {
        id: _item.id,
        name: _item.name,
        otherProps: {},
      }
      const tabObject: { id: number; postData: TabPostData } = {
        id: _item.id,
        postData: {} as TabPostData,
      }
      children.forEach((_child: string) => {
        const _childTarget = _item.children[_child as keyof TabItemType['children']]
        if (!_childTarget) {
          return
        }
        if ((_childTarget as any)?.status ?? true) {
          ;(tabObject.postData as any)[_child as keyof TabPostData] = _childTarget.children
        }
        ;(tabProps.otherProps as any)[_child as keyof TabPostData] = _childTarget
      })
      postData.push(tabObject)
      tabsList.push(tabProps)
    })
    return {
      postData,
      tabs: tabsList,
    }
  }, [info])

  /** 当获取到tabs时， 更新activeKey */
  useEffect(() => {
    if (data === null || data?.tabs?.length === 0) {
      return
    }
    if (typeof options.categoryId !== 'undefined') {
      onChange(options.categoryId.toString())
      return
    }
    onChange(data!.tabs[0].id.toString())
    // setActiveTabKey(data!.tabs[0].id.toString())
  }, [data, options.categoryId])

  /** 获取销量排行 */
  const getActivityProduct = async (ids: number[]) => {
    if (ids?.length === 0) {
      return null
    }
    return getMarketingAdornActivityGoodsAdorn({
      ids: ids.join(',') as any,
      provinceCode: options.currentCity?.provinceCode!,
      cityCode: options.currentCity?.cityCode,
    })
  }
  /** @toReview获取商品详情和获取品牌，传递复杂类型用get请求不太合理 */
  const getProduct = async (ids: number[]) => {
    if (ids?.length === 0) {
      return null
    }
    return getMarketingAdornGoodsListAdorn({
      idInList: ids.join(',') as any,
      shopId: options.shopId,
      current: 1,
      pageSize: ids.length,
      provinceCode: options.currentCity?.provinceCode!,
      cityCode: options.currentCity?.cityCode,
    } as any)
  }

  const getBrand = async (ids: number[]) => {
    if (ids?.length === 0) {
      return null
    }
    const postData = {
      idInList: ids.join(','),
      shopId: options.shopId,
      current: 1,
      pageSize: ids.length,
    }
    return getProductCommodityTemplateGetBrandList(postData as any)
  }

  const getSuggestProduct = async (
    paramsData: { num: number; type: 1 | 2 | 3 | (number & {}); children: { id: number }[] },
    tabId: string,
  ) => {
    const { num = 50, type = 1, children } = paramsData
    /** 自营商城需要加上自营商城的memberId, roleId, 渠道商城要加上memberId, 其余商城不需要 */
    // eslint-disable-next-line no-nested-ternary
    const otherProps = options.isSelfMall
      ? { memberId: options.selfInfo?.memberId, roleId: options.selfInfo?.roleId }
      : {}

    const common = {
      shopId: options.isSelfMall ? options.selfMallShopId : options.shopId.toString(),
      type,
      ...otherProps,
    }
    /** 如果器自营商城或者是渠道商城，那么他们用的是会员id，否则用平台id */
    const withCategoryId = options.isSelfMall ? { customerCategoryId: tabId } : { categoryId: tabId }
    /** 如果是自定义精选商品且没有设置childen，那么直接返回null， 再下一步再做处理 */
    if (type === ACCORDING_TO_CUSTOM && children.map((_item) => _item.id).filter(Boolean).length === 0) {
      return null
    }
    const requestData =
      type === ACCORDING_TO_CUSTOM
        ? {
            /** 这里idInlist 都要做join 一下 */
            idInList: children
              .map((_item) => _item.id)
              .filter(Boolean)
              .join(','),
            ...common,
            current: 1,
            pageSize: children.length,
          }
        : {
            ...common,
            ...withCategoryId,
            current: 1,
            pageSize: num < 10 ? num : '10',
          }
    const withAreaCodeRequest = {
      provinceCode: options.currentCity?.provinceCode,
      cityCode: options.currentCity?.cityCode,
      ...requestData,
    }
    return getMarketingMobileActivityGoodsAreaAdorn(withAreaCodeRequest as any)
  }

  const createPostData = (postData: PostDataType) => {
    const dataSourceMap = new Map()
    const result: PostDataType = {} as PostDataType
    Object.keys(postData).forEach((_item: any) => {
      dataSourceMap.set(_item, postData[_item as keyof PostDataType])
      if (['flashSale', 'brand'].includes(_item)) {
        result[_item as 'flashSale' | 'brand'] = postData[_item as 'flashSale']
      } else if (['saleRanking'].includes(_item)) {
        result[_item as 'saleRanking'] = postData[_item as 'saleRanking']?.map((_row: any) => _row.id)
      } else {
        result[_item] = postData[_item as keyof PostDataType]
      }
    })
    return {
      requestData: result,
      dataSourceMap,
    }
  }

  /** 并行请求 */
  const getAnyData = async (postData: PostDataType, tabId: string) => {
    const mapToAsync = {
      saleRanking: getProduct,
      suggestProduct: getSuggestProduct,
      // suggestProduct: getProduct,
      flashSale: getActivityProduct,
      brand: getBrand,
    }
    /** 这里去除掉隐藏的那个模块，不进行请求 */
    const sorted = ['flashSale', 'saleRanking', 'brand', 'suggestProduct'].filter((_item) => postData[_item])
    const queue: Promise<any>[] = sorted.map((_item) =>
      mapToAsync[_item as keyof typeof mapToAsync](postData[_item as keyof PostDataType] as any, tabId),
    )
    const result = await Promise.all(queue)
    const dataSourceRes: any = {}
    sorted.forEach((_item, index) => {
      if (_item === 'flashSale') {
        dataSourceRes[_item] = result[index]?.data || []
        return
      }
      /** 直接判断 */
      if (_item === 'suggestProduct') {
        const isEqualTotal = result[index]?.data?.data.length >= result[index]?.data?.totalCount
        dataSourceRes['suggestProductNoMore'] = [ACCORDING_TO_SALE, ACCORDING_TO_TIME].includes(
          postData['suggestProduct'].type,
        )
          ? result[index]?.data?.data.length >= postData['suggestProduct'].num || isEqualTotal
          : result[index]?.data?.data.length >= postData['suggestProduct'].children.length || isEqualTotal
      }
      dataSourceRes[_item] = result[index]?.data?.data || []
    })
    return dataSourceRes
  }

  /** 当切换tab 的时候， 请求数据, 修改他的里面的内容， */
  const onChange = async (tabId: string) => {
    if (tabId === activeTabKey) {
      return
    }
    setActiveTabKey(tabId)
    /** 判断是否有请求过数据，如果有直接返回 */
    const hasRequestData = hasRequestTabPaneData.find((_item: any) => _item.id === Number(tabId))
    if (hasRequestData) {
      return
    }
    const currentTab = data?.postData.find((_item: any) => _item.id === Number(tabId))
    const activeTabOtherProps = data.tabs.find((_item: any) => _item.id === Number(tabId))
    const withSuggestProduct =
      activeTabOtherProps?.otherProps.suggestProduct.status ?? true
        ? { suggestProduct: activeTabOtherProps?.otherProps.suggestProduct }
        : {}

    const { requestData, dataSourceMap } = createPostData({ ...currentTab!.postData, ...withSuggestProduct } as any)
    const saleRankingListToMap = arrayToMap<{ id: number; sale: number }, 'id'>(
      dataSourceMap.get('saleRanking') || [],
      'id',
    )
    const suggestProductToMap = arrayToMap<{ id: number; label: string[] }, 'id'>(
      dataSourceMap.get('suggestProduct')?.['children'] || [],
      'id',
    )
    setTabContentLoading(true)
    const res = await getAnyData(requestData, tabId)
    const keyToValue = {
      suggestProduct: 'label',
      saleRanking: 'sale',
    }
    const finalData: { [key: string]: any } = {
      suggestProductNoMore: true,
    }
    Object.keys(res).forEach((_item) => {
      if (_item === 'saleRanking' || _item === 'suggestProduct') {
        finalData[_item] = res[_item].map((_row: any, _rowIndex: number) => {
          const sourceProps = _item === 'saleRanking' ? saleRankingListToMap : suggestProductToMap

          return {
            ..._row,
            /** 设置自定义的销量还有标签， 如果是saleRanking设置销量 sale: 1000， 如果是 suggestProduct， 设置label: ["test"] */
            [keyToValue[_item]]:
              (sourceProps[_row.id as number] as any)?.[keyToValue[_item]] || (_item === 'saleRanking' ? 0 : []),
          }
        })
        /** 排序, 这里的sale 是字符串，测试提了bug，但感觉不对 */
        if (_item === 'saleRanking') {
          finalData[_item].sort((a, b) => Number(b.sale) - Number(a.sale))
        }
      } else {
        finalData[_item] = res[_item]
      }
    })
    const resultDataWithSecondary = {
      secondary: dataSourceMap.get('secondary'),
      ...finalData,
    }
    setHasRequestTabPaneData((prev: any) =>
      prev.concat({
        id: Number(tabId),
        content: resultDataWithSecondary,
      }),
    )
    setTabContentLoading(false)
  }

  /** 当tab 改变的时候，获取他的content */
  const tabContentData = useMemo(() => {
    const hasRequestData = hasRequestTabPaneData.find((_item: any) => _item.id === Number(activeTabKey))
    if (hasRequestData) {
      return hasRequestData.content
    }
    return {} as HasRequestTabPaneDataType['content']
  }, [activeTabKey, hasRequestTabPaneData])

  /** 当页面上滑到底部是时，请求接口, 修改hasRequestTabPaneData 的suggestProduct 的值 */
  const onReached = async () => {
    setPageLoading(false)
    if (data === null || data.tabs.length === 0) {
      return
    }
    /** 获取当前激活的tab 的属性 */
    const currentTabProps = data?.tabs.find((_item: any) => _item.id === Number(activeTabKey))
    if (!currentTabProps) {
      return
    }
    const target = currentTabProps

    const hasRequestData = hasRequestTabPaneData.find((_item: any) => _item.id === Number(activeTabKey))
    if (!hasRequestData) {
      return
    }
    const { content } = hasRequestData
    const { type = ACCORDING_TO_SALE, num = 50, children, status = true } = target.otherProps.suggestProduct

    if (!status) {
      return
    }

    const { length } = content.suggestProduct
    /** 3 代表是自定义装修商品， 1 是自动按销量排行展示， 自动按上架时间倒序展示 */
    if (
      ([ACCORDING_TO_SALE, ACCORDING_TO_TIME].includes(type) && length >= Number(num)) ||
      content?.suggestProductNoMore
    ) {
      return
    }
    setPageLoading(true)

    const suggestProductListToMap = arrayToMap<{ id: number; label: string[] }, 'id'>(children, 'id')
    /** 自营商城需要加上自营商城的memberId, roleId, 渠道商城要加上memberId, 其余商城不需要 */
    // eslint-disable-next-line no-nested-ternary
    const otherProps = options.isSelfMall
      ? { memberId: options.selfInfo?.memberId, roleId: options.selfInfo?.roleId }
      : {}

    const common = {
      shopId: options.isSelfMall ? options.selfMallShopId : options.shopId.toString(),
      type,
      ...otherProps,
    }

    /** 如果器自营商城或者是渠道商城，那么他们用的是会员id，否则用平台id */
    const withCategoryId = options.isSelfMall ? { customerCategoryId: activeTabKey } : { categoryId: activeTabKey }
    const requestData =
      type === ACCORDING_TO_CUSTOM
        ? {
            /** 这里idInlist 都要做join 一下 */
            idInList: Object.keys(suggestProductListToMap).filter(Boolean).join(','),
            ...common,
            current: 1,
            pageSize: children.length,
          }
        : {
            ...common,
            ...withCategoryId,
            current: (Math.floor(length / 10) + 1).toString(),
            pageSize: num < 10 ? num : '10',
          }
    const withAreaCodeRequest = {
      provinceCode: options.currentCity?.provinceCode,
      cityCode: options.currentCity?.cityCode,
      ...requestData,
    }
    const res = await getMarketingMobileActivityGoodsAreaAdorn(withAreaCodeRequest as any)
    setLoading(false)
    if (res.code === 1000) {
      const newData = hasRequestTabPaneData.map((_item: any) => {
        if (_item.id === Number(activeTabKey)) {
          const newProductData = _item.content.suggestProduct.concat(res.data.data)
          return {
            ..._item,
            content: {
              ..._item.content,
              suggestProduct:
                type === 3
                  ? newProductData.map((_row: any) => ({
                      ..._row,
                      label: suggestProductListToMap[_row.id].label,
                    }))
                  : newProductData,
              /** 标志分页已完成 */
              suggestProductNoMore: newProductData.length >= res.data.totalCount || newProductData.length >= num,
            },
          }
        }
        return { ..._item }
      })

      setHasRequestTabPaneData(newData)
    }
  }

  /** 获取当前的tab 的otherProps */
  const currentTabOtherProps = useMemo(() => {
    if (data === null) {
      return null
    }
    const currentTab = data.tabs.find((_item) => _item.id === Number(activeTabKey))
    return currentTab?.otherProps || {}
  }, [activeTabKey, data])

  /** 刷新 */
  const onRefresh = async () => {
    const currentTab = data?.postData.filter((_item: any) => _item.id === Number(activeTabKey))[0]
    if (!currentTab) {
      return
    }
    const activeTabOtherProps = data.tabs.filter((_item: any) => _item.id === Number(activeTabKey))[0]
    const withSuggestProduct =
      activeTabOtherProps?.otherProps.suggestProduct.status ?? true
        ? { suggestProduct: activeTabOtherProps?.otherProps.suggestProduct }
        : {}

    const { requestData, dataSourceMap } = createPostData({ ...currentTab!.postData, ...withSuggestProduct } as any)
    const saleRankingListToMap = arrayToMap<{ id: number; sale: number }, 'id'>(
      dataSourceMap.get('saleRanking') || [],
      'id',
    )
    const suggestProductToMap = arrayToMap<{ id: number; label: string[] }, 'id'>(
      dataSourceMap.get('suggestProduct')?.['children'] || [],
      'id',
    )

    setRefresh(true)
    const res = await getAnyData(requestData, activeTabKey)
    const keyToValue = {
      suggestProduct: 'label',
      saleRanking: 'sale',
    }
    const finalData: { [key: string]: any } = {
      suggestProductNoMore: true,
    }
    Object.keys(res).forEach((_item) => {
      if (_item === 'saleRanking' || _item === 'suggestProduct') {
        finalData[_item] = res[_item].map((_row: any, _rowIndex: number) => {
          const sourceProps = _item === 'saleRanking' ? saleRankingListToMap : suggestProductToMap

          return {
            ..._row,
            [keyToValue[_item]]:
              (sourceProps[_row.id as number] as any)?.[keyToValue[_item]] || (_item === 'saleRanking' ? 0 : []),
          }
        })
      } else {
        finalData[_item] = res[_item]
      }
    })
    const resultDataWithSecondary = {
      secondary: dataSourceMap.get('secondary'),
      ...finalData,
    }
    setHasRequestTabPaneData((prev: any) =>
      prev.map((_item: any) => {
        if (_item.id.toString() === activeTabKey) {
          return {
            ..._item,
            content: resultDataWithSecondary,
          }
        }
        return { ..._item }
      }),
    )
    setTimeout(() => {
      setRefresh(false)
    }, 2000)
  }

  return {
    loading,
    tabContentLoading,
    info,
    // ...data,
    tabs: data!.tabs,
    onChange,
    activeTabKey,
    onReached,
    tabContentData,
    currentTabOtherProps,
    pageLoading,
    onRefresh,
    refresh,
  }
}

export default useGetLayout
