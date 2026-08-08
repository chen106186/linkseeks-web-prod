import { useState, useEffect, useMemo } from 'react'
import { showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { Toast } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { arrayToMap } from '@/utils'
import { CurrentCityType } from '@/store/locationStore/model'
import { userInfoType } from '@/store/userStore/model'
import { getMarketingMobileActivityPageGet, GetMarketingMobileActivityPageGetResponse } from '@apps/apis'
import {
  postMarketingMobileActivityMerchantActivityPageAdorn,
  postMarketingMobileActivityPlatformActivityPageAdorn,
} from '@apps/apis'

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

type GetMarketingAdornActivityGoodsAdornResponse = {
  /**
   * 活动商品ID
   */
  id: number
  /**
   * 活动ID
   */
  activityId: number
  /**
   * 赠送促销类型：1-满额赠2-买商品赠
   */
  giveType: number
  /**
   * 商品ID
   */
  productId: number
  /**
   * skuId
   */
  skuId: number
  /**
   * 商品名称
   */
  productName: string
  /**
   * 商品图片
   */
  productImgUrl: string
  /**
   * 规格
   */
  type: string
  /**
   * 品类
   */
  category: string
  /**
   * 品牌
   */
  brand: string
  /**
   * 单位
   */
  unit: string
  /**
   * 商品价格预售价格
   */
  price: number
  /**
   * 直降价格起始价格
   */
  plummetPrice: number
  /**
   * 活动价格团购价格秒杀价格单价定金砍价底价
   */
  activityPrice: number
  /**
   * 定金抵扣单价
   */
  deductionPrice: number
  /**
   * 折扣（如85折，输入85，9折输入90）
   */
  discount: number
  /**
   * 个人限购数量
   */
  restrictNum: number
  /**
   * 活动限购总数量
   */
  restrictTotalNum: number
  /**
   * 所属活动（key：id、name、type、belongType。value：活动ID、活动名称、活动类型、所属类型） ,Map
   */
  activityList: {}[]
  /**
   * 赠品（优惠卷） ,Map
   */
  giveCouponList: {}[]
  /**
   * 配套商品-组 ,ActivityGoodsSubsidiaryGroupResp
   */
  goodsSubsidiaryGroupList: {
    /**
     * 分组编号优惠阶梯换购阶梯
     */
    groupNo?: number
    /**
     * 换购门槛优惠门槛数量或金额
     */
    limitValue?: number
    /**
     * 套餐价格
     */
    groupPrice?: number
    /**
     * 配套商品-组明细 ,ActivityGoodsSubsidiaryGroupDetailsResp
     */
    goodsSubsidiaryGroupDetailsList?: {
      /**
       * id
       */
      id?: number
      /**
       * 商品id
       */
      productId?: number
      /**
       * skuId
       */
      skuId?: number
      /**
       * 商品名称
       */
      productName?: string
      /**
       * 品类
       */
      category?: string
      /**
       * 品牌
       */
      brand?: string
      /**
       * 单位
       */
      unit?: string
      /**
       * 商品价格
       */
      price?: number
      /**
       * 换购价格
       */
      swapPrice?: number
      /**
       * 允许换购数量赠送数量搭配数量
       */
      num?: number
      /**
       * 赠品主图
       */
      productImgUrl?: string
    }[]
  }[]
}[]

export type CouponType = {
  /**
   * 主键id
   */
  id: number
  /**
   * 优惠券名称
   */
  name: string
  /**
   * 优惠券类型
   */
  type: number
  /**
   * 优惠券类型名称
   */
  typeName: string
  /**
   * 领(发)券起始时间
   */
  releaseTimeStart: number
  /**
   * 领(发)券结束时间
   */
  releaseTimeEnd: number
  /**
   * 券面额
   */
  denomination: number
  /**
   * 领取方式
   */
  getWay: number
  /**
   * 领取方式名称
   */
  getWayName: string
  /**
   * 使用条件,满多少金额可用
   */
  useConditionMoney: number
  /**
   * 创建时间
   */
  createTime: number
  /**
   * 所属方类型1-平台2-商家
   */
  belongType: number
  /**
   * 所属方名称
   */
  belongName: string
}[]

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
  coupon: CouponType[]
} & {
  [props: string]: GetMarketingAdornActivityGoodsAdornResponse
}

type Options = {
  currentCity: CurrentCityType
  userInfo: userInfoType | null
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
function useActivityLayout(id: number, options: Options) {
  const [layout, setLayout] = useState<LayoutType | null>(null)
  /** 活动内容，活动名等 */
  const [info, setInfo] = useState<Omit<GetMarketingMobileActivityPageGetResponse, 'adornContent'> | null>(null)
  const [activityData, setActivityData] = useState<any>([])
  // const [pageLoading, setPageLoading] = useState<boolean>(false);
  const intl = useIntl()

  /** 获取装修layout */
  useEffect(() => {
    let timeOutRedirect: ReturnType<typeof setTimeout> | null = null
    async function getLayoutData() {
      // setPageLoading(true);
      showLoading()
      try {
        const { code, data, message } = await getMarketingMobileActivityPageGet({ id: id.toString() })
        if (code === 1000) {
          const { adornContent, ...rest } = data
          setLayout(adornContent as unknown as LayoutType)
          setInfo(rest)
        } else {
          Toast.show({
            title: intl.formatMessage({ id: `${code}`, defaultMessage: message }),
            icon: 'none',
          })
          timeOutRedirect = setTimeout(() => {
            // navigation.dispatch(CommonActions.goBack());
            Router.navigateBack()
          }, 1500)
        }
      } finally {
        hideLoading()
        // setPageLoading(false)
      }
    }
    getLayoutData()
    return () => {
      clearTimeout(timeOutRedirect as ReturnType<typeof setTimeout>)
    }
  }, [options.userInfo])

  /**
   * 过滤掉visbile = false 的那些活动，平铺suggestData，将二维数组平铺成一位， 并将整理postData
   * postData 只保留visible = true 的那些活动id1
   */
  const filterVisibleIsHidden = useMemo(() => {
    const list: { name: string; sort: number; theme: number; title: string; props?: any; childrenData?: any[] }[] = []
    const postData: PostDataType = (
      info?.type === PLATFORM ? {} : { area: [options.currentCity?.provinceCode, options.currentCity?.cityCode] }
    ) as PostDataType
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

      if (_item === 'combination') {
        const { childrenData } = target.props
        const data = childrenData.map((_row) => _row.childrenData)
        postData[_item] = Array.from(new Set(data.flat()))
        list.push({
          name: `${_item}`,
          sort: target.sort,
          theme: target.props.theme,
          title: target.props.title,
          childrenData: data.filter(Boolean),
          props: {},
        })
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

  const getAnyData = async (postData: PostDataType, headers: { headers: { shopId: number } }) => {
    /** type = 1  平台， type = 2 商家 */
    const service =
      info?.type === PLATFORM
        ? postMarketingMobileActivityPlatformActivityPageAdorn
        : postMarketingMobileActivityMerchantActivityPageAdorn
    const { data, code } = await service(postData, headers)
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
    if (isEmpty || !info) {
      return
    }
    /** 过滤postData */
    /** 排序好 */
    const sortList = list.sort((a, b) => a.sort - b.sort)
    const whileList = ['top', 'coupon']
    async function getDatasource() {
      // setPageLoading(true);
      showLoading()
      // console.log("postData", postData)
      try {
        /** 获取所有数据，返回值 {[key: string]: any[]} */
        const data: ReturnDataType = await getAnyData(postData, { headers: { shopId: info!.shopId } })
        const result: any = []
        const arrayToMapData = arrayToMap(data.combination || [], 'id')

        sortList.forEach((_item) => {
          const { name, title, props } = _item
          const activityImage = name === 'top' ? { imageUrl: props.image } : {}
          let dataSource: any[] = []

          /** data 肯定返回的是 {[key: string]: 活动商品数组 } */
          if (name.includes('suggestProduct')) {
            dataSource = data[name]?.map((_productItem: any) => {
              const dataIndex = `${name}_${_productItem.id}`
              const currentLabel = labels[dataIndex] || []
              return {
                ..._productItem,
                label: currentLabel.concat(_productItem.label),
              }
            })
          } else if (name === 'combination') {
            dataSource = _item.childrenData!.map((_row) => _row.map((_rowItem: string) => arrayToMapData[_rowItem]))
          } else {
            dataSource = data[name] || []
          }

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
        // console.log("result", JSON.stringify(result));
        setActivityData(result)
      } finally {
        hideLoading()

        // setPageLoading(false)
      }
    }
    getDatasource()
  }, [filterVisibleIsHidden, info])

  return { layout, filterVisibleIsHidden, activityData, info }
}

export default useActivityLayout
