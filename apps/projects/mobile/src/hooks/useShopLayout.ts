import { LAYOUT_TYPE } from '@/constants/const/shop'
import useStores from '@/store/useStores'

const useShopLayout = (isShop?: boolean): LAYOUT_TYPE => {
  const {
    userStore: { shopAndSite },
  } = useStores()

  if (shopAndSite?.isSelf) {
    return LAYOUT_TYPE.own
  } else {
    if (isShop) {
      return LAYOUT_TYPE.shop
    } else {
      return LAYOUT_TYPE.spot
    }
  }
}

export default useShopLayout
