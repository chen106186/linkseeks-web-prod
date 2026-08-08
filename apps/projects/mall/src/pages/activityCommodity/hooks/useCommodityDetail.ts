import { GetProductShopStoreGetCommodityDetailResponse, getProductShopStoreGetCommodityDetail } from '@apps/apis'
import { useEffect, useState } from 'react'

interface IProps {
  spuId: string
  skuId: number
  mallId: number
}

interface SkuInfoType {
  skuId: number
  /** 规格图片 */
  logo: string
  specList: {
    label?: string
    value?: string
  }[]
}

const useCommodityDetail = ({ spuId, skuId, mallId }: IProps) => {
  const [commodityDetail, setCommodityDetail] = useState<GetProductShopStoreGetCommodityDetailResponse>()
  const [skuInfo, setSkuInfo] = useState<SkuInfoType>()

  /**
   * 获取商品详情信息
   */
  const fetchCommodityDetail = () => {
    const params = {
      commodityId: spuId,
    }
    let headers: any = {
      type: 1,
      shopId: mallId,
    }

    getProductShopStoreGetCommodityDetail(params, { headers }).then(async (res) => {
      if (res.code === 1000) {
        setCommodityDetail(res.data)
        if (skuId) {
          const unitPricePicList = res.data?.commoditySkuList
          if (unitPricePicList && unitPricePicList.length > 0) {
            const filterItem = unitPricePicList.filter((item) => item.id === Number(skuId))[0]
            if (filterItem) {
              setSkuInfo({
                skuId: filterItem.id,
                logo: filterItem.commodityPic[0],
                specList: filterItem.commoditySkuAttributeList.map((item) => ({
                  label: item.customerAttribute?.name,
                  value: item.customerAttributeValue?.value,
                })),
              })
            }
          }
        }
      }
    })
  }

  useEffect(() => {
    if (spuId) {
      fetchCommodityDetail()
    }
  }, [spuId])

  return {
    commodityDetail,
    skuInfo,
  }
}

export default useCommodityDetail
