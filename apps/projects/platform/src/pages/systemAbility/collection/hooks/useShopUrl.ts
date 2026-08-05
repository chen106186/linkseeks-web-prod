import { REQUEST_HEADER, TOP_DOMAIN } from '@apps/constants'
import { getCommodityShopAllByShopType, getCommodityShopListShopByReq } from '@apps/apis'
import { useEffect, useState } from 'react'

interface IProps {
  /**
   * 商城类型
   * 1 :ENTERPRISE
   * 2 :PURCHASE
   * 3 :LOGISTICS
   * 4 :PROCESS
   * 5 :INFORMATION
   * 6 :MAIN_PORTAL
   * 7 :SCORE
   */
  shopType: number
}

const useShopUrl = ({ shopType }: IProps) => {
  const [link, setLink] = useState<string>()

  const getLinkByShopType = async () => {
    const params: any = {
      type: shopType,
      environment: 1,
      isSelf: 0,
    }
    const infoRes = await getCommodityShopListShopByReq(params)
    if (infoRes.code === 1000 && infoRes.data.length > 0) {
      const webInfoItem = infoRes.data[0]
      if (webInfoItem) {
        setLink(`${REQUEST_HEADER}${webInfoItem.url}.${TOP_DOMAIN}`)
      }
    }
  }

  useEffect(() => {
    if (shopType) {
      getLinkByShopType()
    }
  }, [shopType])

  return {
    shopLink: link,
  }
}

export default useShopUrl
