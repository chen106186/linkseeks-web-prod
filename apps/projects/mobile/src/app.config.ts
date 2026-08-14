import {
  rootRouter,
  basicSettingRouter,
  orderRouter,
  afterServiceRouter,
  commodityMergeRouter,
  shopRouter,
  companyNewsRouter,
  membersRouter,
  categoryNavigation,
  activityRouter,
  userRouter,
  contractRouter,
  ashPurchaseRouter,
  imRouter,
  extraRouter,
  distributionRouter,
  teamLeaderRouter,
  communityGroupBuyRouter,
} from '@/routes'

function factoryRouterPackage(name: string, routes: any, plugins?: any) {
  return {
    root: `packages/${name}`,
    pages: Object.values(routes),
    plugins: plugins ? { ...plugins } : undefined,
  }
}
/***************** 以上为自定义路由配置项 ********************** */

export default {
  pages: Object.values(rootRouter),
  subpackages: [
    factoryRouterPackage('extra', extraRouter),
    factoryRouterPackage('basicSetting', basicSettingRouter),
    factoryRouterPackage('order', orderRouter),
    factoryRouterPackage('afterService', afterServiceRouter),
    factoryRouterPackage('companyNews', companyNewsRouter),
    factoryRouterPackage('members', membersRouter),
    factoryRouterPackage('commodityMerge', commodityMergeRouter),
    // factoryRouterPackage('commodityMerge', commodityMergeRouter, {
    //   ezplayer: {
    //     version: 'latest',
    //     provider: 'wxf2b3a0262975d8c2',
    //   },
    // }),
    factoryRouterPackage('contract', contractRouter),
    factoryRouterPackage('shop', shopRouter),
    factoryRouterPackage('categoryNavigation', categoryNavigation),
    factoryRouterPackage('activity', activityRouter),
    factoryRouterPackage('user', userRouter),
    factoryRouterPackage('askPurchase', ashPurchaseRouter),
    factoryRouterPackage('im', imRouter),
    factoryRouterPackage('distribution', distributionRouter),
    factoryRouterPackage('teamLeader', teamLeaderRouter),
    factoryRouterPackage('communityGroupBuy', communityGroupBuyRouter),
  ],
  window: {
    backgroundTextStyle: 'dark',
    backgroundColor: '#FCF7F1',
    navigationBarBackgroundColor: '#FCF7F1',
    navigationBarTitleText: '云链认养鲜',
    navigationBarTextStyle: 'black',
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示', // 高速公路行驶持续后台定位
    },
  },
  requiredPrivateInfos: [
    'getLocation', // 获取精确地理位置
  ],
  __usePrivacyCheck__: true, //开启隐私校验
}
