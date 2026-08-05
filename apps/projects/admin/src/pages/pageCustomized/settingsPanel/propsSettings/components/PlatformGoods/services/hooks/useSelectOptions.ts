import { MallItemType } from '@/pages/mallManage/services/types'
import {
  GetCommodityAdornWebPlatformFindBrandListResponseDetail,
  GetCommodityShopListShopByReqResponse,
  GetCommodityWebCategoryWebFindEnterpriseCategoryTreeResponse,
  getCommodityAdornWebPlatformFindBrandList,
  getCommodityShopListShopByReq,
  getCommodityWebCategoryWebFindEnterpriseCategoryTree,
} from '@apps/apis'
import { useEffect, useState } from 'react'

const dealTreeData = (treeData) => {
  const data = treeData?.map((item) => ({
    ...item,
    // label字段处理
    label: item.name || item.title,
    value: item.id,
    // 如果children为空数组，则置为null
    children: item.children && item.children.length ? dealTreeData(item.children) : null,
  }))
  return data
}

const useSelectOptions = ({ adornId, categoryId }) => {
  const [mallList, setMallList] = useState<MallItemType[]>([])
  const [brandData, setBrandData] = useState<GetCommodityAdornWebPlatformFindBrandListResponseDetail[]>([])
  const [categoryData, setCategoryData] = useState<GetCommodityWebCategoryWebFindEnterpriseCategoryTreeResponse>([])

  const fetchMallList = () => {
    getCommodityShopListShopByReq({
      type: '1',
      environment: '1',
      isSelf: 'false',
    })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setMallList(res.data as unknown as MallItemType[])
        }
      })
      .catch(() => {})
  }

  const fetchCategoryDate = (shopId: number) => {
    const headers: any = {
      shopId,
    }
    getCommodityWebCategoryWebFindEnterpriseCategoryTree(
      {
        adornId,
      },
      { headers },
    ).then((res) => {
      if (res.data && res.data.length > 0) {
        setCategoryData(res.data)
      }
    })
  }

  const fetchBranchData = (shopId: number) => {
    getCommodityAdornWebPlatformFindBrandList({
      adornId: String(adornId),
      shopId: String(shopId),
      categoryId,
      type: '2',
      current: '1',
      pageSize: '99',
    }).then((res) => {
      if (res.data && res.data.data.length > 0) {
        setBrandData(res.data.data)
      }
    })
  }

  useEffect(() => {
    fetchMallList()
  }, [])

  return {
    mallList,
    brandData,
    categoryData,
    fetchCategoryDate,
    fetchBranchData,
  }
}

export default useSelectOptions
