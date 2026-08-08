import { useEffect, useState } from 'react'
import { CommodityItemType } from '@/types/commodity'
import { FILTER_PARAM, FilterValueType } from '@/components/CommonFilter/types'
import { useGlobalConext } from '@/context/globalProvider'
import { LAYOUT_TYPE } from '@/types/global'
import {
  postProductShopEnterpriseGetCommodityList,
  postProductShopMroGetCommodityList,
  postProductShopSelfGetCommodityList,
  postProductShopStoreGetCommodityList,
} from '@apps/apis'
import { useLocation, useParams } from 'react-router-dom'

interface IProps {
  filterList: FilterValueType[]
  filterParam: FILTER_PARAM | undefined
  priceType: 1 | 2 | 3 | 4
  mroFilterSelected: Record<string, any>
  checkPrice: boolean
}

const useCommodity = ({ filterParam, priceType, filterList, mroFilterSelected, checkPrice }: IProps) => {
  const { currentCity, mallInfo, layoutType, shopInfo, isMro } = useGlobalConext()
  const [commodityList, setCommodityList] = useState<CommodityItemType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)

  /**
   * 获取商品列表数据
   * @param currentParam 当前页码
   * @param size
   */
  const fetchCommodityList = (currentParam?: number, size?: number) => {
    let param: any = {
      current: currentParam ? currentParam : current,
      pageSize: size ? size : pageSize,
      priceTypeList: [priceType],
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    }

    if (filterParam) {
      param = Object.assign(param, filterParam)
    }

    setLoading(true)
    let getFn
    let headers: any = {
      type: 1,
      shopId: mallInfo?.id,
    }
    switch (layoutType) {
      case LAYOUT_TYPE.joint:
        getFn = postProductShopEnterpriseGetCommodityList
        break
      case LAYOUT_TYPE.own:
        param.memberId = mallInfo?.memberId
        getFn = postProductShopSelfGetCommodityList
        break
      case LAYOUT_TYPE.shop:
        if (shopInfo) {
          param.storeId = shopInfo.id
          getFn = postProductShopStoreGetCommodityList
        }
        break
    }

    if (isMro) {
      let _list: any = []
      for (let key in mroFilterSelected['attr']) {
        if (mroFilterSelected['attr'][key] && mroFilterSelected['attr'][key].length > 0) {
          let _obj: any = {}
          _obj.customerAttributeId = key
          _obj.customerAttributeValueList = mroFilterSelected['attr'][key]?.map((item: any) => {
            return { id: item }
          })
          _list.push(_obj)
        }
      }
      param.brandIdList = mroFilterSelected['brand']?.['brand999'] || []
      param.customerAttributeList = _list

      if (checkPrice) {
        param.priceTypeList = [1]
      } else {
        param.priceTypeList = [1, 2]
      }
      getFn = postProductShopMroGetCommodityList
    }

    getFn &&
      getFn(param, { headers, ctlType: 'none' })
        .then((res) => {
          if (res.code === 1000) {
            setCommodityList(res.data.data as CommodityItemType[])
            setTotalCount(res.data.totalCount)
          }
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
  }

  useEffect(() => {
    if (filterList.length === 0 && !filterParam) {
      setCurrent(1)
      fetchCommodityList(1)
    }
  }, [filterList, filterParam, checkPrice])

  useEffect(() => {
    if (filterParam) {
      setCurrent(1)
      fetchCommodityList(1)
    }
  }, [filterParam, checkPrice])

  const onPageChange = (page: number, size?: number) => {
    setCurrent(page)
    size && setPageSize(size)
    fetchCommodityList(page, size)
  }

  return {
    loading,
    current,
    pageSize,
    totalCount,
    commodityList,
    onPageChange,
  }
}

export default useCommodity
