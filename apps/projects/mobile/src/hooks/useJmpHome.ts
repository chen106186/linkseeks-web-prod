/**
 * @Description 跳转商城首页 hook
 */
import { GetCommodityMobileShopMobileShopSelectResponse, getCommodityMobileShopMobileShopSelect } from '@apps/apis'
import { ENVIRONMENT } from '@/constants'
import { showToast } from '@apps/mobile-services/utils/taro'
import useStores from '@/store/useStores'
import { ShopInfoType } from '@/store/userStore/model'
import Router from '@/utils/router'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { getLocalMallInfo } from '@apps/mobile-services/hooks/useEnterShopInfo'
import { SHOP_AND_SITE } from '@/constants/storage'

export const getAppShopTypeSelect = (): Promise<GetCommodityMobileShopMobileShopSelectResponse> => {
  return new Promise(async (resolve) => {
    try {
      const { data, code } = await getCommodityMobileShopMobileShopSelect({ environment: ENVIRONMENT } as any)
      if (code === 1000 && data) {
        resolve(data)
      } else {
        resolve({
          shopDefaultType: '1',
          shopSelectList: [],
        })
      }
    } catch (error) {
      resolve({
        shopDefaultType: '1',
        shopSelectList: [],
      })
    }
  })
}

const useJmpHome = () => {
  const { userStore } = useStores()
  const { setShopAndSite, setMallList, mallList } = userStore

  const jmpHome = async (info?: ShopInfoType) => {
    let shopInfo: ShopInfoType
    if (info) {
      shopInfo = info
    } else {
      shopInfo = getLocalMallInfo() as ShopInfoType
    }
    // 没有商城信息跳转选择商城设置页
    if (!shopInfo) {
      showToast({
        title: '暂无商城可访问～',
        icon: 'none',
      })
    } else {
      // 联营
      if (!shopInfo.isSelf) {
        if (shopInfo.property === 2) {
          // C端商城
          Router.reLaunch('extra/mall/client')
        } else {
          // B端商城
          Router.reLaunch('extra/mall/b2b')
        }
      } else {
        Router.reLaunch('extra/mall/own')
      }
    }
  }

  /**
   * 跳转默认商城
   */
  const jmpDefaultHome = async (): Promise<boolean> => {
    try {
      // 移动端默认商城 1为联营商城 2为自营商城
      const cacheShopInfo = (await getAsyncStorage(SHOP_AND_SITE)) as ShopInfoType
      let shopSelectList = mallList || []
      let shopDefaultType = shopSelectList.length > 0 ? (shopSelectList[0].isSelf ? '2' : '1') : '1'

      if (!shopSelectList.length) {
        const data = await getAppShopTypeSelect()
        shopSelectList = data.shopSelectList || []
        shopDefaultType = data.shopDefaultType || shopDefaultType
        setMallList(shopSelectList)
      }

      // 默认取第一个商城作为默认商城
      if (shopSelectList.length > 0) {
        const defaultMall = shopSelectList[0]
        switch (shopDefaultType) {
          // 联营商城
          case '1':
            setShopAndSite(defaultMall as unknown as ShopInfoType)
            jmpHome(defaultMall as unknown as ShopInfoType)
            break
          // 自营商城
          case '2':
            if (shopSelectList.length === 1) {
              setShopAndSite(defaultMall as unknown as ShopInfoType)
              jmpHome(defaultMall as unknown as ShopInfoType)
            } else if (cacheShopInfo && cacheShopInfo.isSelf) {
              setShopAndSite(cacheShopInfo)
              jmpHome(cacheShopInfo)
            } else {
              Router.redirectTo('extra/mall/own/select')
            }
            break
        }
      } else {
        if (cacheShopInfo) {
          setShopAndSite(cacheShopInfo)
          jmpHome(cacheShopInfo)
        } else {
          Router.redirectTo('user/login')
        }
      }
      return false
    } catch (error) {
      return false
    }
  }

  return {
    jmpHome,
    jmpDefaultHome,
    getAppShopTypeSelect,
  }
}

export default useJmpHome
