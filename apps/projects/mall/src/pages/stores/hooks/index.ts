import { useEffect, useState } from 'react'
import {
  GetCommodityWebStoreWebMemberShopListRequest,
  GetCommodityWebStoreWebMemberShopListResponseDetail,
  GetCommodityWebStoreWebNewAddMemberShopResponse,
  GetReportMallGetPopularShopListResponse,
  getCommodityWebStoreWebMemberShopList,
  getCommodityWebStoreWebNewAddMemberShop,
  getReportMallGetPopularShopList,
} from '@apps/apis'
import { useLocation, useParams } from 'react-router-dom'
import { useGlobalConext } from '@/context/globalProvider'
import { FILTER_PARAM } from '@/components/CommonFilter/types'
import isEmpty from 'lodash/isEmpty'

interface IProps {
  filterParam: FILTER_PARAM | undefined
}

const useStores = ({ filterParam }: IProps) => {
  const { currentCity, mallInfo } = useGlobalConext()
  const { search } = useLocation()
  const { filter = '' } = useParams()
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [loading, setLoading] = useState<boolean>(true)
  const [shopList, setShopList] = useState<GetCommodityWebStoreWebMemberShopListResponseDetail[]>([])

  const [totalCount, setTotalCount] = useState<number>(0)
  const [initLoad, setInitLoad] = useState<boolean>(true)
  const [popularShopList, setPopularShopList] = useState<GetReportMallGetPopularShopListResponse>([])
  const [newJoinShopList, setNewJoinShopList] = useState<GetCommodityWebStoreWebNewAddMemberShopResponse>([])

  /** 获取新加入供应商数据 */
  const fetchNewJoinShopList = () => {
    getCommodityWebStoreWebNewAddMemberShop().then((res) => {
      if (res.code === 1000) {
        setNewJoinShopList(res.data.filter((item) => !!item))
      }
    })
  }

  /** 获取活跃供应商数据 */
  const fetchPopularShopList = () => {
    getReportMallGetPopularShopList().then((res) => {
      if (res.code === 1000) {
        setPopularShopList(res.data)
      }
    })
  }

  useEffect(() => {
    fetchNewJoinShopList()
    fetchPopularShopList()
  }, [])

  const fetchShopList = (currentParam?: number, size?: number) => {
    let param: GetCommodityWebStoreWebMemberShopListRequest = {
      current: String(currentParam ? currentParam : current),
      pageSize: String(size ? size : pageSize),
      sortCreditPoint: 'DESC',
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    }
    const headers = {
      shopId: mallInfo?.id,
    }

    if (!isEmpty(filterParam)) {
      param = Object.assign(param, filterParam)
    }
    setLoading(true)

    getCommodityWebStoreWebMemberShopList(param, { headers }).then((res) => {
      setLoading(false)
      if (res.code === 1000) {
        setShopList(res.data.data)
        setTotalCount(res.data.totalCount)
      }
    })
  }

  const checkInitLoad = () => {
    let load = true
    let needInit = false
    if (filter || search) {
      needInit = true
    } else if (filter) {
      needInit = true
    }

    if (needInit) {
      if (initLoad) {
        setInitLoad(false)
        load = false
      }
    }
    if (load) {
      fetchShopList(1)
    }
  }

  useEffect(() => {
    setCurrent(1)
    checkInitLoad()
  }, [filterParam])

  const onPageChange = (page: number, size?: number) => {
    setCurrent(page)
    size && setPageSize(size)
    fetchShopList(page, size)
  }

  return {
    loading,
    current,
    pageSize,
    totalCount,
    shopList,
    popularShopList,
    newJoinShopList,
    onPageChange,
  }
}

export default useStores
