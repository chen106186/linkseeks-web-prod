import { useEffect, useState } from 'react'
import { CommodityItemType } from '@/types/commodity'
import { FILTER_PARAM } from '@/components/CommonFilter/types'
import { useGlobalConext } from '@/context/globalProvider'
import { LAYOUT_TYPE } from '@/types/global'
import { postProductShopScoreGetCommodityList, postProductShopSelfGetCommodityList } from '@apps/apis'
import { useLocation, useParams } from 'react-router-dom'

interface IProps {
  filterParam: FILTER_PARAM | undefined
}

const useCommodity = ({ filterParam }: IProps) => {
  const { currentCity, mallInfo, layoutType, shopInfo, isMro } = useGlobalConext()
  const [initLoad, setInitLoad] = useState<boolean>(true)
  const [commodityList, setCommodityList] = useState<CommodityItemType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)
  const { filter = '' } = useParams()
  const { search } = useLocation()

  /**
   * 获取商品列表数据
   * @param currentParam 当前页码
   * @param size
   */
  const fetchCommodityList = (currentParam?: number, size?: number) => {
    let param: any = {
      current: currentParam ? currentParam : current,
      pageSize: size ? size : pageSize,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
      priceTypeList: [3],
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
        getFn = postProductShopScoreGetCommodityList
        break
      case LAYOUT_TYPE.own:
        param.memberId = mallInfo?.memberId
        getFn = postProductShopSelfGetCommodityList
        break
      case LAYOUT_TYPE.shop:
        if (shopInfo) {
          param.storeId = shopInfo.id
          getFn = postProductShopScoreGetCommodityList
        }
        break
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

  const checkInitLoad = () => {
    let load = true
    let needInit = false

    if (filter || search) {
      needInit = true
    }

    if (needInit) {
      if (initLoad) {
        setInitLoad(false)
        load = false
      }
    }

    if (load) {
      fetchCommodityList(1)
    }
  }

  useEffect(() => {
    console.log(filterParam, 'filterParam')
    setCurrent(1)
    checkInitLoad()
  }, [filterParam])

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
