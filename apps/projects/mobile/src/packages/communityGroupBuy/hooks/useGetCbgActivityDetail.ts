import { useEffect, useState } from 'react'
import { postMarketingMobileCbgActivityDetail } from '@apps/apis'

type OptionsType = {
  /**
   * 团购活动id
   */
  activityId: number
  /**
   * 团购团长id
   */
  teamLeaderId: number
}

/** 获取店铺详情 */
function useGetCbgActivityDetail(options: OptionsType) {
  const { activityId, teamLeaderId } = options
  const [detail, setDetail] = useState<any>({})
  const [pickupPoint, setPickupPoint] = useState<any>({})
  const [productList, setProductList] = useState<any[]>([])
  const [activeName, setActiveName] = useState<string>('')

  useEffect(() => {
    if (!activityId || !teamLeaderId) {
      return
    }
    async function getData() {
      const params = {
        activityId: activityId,
        pickupPointId: teamLeaderId,
      }
      const { data, code } = await postMarketingMobileCbgActivityDetail(params)
      if (code === 1000) {
        setPickupPoint(data.pickupPointResp)
        delete data.pickupPointResp
        setProductList(data.goodsList)
        delete data.goodsList
        setDetail(data)
        setActiveName(data.name)
      }
    }
    getData()
  }, [activityId, teamLeaderId])

  return { detail, pickupPoint, productList, activeName }
}

export default useGetCbgActivityDetail
