import { useEffect, useState } from 'react'
import { COMMODITY_TYPE } from '@/constants'
import { useGlobalConext } from '@/context/globalProvider'
import { LAYOUT_TYPE } from '@/types/global'
import { useParams } from 'react-router-dom'
import {
  GetProductShopStoreGetCommodityDetailResponse,
  PostProductShopStoreGetCommodityListResponseDetail,
  getMemberBusinessLrcRightPointGet,
  getMemberManageUpperCreditParamGet,
  postProductShopScoreGetCommodityList,
  postProductShopStoreGetCommodityList,
  getProductShopStoreGetCommodityDetail,
} from '@apps/apis'

const useCommodityDetail = (type: number, detail: GetProductShopStoreGetCommodityDetailResponse) => {
  const { shopInfo, mallInfo, userInfo, layoutType } = useGlobalConext()
  const [pointInfo, setPointInfo] = useState<{ memberScore: number; platformScore: number }>()
  const [parameter, setParameter] = useState<number>() // 权益参数
  const [commodityDetail, setCommodityDetail] = useState<GetProductShopStoreGetCommodityDetailResponse>(detail)
  const [commonCategoryCommodityList, setCommonCategoryCommodityList] = useState<
    PostProductShopStoreGetCommodityListResponseDetail[]
  >([])
  const { commodityId } = useParams()

  useEffect(() => {
    const fetchCommodityDetail = async () => {
      if (!commodityId) return
      const params = {
        commodityId,
      }
      let headers = {
        shopId: mallInfo?.id,
      }

      const { code, data } = await getProductShopStoreGetCommodityDetail(params, { headers })
      if (code === 1000 && data) {
        setCommodityDetail(data)
      }
    }
    if (!import.meta.env.DEV || !commodityDetail) {
      fetchCommodityDetail()
    }
  }, [])

  /**
   * 获取会员权益参数
   * @param memberId
   * @param memberRoleId
   */
  const getMemberCredit = (memberId: number, memberRoleId: number) => {
    const param: any = {
      parentMemberId: memberId,
      parentMemberRoleId: memberRoleId,
    }
    getMemberManageUpperCreditParamGet(param).then((res) => {
      if (res.code === 1000) {
        setParameter(res.data?.parameter)
      }
    })
  }

  /**
   * 获取会员积分信心
   */
  const fetchPointInfo = () => {
    if (userInfo) {
      const param: any = {
        memberId: commodityDetail?.memberId,
        roleId: commodityDetail?.memberRoleId,
      }
      getMemberBusinessLrcRightPointGet(param).then((res: any) => {
        if (res.code === 1000) {
          setPointInfo(res.data)
        }
      })
    }
  }

  useEffect(() => {
    if (userInfo && commodityDetail) {
      getMemberCredit(commodityDetail.memberId, commodityDetail.memberRoleId)
    }
  }, [userInfo, commodityDetail])

  useEffect(() => {
    if (type === 2 && commodityDetail) {
      fetchPointInfo()
    }
  }, [commodityDetail])

  /**
   * 获取”买家还在看“商品列表
   * @param categoryId
   * @param priceType
   */
  const fetchCommonCategoryCommodityList = (categoryId: number, priceType: number) => {
    const param: any = {
      current: 1,
      pageSize: 10,
      customerCategoryId: categoryId,
    }
    let headers: any = {
      shopId: mallInfo?.id,
      type,
    }
    let getListFn
    switch (layoutType) {
      case LAYOUT_TYPE.shop:
        param.storeId = shopInfo?.id
        switch (priceType) {
          case COMMODITY_TYPE.prompt:
            param.priceTypeList = [1]
            getListFn = postProductShopStoreGetCommodityList
            break
          case COMMODITY_TYPE.inquiry:
            param.priceTypeList = [2]
            getListFn = postProductShopStoreGetCommodityList
            break
          case COMMODITY_TYPE.integral:
            param.priceTypeList = [3]
            getListFn = postProductShopScoreGetCommodityList
            break
          default:
            break
        }
        break
      default:
        break
    }
    getListFn &&
      getListFn(param, { headers, ctlType: 'none' }).then((res) => {
        if (res.code === 1000) {
          setCommonCategoryCommodityList(res.data.data)
        }
      })
  }

  useEffect(() => {
    if (commodityDetail && commodityDetail.customerCategoryId) {
      fetchCommonCategoryCommodityList(commodityDetail.customerCategoryId, commodityDetail.priceType)
    }
  }, [commodityDetail])

  return {
    commodityDetail,
    pointInfo,
    parameter,
    commonCategoryCommodityList,
    fetchCommonCategoryCommodityList,
  }
}

export default useCommodityDetail
