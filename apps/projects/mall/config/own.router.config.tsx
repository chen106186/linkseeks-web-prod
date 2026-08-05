import { RouteObject } from 'react-router-dom'
import { LAYOUT_TYPE } from '@/types/global'
import OwnHome from '@/pages/ownHome'
import ownHomeLoader from '@/loaders/ownHomeLoader'
import commodityLoader from '@/loaders/commodityLoader'
import commodityDetailLoader from '@/loaders/commodityDetailLoader'
import infoHomeLoader from '@/loaders/infoHomeLoader'
import cpecialPageLoader from '@/loaders/cpecialPageLoader'

import Commodity from '@/pages/commodity'
import Integral from '@/pages/integral'
import OwnAboutUs from '@/pages/aboutUs/own'
import PurchaseOrder from '@/pages/purchaseOrder'
import CommodityDetail from '@/pages/commodityDetail'
import GroupCommodityDetail from '@/pages/commodityDetail/group'
import IntegralCommodityDetail from '@/pages/commodityDetail/integral'
import Order from '@/pages/order'
import PayResult from '@/pages/payResult'
import Pay from '@/pages/pay'
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
import InquiryCommodity from '@/pages/commodity/inquiry'
import ActivityCommodity from '@/pages/activityCommodity'
import { commonPrefix } from './routes.config'

/**
 * 自营商城路由
 */
const ownRoutes = (commonPrefix: string): RouteObject[] => {
  /** 自营商城路由前缀 */
  const prefixUrl = `${commonPrefix}/:memberId`

  return [
    {
      // 自营商城首页
      path: prefixUrl,
      loader: ownHomeLoader,
      element: <OwnHome />,
    },
    {
      path: `${prefixUrl}/commodity`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.own }),
      element: <Commodity />,
    },
    {
      path: `${prefixUrl}/commodity/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.own }),
      element: <Commodity />,
    },
    {
      path: `${prefixUrl}/inquiry`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.own }),
      element: <InquiryCommodity />,
    },
    {
      path: `${prefixUrl}/inquiry/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.own }),
      element: <InquiryCommodity />,
    },
    {
      path: `${prefixUrl}/integral`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.ownScore }),
      element: <Integral />,
    },
    {
      path: `${prefixUrl}/integral/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.ownScore }),
      element: <Integral />,
    },
    {
      path: `${prefixUrl}/about`,
      loader: ownHomeLoader,
      element: <OwnAboutUs />,
    },
    {
      path: `${prefixUrl}/commodity/detail/:commodityId`,
      loader: commodityDetailLoader,
      element: <CommodityDetail />,
    },
    {
      path: `${prefixUrl}/group/detail/:commodityId`,
      loader: commodityDetailLoader,
      element: <GroupCommodityDetail />,
    },
    {
      path: `${prefixUrl}/inquiry/detail/:commodityId`,
      loader: commodityDetailLoader,
      element: <CommodityDetail />,
    },
    {
      path: `${prefixUrl}/integral/detail/:commodityId`,
      loader: commodityDetailLoader,
      element: <IntegralCommodityDetail />,
    },
    {
      path: `${prefixUrl}/purchaseOrder`,
      element: <PurchaseOrder />,
    },
    {
      path: `${prefixUrl}/order`,
      element: <Order />,
    },
    {
      path: `${prefixUrl}/pay`,
      element: <Pay />,
    },
    {
      path: `${prefixUrl}/pay/result`,
      element: <PayResult />,
    },
    {
      // 帮助中心
      path: `${prefixUrl}/helpCenter`,
      element: <HelpCenter />,
    },
    {
      path: `${prefixUrl}/helpCenter/:id`,
      element: <HelpCenter />,
    },
    {
      // 行情资讯
      path: `${prefixUrl}/info`,
      loader: infoHomeLoader,
      element: <InfoIndex />,
    },
    {
      // 行情资讯-标签搜索
      path: `${prefixUrl}/info/labelSearch/:id`,
      element: <InfoLabelSearch />,
    },
    {
      // 行情资讯-每日行情
      path: `${prefixUrl}/info/infoList/:id`,
      element: <InfoList />,
    },
    {
      // 行情资讯-搜索结果
      path: `${prefixUrl}/info/searchResult`,
      element: <InfoSearchResult />,
    },
    {
      // 行情资讯-资讯详情
      path: `${prefixUrl}/info/infoDetail/:id`,
      element: <InfoDetail />,
    },
    {
      path: `${prefixUrl}/makeUpList/:id`,
      element: <MakeUpList />,
    },
    {
      path: `${prefixUrl}/makeUpList/activity/:id`,
      element: <MakeUpActivityList />,
    },
    {
      path: `${prefixUrl}/activity/:id`,
      element: <Activity />,
    },
    {
      // 专题页
      path: `${prefixUrl}/cpecialPage/:id`,
      loader: cpecialPageLoader,
      element: <CpecialPage />,
    },
    {
      path: `${prefixUrl}/activityCommodity`,
      element: <ActivityCommodity />,
    },
  ]
}

export default ownRoutes
