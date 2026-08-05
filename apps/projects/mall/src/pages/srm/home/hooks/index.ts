import { useEffect, useState } from 'react'
import {
  GetCommodityWebCategoryWebFindEnterpriseCategoryTreeResponse,
  getProductCustomerGetMemberCustomerCategoryTree,
  getProductPlatformGetCategoryTree,
  getPurchaseBiddingSearchSourceList,
  getPurchaseInviteTenderGetInviteTenderListByEnterpriseWeb,
  getPurchasePurchaseInquirySearchSourceList,
} from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'

const useSrmHome = () => {
  const { mallInfo, currentCity } = useGlobalConext()
  const [loading, setLoading] = useState<boolean>(true)
  const [inviteTenderList, setInviteTenderList] = useState<any>([{}])
  const [purchaseInquiry, setPurchaseInquiry] = useState<any>([{}])
  const [purchaseList, setPurchaseList] = useState<any>([{}])
  const [categoryList, setCategoryList] = useState<GetCommodityWebCategoryWebFindEnterpriseCategoryTreeResponse>([])

  const SrmDataSource: any = {}

  const initCategoryData = (list: any, parentKey?: string, parentName?: string) => {
    if (!list) {
      return []
    }
    const result: any = list.map((item: any) => {
      let cid = `c${item.id}`
      let treeName = item.name
      if (parentKey) {
        cid = `${parentKey}_${cid}`
        treeName = `${parentName} ${treeName}`
      }

      const newItem: any = {
        title: item.name,
        name: item.name,
        treeName: treeName,
        key: cid,
        id: item.id,
        parentId: cid,
        brandList: item.brandList,
      }
      if (item.children && item.children.length > 0) {
        newItem.children = initCategoryData(item.children, cid, treeName)
      }
      return newItem
    })
    return result
  }

  /**
   * 获取商品品类树
   */
  const getCategoryTree = () => {
    if (mallInfo?.id && SrmDataSource?.type === 'self') {
      // 存在即从cookie中获取数据
      const param: any = {
        memberId: SrmDataSource?.memberId,
        memberRoleId: SrmDataSource?.memberRoleId,
      }
      getProductCustomerGetMemberCustomerCategoryTree(param).then((res) => {
        if (res.code === 1000) {
          let desc = initCategoryData(res.data)
          setCategoryList(desc)
        }
      })
    } else {
      getProductPlatformGetCategoryTree()
        .then((res) => {
          if (res.code === 1000) {
            let desc = initCategoryData(res.data)
            setCategoryList(desc)
          }
        })
        .catch(() => {
          setCategoryList([])
        })
    }
  }
  /**
   * 获取采购询价列表
   */
  const fnGetSourceListByEnterpriseWeb = () => {
    const param: any = {
      current: '1',
      pageSize: '9',
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    }
    const headers: any = {
      type: mallInfo ? mallInfo.type : '0',
      shopId: mallInfo ? mallInfo.id + '' : '0',
    }
    getPurchasePurchaseInquirySearchSourceList(param, { headers })
      .then((res) => {
        if (res.code === 1000) {
          if (res.data.data) {
            setPurchaseInquiry(res.data.data)
          } else {
            setPurchaseInquiry([])
          }
        }
      })
      .catch(() => {
        setPurchaseInquiry([])
      })
  }

  /**
   * 获取采购招标列表
   */
  const fnGetInviteTenderListByEnterpriseWeb = () => {
    const param: any = {
      current: '1',
      pageSize: '9',
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    }
    const headers: any = {
      type: mallInfo ? mallInfo.type : '0',
      shopId: mallInfo ? mallInfo.id + '' : '0',
    }
    getPurchaseInviteTenderGetInviteTenderListByEnterpriseWeb(param, {
      headers,
    })
      .then((res) => {
        if (res.code === 1000) {
          if (res.data.data) {
            setInviteTenderList(res.data.data)
          } else {
            setInviteTenderList([])
          }
        }
      })
      .catch(() => {
        setInviteTenderList([])
      })
  }

  /**
   * 获取采购竞价列表
   */
  const fnGetPurchaseList = () => {
    let data: any = {
      current: '1',
      pageSize: '9',
      // provinceCode: currentCity?.provinceCode,
      // cityCode: currentCity?.cityCode,
    }
    getPurchaseBiddingSearchSourceList(data)
      .then((res: any) => {
        if (res.data.data) {
          setPurchaseList(res.data.data)
        } else {
          setPurchaseList([])
        }
      })
      .catch(() => {
        setPurchaseList([])
      })
  }

  useEffect(() => {
    Promise.all([
      fnGetInviteTenderListByEnterpriseWeb(),
      fnGetSourceListByEnterpriseWeb(),
      fnGetPurchaseList(),
      getCategoryTree(),
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  return {
    loading,
    inviteTenderList,
    purchaseInquiry,
    purchaseList,
    categoryList,
  }
}

export default useSrmHome
