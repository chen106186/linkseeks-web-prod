import { useGlobalConext } from '@/context/globalProvider'
import {
  GetManageContentInformationFindAllByRecommendLabelResponse,
  getManageContentInformationFindAllByRecommendLabel,
  getManageMemberInformationFindAllByRecommendLabel,
} from '@apps/apis'
import { useEffect, useState } from 'react'

const useHomeDate = () => {
  const { mallInfo } = useGlobalConext()
  const [newsList, setNewsList] = useState<GetManageContentInformationFindAllByRecommendLabelResponse>([])

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

  useEffect(() => {
    fetchLeadNews()
  }, [])

  return {
    newsList,
  }
}

export default useHomeDate
