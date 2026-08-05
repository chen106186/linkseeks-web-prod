import { useEffect, useState } from 'react'
import { showToast, hideToast } from '@apps/mobile-services/utils/taro'
import useStores from '@/store/useStores'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import {
  getProductShopCommodityCollectGetCommodityCollect,
  postProductShopCommodityCollectDeleteCommodityCollect,
  postProductShopCommodityCollectSaveCommodityCollect,
} from '@apps/apis'
import { ProductInfo } from './useGetProductDetail'

type OptionsType = {
  /**
   * 商品id
   */
  productInfo: ProductInfo | null
  /**
   * 渠道会员id
   */
  channelMemberId?: number | undefined
}

/** 企业商城api, 分商品id，和skuid 两种 */
const ENTERPRISE_MAP = {
  collect: postProductShopCommodityCollectSaveCommodityCollect,
  delete: postProductShopCommodityCollectDeleteCommodityCollect,
}

let toastIns: any = null

/** 收藏 */
function useCollectionAction(options: OptionsType) {
  const [isCollected, setIsCollected] = useState<boolean>(false)
  const [collectLoading, setCollectLoading] = useState<boolean>(false)

  const {
    userStore: { userInfo },
  } = useStores()
  const intl = useIntl()

  useEffect(() => {
    /** 未登录或者没有获取到商品详情信息 */
    if (!userInfo || !options.productInfo) {
      return
    }
    async function getIsCollected() {
      const { data, code } = await getProductShopCommodityCollectGetCommodityCollect({
        commodityId: options.productInfo!.id.toString(),
      })
      if (code === 1000) {
        setIsCollected(data.isCollect)
      }
    }
    getIsCollected()
  }, [userInfo, options.productInfo])

  /**
   * 收藏/取消收藏操作
   * @productId 是指productInfo.id 不是商品id
   * @flag isCollected
   */
  const handleCollect = async (productId: number, flag: boolean) => {
    if (!productId) {
      return
    }
    if (!userInfo) {
      Router.navigateTo('user/login')
      return
    }
    if (collectLoading) {
      return
    }
    setCollectLoading(true)
    const normalParams = {
      commodityId: productId,
      type: 1,
    }

    const service = ENTERPRISE_MAP
    const mode = flag ? 'delete' : 'collect'
    const action = service[mode]
    const postData = normalParams
    const { code, message } = await action(postData)

    if (toastIns) {
      hideToast(toastIns)
    }
    try {
      if (code === 1000) {
        toastIns = showToast({
          title: flag
            ? intl.formatMessage({ id: 'commodityMerge.common.list.removed', defaultMessage: '取消收藏' })
            : intl.formatMessage({ id: 'commodityMerge.common.list.adding', defaultMessage: '已收藏' }),
          icon: 'none',
        })
        setIsCollected(!flag)
        return
      }
      if (code !== 1000 && message) {
        toastIns = showToast({
          title: message,
          icon: 'none',
        })
      }
    } finally {
      setCollectLoading(false)
    }
  }

  return { isCollected, collectLoading, handleCollect }
}

export default useCollectionAction
