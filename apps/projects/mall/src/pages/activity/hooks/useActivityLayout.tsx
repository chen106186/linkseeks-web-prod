import { SelectAreaItemType } from '@/types/global'
import {
  GetMarketingAdornActivityGoodsAdornResponse,
  GetMarketingMobileActivityPageGetResponse,
  PostMarketingCouponPlatformActivityPageSelectDetailResponse,
  postMarketingWebActivityMerchantActivityPageAdorn,
  postMarketingWebActivityPlatformActivityPageAdorn,
  getMarketingMobileActivityPageGet,
  getProductCommodityGetCommodityStock,
} from '@apps/apis'
import { useState, useEffect, useMemo } from 'react'

type LayoutType = {
  [key: string]: {
    sort: number
    props: {
      visible: boolean
      childrenData: any[]
    } & {
      [key: string]: any
    }
  }
}

type PostDataType = {
  coupon: {
    id: number
    /** 1 => 平台， 2 商家 */
    type: 1 | 2 | ({} & string)
  }[]
} & {
  [props: string]: number[]
}

type ReturnDataType = {
  coupon: PostMarketingCouponPlatformActivityPageSelectDetailResponse[]
} & {
  [props: string]: GetMarketingAdornActivityGoodsAdornResponse
}

/**
 * 获取活动页装修， 考虑到小程序有可能用，所以单独封一个hook，到时候直接复制hook即可
 * 说明一下逻辑
 * 先获取装修业的布局，因为装修页布局带有数据，那么首先整理一下数据交给后端, 其中要注意的就是如果childrenData为空数组或者visible 为false，那么就不交给后端，
 * 返回格式, 如下，需要注意的是优惠券与活动图，会有区别， 返回数组是因为已经经过sort排序了，到时候直接map 这个数组即可
 * [
 *  { name: 'string', title: string, dataSource: any[]}
 * ]
 */
/** 判断是否是平台 */
const PLATFORM = 1
function useActivityLayout(id: string | undefined, currentCity: SelectAreaItemType | undefined) {
  const [layout, setLayout] = useState<LayoutType | null>(null)
  /** 活动内容，活动名等 */
  const [info, setInfo] = useState<Omit<GetMarketingMobileActivityPageGetResponse, 'adornContent'> | null>(null)
  const [activityData, setActivityData] = useState<any>([])
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [isExpired, setIsExpired] = useState<boolean>(false)
  let timeOutRedirect: ReturnType<typeof setTimeout> | null = null

  const getLayoutData = async () => {
    if (id) {
      setPageLoading(true)
      try {
        const { code, data, message } = await getMarketingMobileActivityPageGet({ id })
        if (code === 1000) {
          const { adornContent, ...rest } = data
          setLayout(adornContent as unknown as LayoutType)
          setInfo(rest)
        } else {
          setIsExpired(true)
        }
      } finally {
        setPageLoading(false)
      }
    }
  }

  /** 获取装修layout */
  useEffect(() => {
    getLayoutData()
    return () => {
      clearTimeout(timeOutRedirect as any)
    }
  }, [])
  /**
   * 过滤掉visbile = false 的那些活动，平铺suggestData，将二维数组平铺成一位， 并将整理postData
   * postData 只保留visible = true 的那些活动id1
   */
  const filterVisibleIsHidden = useMemo(() => {
    const list: { name: string; sort: number; theme: number; title: string; props?: any }[] = []
    const postData: PostDataType = {} as PostDataType
    postData['area'] = [Number(currentCity?.provinceCode), Number(currentCity?.cityCode)]
    const labels: { [key: string]: string[] } = {}
    if (layout === null) {
      return { postData, list, isEmpty: true, labels }
    }
    Object.keys(layout).forEach((_item) => {
      const target = layout[_item]
      /** 如果是不显示，那就直接放弃 */
      if (typeof target.props.visible !== 'undefined' && !target.props.visible) {
        return
      }
      /** 如果是themeStyle，也直接放弃, themeStyle 为背景颜色 */
      if (_item === 'themeStyle') {
        return
      }

      if (_item === 'suggestProduct') {
        const { childrenData } = target.props
        childrenData?.forEach((_row, _index) => {
          list.push({
            name: `${_item}_${_index}`,
            sort: target.sort,
            theme: _row.theme,
            title: _row.title,
            props: {},
          })
          postData[`${_item}_${_index}`] = _row.childrenData.map((_record: any) => {
            labels[`${_item}_${_index}_${_record.id}`] = _record.label
            return _record.id
          })
        })
        return
      }
      list.push({
        name: _item,
        sort: target.sort,
        theme: target.props.theme,
        title: target.props.title,
        props:
          _item === 'top'
            ? {
                image: target.props.imageUrl,
              }
            : {},
      })
      /** 如果childrenData是空数组，那么也不提交给后端 */
      if (target.props?.childrenData?.length === 0 || _item === 'top') {
        return
      }
      postData[_item] = target.props?.childrenData || []
    })
    // console.log("postData", JSON.stringify(postData));
    return { postData, list, isEmpty: false, labels }
  }, [layout])

  const getAnyData = async (postData: any, headers: { headers: { shopId: number } }) => {
    /** type = 1  平台， type = 2 商家 */
    const service =
      info?.type === PLATFORM
        ? postMarketingWebActivityPlatformActivityPageAdorn
        : postMarketingWebActivityMerchantActivityPageAdorn
    const { data, code } = await service(postData, { ...headers, ctlType: 'none' })
    if (code === 1000) {
      return data
    }
    return {} as any
  }

  /** 当活动内容发生改变时，根据layout 排序活动。
   *  将上面的postData 提交给后端，然后重新组装数据
   *  因为suggestProduct 有自定义label,所以要为suggestData_${n}添加其中的label
   * */
  useEffect(() => {
    const { isEmpty, list, postData, labels } = filterVisibleIsHidden
    if (isEmpty || info === null) {
      return
    }
    /** 过滤postData */
    /** 排序好 */
    const sortList = list.sort((a, b) => a.sort - b.sort)
    const whileList = ['top', 'coupon']
    async function getDatasource() {
      setPageLoading(true)
      console.log('postData', postData)
      /** 获取所有数据，返回值 {[key: string]: any[]} */
      try {
        const data: ReturnDataType = await getAnyData(postData, { headers: { shopId: info!.shopId } })
        const result: any = []

        sortList.forEach((_item) => {
          const { name, title, props } = _item
          const ids = postData[name] || []

          const activityImage = name === 'top' ? { imageUrl: props.image } : {}
          /** data 肯定返回的是 {[key: string]: 活动商品数组 } */
          const dataSource = name.includes('suggestProduct')
            ? data[name]
                ?.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
                ?.map((_productItem: any) => {
                  const dataIndex = `${name}_${_productItem.id}`
                  const currentLabel = labels[dataIndex] || []
                  return {
                    ..._productItem,
                    label: currentLabel.concat(_productItem.label),
                  }
                })
            : data[name]?.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)) || []

          /** 如果dataSource 是空 */
          if (dataSource?.length === 0 && !whileList.includes(_item.name)) {
            return
          }

          result.push({
            name,
            title,
            dataSource,
            theme: _item.theme,
            ...activityImage,
          })
        })

        let ids: any[] = []

        result.forEach((_item) => {
          if (_item.dataSource?.length > 0) {
            _item.dataSource.forEach((_record) => {
              ids.push(_record.productId)
            })
          }
        })

        ids = [...new Set(ids)]

        const inventoryList = await getProductCommodityGetCommodityStock({ idList: ids.join(), shopId: info!.shopId })

        result.forEach((_item) => {
          _item.dataSource?.forEach((_record) => {
            const inventory = inventoryList.data.find((_inventory) => _inventory.commodityId === _record.productId)

            if (inventory) {
              _record.stockCount = inventory.stockCount
              _record.minOrder = inventory.minOrder
            }
          })
        })

        console.log('result', result)
        setActivityData(result)
      } finally {
        setTimeout(() => {
          setPageLoading(false)
        }, 500)
      }

      // console.log("result", JSON.stringify(result));
    }
    getDatasource()
  }, [filterVisibleIsHidden, info])

  return { layout, filterVisibleIsHidden, activityData, info, pageLoading, isExpired }
}

export default useActivityLayout
