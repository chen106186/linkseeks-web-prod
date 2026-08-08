import { useEffect, useState } from 'react'
import useStores from '@/store/useStores'
import { getCommodityMobileStoreMobileFindById } from '@apps/apis'
import { SupplierInfoData } from '@/components/BusinessCard'
import { ProductInfo } from './useGetProductDetail'

type OptionsType = {
  /**
   * 店铺id，如果是企业商城 那就传productInfo.storeId
   * 如果是渠道商城那么productInfo.memberid， 如果自营商城，那么没有店铺信息
   */
  productInfo: ProductInfo | null
}

type ShopInfo = SupplierInfoData & {
  volume: number
}

/** 获取店铺详情 */
function useGetShopInfo(options: OptionsType) {
  const { productInfo } = options
  const [supplierInfo, setSupplierInfo] = useState<ShopInfo>({
    id: 0,
    name: '',
    logo: '',
    creditPoint: '',
    registerYears: '',
    volume: 0,
    memberId: 0,
    roleId: 0,
  })

  const {
    userStore: { shopAndSite },
  } = useStores()

  useEffect(() => {
    const isSellMall = shopAndSite?.isSelf

    if (!productInfo || isSellMall || !productInfo?.memberId || !productInfo?.storeId) {
      return
    }
    async function getData() {
      const params = {
        id: `${productInfo?.storeId}`,
      }
      const { data, code } = await getCommodityMobileStoreMobileFindById(params)
      if (code === 1000) {
        setSupplierInfo({
          id: data.id,
          name: data.name,
          logo: data.logo,
          creditPoint: data.creditPoint,
          registerYears: '',
          volume: 0,
          memberId: data.memberId,
          roleId: data.roleId,
          status: data.status,
        })
      }
    }
    getData()
  }, [productInfo, shopAndSite])

  return { supplierInfo }
}

export default useGetShopInfo
