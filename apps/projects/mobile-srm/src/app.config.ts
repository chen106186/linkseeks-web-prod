import {
  rootRouter,
  requisitionRouter,
  addressRouter,
  userRouter,
  materialRouter,
  settlementRouter,
  supplierAbilityRouter,
  contractRouter,
} from './routes'

function factoryRouterPackage(name: string, routes: any) {
  return {
    root: `packages/${name}`,
    pages: Object.values(routes),
  }
}

/***************** 以上为自定义路由配置项 ********************** */

export default {
  pages: Object.values(rootRouter),
  subpackages: [
    factoryRouterPackage('requisition', requisitionRouter),
    factoryRouterPackage('address', addressRouter),
    factoryRouterPackage('user', userRouter),
    factoryRouterPackage('material', materialRouter),
    factoryRouterPackage('settlement', settlementRouter),
    factoryRouterPackage('supplierAbility', supplierAbilityRouter),
    factoryRouterPackage('contract', contractRouter),
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '瓴犀SRM小程序',
    navigationBarTextStyle: 'black',
  },
}
