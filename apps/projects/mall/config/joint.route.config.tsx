import { RouteObject } from 'react-router-dom'
import { LAYOUT_TYPE } from '@/types/global'
import Loading from '@apps/components/src/web/Loading'
import loadable from '@loadable/component'
import commodityLoader from '@/loaders/commodityLoader'
import shopHomeLoader from '@/loaders/shopHomeLoader'
import commodityDetailLoader from '@/loaders/commodityDetailLoader'
import infoHomeLoader from '@/loaders/infoHomeLoader'
import cpecialPageLoader from '@/loaders/cpecialPageLoader'

import Commodity from '@/pages/commodity'
import InquiryCommodity from '@/pages/commodity/inquiry'
import Stores from '@/pages/stores'
import Integral from '@/pages/integral'
import CommodityDetail from '@/pages/commodityDetail'
import GroupCommodityDetail from '@/pages/commodityDetail/group'
import IntegralCommodityDetail from '@/pages/commodityDetail/integral'
import ShopHome from '@/pages/shopHome'
import ShopAboutUs from '@/pages/aboutUs/shop'
import AskPurchase from '@/pages/askPurchase'
import AskPurchaseDetail from '@/pages/askPurchase/detail'
import HelpCenter from '@/pages/helpCenter'
import InfoIndex from '@/pages/info/index'
import InfoLabelSearch from '@/pages/info/labelSearch'
import InfoList from '@/pages/info/infoList'
import InfoSearchResult from '@/pages/info/searchResult'
import InfoDetail from '@/pages/info/infoDetail'
import CpecialPage from '@/pages/cpecialPage'
import MakeUpList from '@/pages/makeUpList'
import MakeUpActivityList from '@/pages/makeUpList/activity'
import Activity from '@/pages/activity'
import ActivityCommodity from '@/pages/activityCommodity'

// 纯客户端渲染页面
const Order = loadable(() => import('@/pages/order'), { fallback: <Loading /> })
const PurchaseOrder = loadable(() => import('@/pages/purchaseOrder'), { fallback: <Loading /> })
const PayResult = loadable(() => import('@/pages/payResult'), { fallback: <Loading /> })
const Pay = loadable(() => import('@/pages/pay'), { fallback: <Loading /> })

/**
 * 联营商城路由
 */
const jointRoutes = (commonPrefix: string): RouteObject[] => {
  return [
    {
      path: `${commonPrefix}/commodity`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.joint }),
      element: <Commodity />,
    },
    {
      path: `${commonPrefix}/commodity/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.joint }),
      element: <Commodity />,
    },
    {
      path: `${commonPrefix}/shop/:storeId`,
      loader: shopHomeLoader,
      element: <ShopHome />,
    },
    {
      path: `${commonPrefix}/shop/:storeId/commodity`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shop }),
      element: <Commodity />,
    },
    {
      path: `${commonPrefix}/shop/:storeId/commodity/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shop }),
      element: <Commodity />,
    },
    {
      path: `${commonPrefix}/shop/:storeId/inquiry`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shop }),
      element: <InquiryCommodity />,
    },
    {
      path: `${commonPrefix}/shop/:storeId/inquiry/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shop }),
      element: <InquiryCommodity />,
    },
    {
      path: `${commonPrefix}/shop/:storeId/integral`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shopScoreMall }),
      element: <Integral />,
    },
    {
      path: `${commonPrefix}/shop/:storeId/integral/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shopScoreMall }),
      element: <Integral />,
    },
    {
      path: `${commonPrefix}/inquiry`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.joint }),
      element: <InquiryCommodity />,
    },
    {
      path: `${commonPrefix}/inquiry/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.joint }),
      element: <InquiryCommodity />,
    },
    {
      path: `${commonPrefix}/integral`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.jointScore }),
      element: <Integral />,
    },
    {
      path: `${commonPrefix}/integral/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.jointScore }),
      element: <Integral />,
    },
    {
      path: `${commonPrefix}/stores`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shopList }),
      element: <Stores />,
    },
    {
      path: `${commonPrefix}/stores/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shopList }),
      element: <Stores />,
    },
    {
      path: `${commonPrefix}/shop/:storeId/about`,
      element: <ShopAboutUs />,
    },
    {
      path: `${commonPrefix}/shop/:storeId/commodity/detail/:commodityId`,
      loader: commodityDetailLoader,
      element: <CommodityDetail />,
    },
    {
      path: `${commonPrefix}/commodity/detail/:commodityId`,
      loader: commodityDetailLoader,
      element: <CommodityDetail />,
    },
    {
      path: `${commonPrefix}/shop/:storeId/group/detail/:commodityId`,
      loader: commodityDetailLoader,
      element: <GroupCommodityDetail />,
    },
    {
      path: `${commonPrefix}/shop/:storeId/inquiry/detail/:commodityId`,
      loader: commodityDetailLoader,
      element: <CommodityDetail />,
    },
    {
      path: `${commonPrefix}/shop/:storeId/integral/detail/:commodityId`,
      loader: commodityDetailLoader,
      element: <IntegralCommodityDetail />,
    },
    {
      path: `${commonPrefix}/purchaseOrder`,
      element: <PurchaseOrder />,
    },
    {
      path: `${commonPrefix}/order`,
      element: <Order />,
    },
    {
      path: `${commonPrefix}/pay`,
      element: <Pay />,
    },
    {
      path: `${commonPrefix}/pay/result`,
      element: <PayResult />,
    },
    {
      path: `${commonPrefix}/askPurchase`,
      element: <AskPurchase />,
    },
    {
      path: `${commonPrefix}/askPurchaseDetail/:id`,
      element: <AskPurchaseDetail />,
    },
    {
      // 帮助中心
      path: `${commonPrefix}/helpCenter`,
      element: <HelpCenter />,
    },
    {
      // 帮助中心
      path: `${commonPrefix}/helpCenter/:id`,
      element: <HelpCenter />,
    },
    {
      // 行情资讯
      path: `${commonPrefix}/info`,
      loader: infoHomeLoader,
      element: <InfoIndex />,
    },
    {
      // 行情资讯-标签搜索
      path: `${commonPrefix}/info/labelSearch/:id`,
      element: <InfoLabelSearch />,
    },
    {
      // 行情资讯-每日行情
      path: `${commonPrefix}/info/infoList/:id`,
      element: <InfoList />,
    },
    {
      // 行情资讯-搜索结果
      path: `${commonPrefix}/info/searchResult`,
      element: <InfoSearchResult />,
    },
    {
      // 行情资讯-资讯详情
      path: `${commonPrefix}/info/infoDetail/:id`,
      element: <InfoDetail />,
    },
    {
      path: `${commonPrefix}/makeUpList/:id`,
      element: <MakeUpList />,
    },
    {
      path: `${commonPrefix}/makeUpList/activity/:id`,
      element: <MakeUpActivityList />,
    },
    {
      path: `${commonPrefix}/activity/:id`,
      element: <Activity />,
    },
    {
      // 专题页
      path: `${commonPrefix}/cpecialPage/:id`,
      loader: cpecialPageLoader,
      element: <CpecialPage />,
    },
    {
      path: `${commonPrefix}/activityCommodity`,
      element: <ActivityCommodity />,
    },
    {
      path: `${commonPrefix}/shop/:storeId/activityCommodity`,
      element: <ActivityCommodity />,
    },
  ]
}
export default jointRoutes
