import { useShareAppMessage } from '@apps/mobile-services/utils/taro'
export const useShareHomePage = () => {
  useShareAppMessage((res) => {
    return {
      title: '云净链',
      path: '/pages/splashView/index',
    }
  })
}
