import useStores from '@/store/useStores'
import Router from '@/utils/router'

const useSwitchMall = () => {
  const { userStore, templateStore } = useStores()
  const { shopAndSite } = userStore
  const fetchMall = async () => {
    if (shopAndSite) {
      // 企业商城 根据商城属性判断是跳转联营商城还是自营商城
      if (shopAndSite.isSelf) {
        await templateStore.getSelfMallDesignConfig(shopAndSite.id, shopAndSite.memberId)
        Router.reLaunch('extra/mall/own')
      } else {
        if (shopAndSite.property === 2) {
          // C端商城
          if (!templateStore.clientMallDesignConfig) {
            await templateStore.getClientMallDesignConfig()
            Router.reLaunch('extra/mall/client')
          } else {
            Router.reLaunch('extra/mall/client')
          }
        } else {
          await templateStore.getMallDesignConfig(shopAndSite.id)
          Router.reLaunch('extra/mall/b2b')
        }
      }
    }
  }

  return {
    fetchMall,
  }
}

export default useSwitchMall
