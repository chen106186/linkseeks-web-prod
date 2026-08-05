import { useGlobalConext } from '@/context/globalProvider'
import {
  GetManageContentInformationFindAllByRecommendLabelResponse,
  getManageContentInformationFindAllByRecommendLabel,
  getManageMemberInformationFindAllByRecommendLabel,
  getOrderCommonShopProductHistoryPage,
  getTradeInquiryGetShopInquiryList,
} from '@apps/apis'
import { TradeItemType } from '@apps/design-ui/src/Web/FindMore/components/newTrade'
import { InquiryItemType } from '@apps/design-ui/src/Web/FindMore/components/shoppingNews'
import { useEffect, useState } from 'react'

const useHomeDate = (visible = false) => {
  const { mallInfo, userInfo } = useGlobalConext()
  const [newsList, setNewsList] = useState<GetManageContentInformationFindAllByRecommendLabelResponse>([])
  const [inquiryList, setInquiryList] = useState<InquiryItemType[]>([])
  const [tradeList, setTradeList] = useState<TradeItemType[]>([])

  const fetchNewByLabel = (label: string) => {
    // 1-头条文章 2-轮播新闻 3-图片新闻 4-推荐阅读
    return new Promise((resolve, reject) => {
      const requestApi = mallInfo?.isMemberOperate
        ? getManageMemberInformationFindAllByRecommendLabel
        : getManageContentInformationFindAllByRecommendLabel
      requestApi({
        recommendLabel: label,
        memberId: String(mallInfo?.memberId),
        roleId: String(mallInfo?.memberRoleId),
      })
        .then((res: { code: number; data: unknown }) => {
          if (res.code === 1000) {
            resolve(res.data)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
  }

  /**
   * 获取推荐阅读
   */
  const fetchLeadNews = async () => {
    try {
      const data: any = await fetchNewByLabel('4')
      setNewsList(data)
    } catch (error) {
      console.log(error)
    }
  }

  /** 获取商品询价动态 */
  const fetchInquiryList = () => {
    const params: any = {
      current: 1,
      pageSize: 24,
      shopId: mallInfo?.id,
    }
    getTradeInquiryGetShopInquiryList(params).then((res: any) => {
      if (res.code === 1000) {
        setInquiryList(res.data.data)
      }
    })
  }

  /** 获取交易记录 */
  const fetchTradeList = () => {
    const params: any = {
      current: 1,
      pageSize: 24,
      shopId: mallInfo?.id,
    }
    getOrderCommonShopProductHistoryPage(params).then((res: any) => {
      if (res.code === 1000) {
        setTradeList(res.data.data)
      }
    })
  }

  useEffect(() => {
    if (visible) {
      fetchLeadNews()
      fetchInquiryList()
      fetchTradeList()
    }
  }, [userInfo, visible])

  return {
    newsList,
    inquiryList,
    tradeList,
  }
}

export default useHomeDate
