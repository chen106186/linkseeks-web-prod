import {
  PostMarketingWebActivityGoodsDetailTagRequest,
  postMarketingWebActivityGoodsDetailTag,
  postMarketingWebActivityOrderGroupPurchaseDetail,
} from '@apps/apis'
import { useState } from 'react'
import { GroupDetailType, MarketingDetailType } from '../types'
import { MarketingTypeEnum } from '@/constants/marketing'

const useMarketing = (type: number) => {
  const [marketingData, setMarketingData] = useState<MarketingDetailType>()
  const [hasActivity, setHasActivity] = useState<boolean>(false)
  const [isGroupBuy, setIsGroupBuy] = useState<boolean>(type === 3)
  const [currentGroupDetail, setCurrentGroupDetail] = useState<GroupDetailType>()

  const getGroupDetail = (groupId: number) => {
    postMarketingWebActivityOrderGroupPurchaseDetail({ id: groupId }, { ctlType: 'none' }).then((res) => {
      if (res.code === 1000 && res.data) {
        setCurrentGroupDetail(res.data)
      }
    })
  }

  // 获取商品活动相关
  const getMarketingCampaign = async (params: PostMarketingWebActivityGoodsDetailTagRequest) => {
    const { data, code, message } = await postMarketingWebActivityGoodsDetailTag(params, { ctlType: 'none' })
    if (code === 1000 && data) {
      setMarketingData(data as unknown as MarketingDetailType)
      // 如果有活动标签，则表示是活动商品
      if (data.tagDetailList && data.tagDetailList.length > 0) {
        if (
          data.tagDetailList.some(
            (item: { activityType: number }) => item.activityType === MarketingTypeEnum.activity_type_9,
          )
        ) {
          if (type === 3) {
            setHasActivity(true)
            // 判断是否含有拼团活动
            setIsGroupBuy(true)
          } else {
            setHasActivity(false)
            setIsGroupBuy(false)
          }
        } else {
          setHasActivity(true)
          setIsGroupBuy(false)
        }
      } else {
        setCurrentGroupDetail(undefined)
        setHasActivity(false)
        setIsGroupBuy(false)
      }
      return data
    }
    throw new Error(message)
  }

  return {
    marketingData,
    hasActivity,
    isGroupBuy,
    currentGroupDetail,
    getMarketingCampaign,
    getGroupDetail,
  }
}

export default useMarketing
