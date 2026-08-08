import { useShareAppMessage } from '@apps/mobile-services/utils/taro'
export const useShareHomePage = () => {
  useShareAppMessage((res) => {
    return {
      title: '云链认养鲜',
      path: '/pages/splashView/index',
    }
  })
}
