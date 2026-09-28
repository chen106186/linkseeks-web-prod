import { useShareAppMessage } from '@apps/mobile-services/utils/taro'
export const useShareHomePage = () => {
  useShareAppMessage((res) => {
    return {
      title: '淳物寻源',
      path: '/pages/splashView/index',
    }
  })
}
