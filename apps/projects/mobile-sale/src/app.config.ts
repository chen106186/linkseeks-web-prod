import { mergeRouter } from '@/routes'

/***************** 以上为自定义路由配置项 ********************** */

export default {
  pages: Object.values(mergeRouter),
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '瓴犀业务员小程序',
    navigationBarTextStyle: 'black',
  },
}
