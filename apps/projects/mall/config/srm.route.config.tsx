import { RouteObject } from 'react-router-dom'
import PurchaseInquiry from '@/pages/srm/purchaseInquiry'
import PurchaseBidding from '@/pages/srm/purchaseBidding'
import PurchaseCompete from '@/pages/srm/purchaseCompete'
import EnterprisePurchasing from '@/pages/srm/enterprisePurchasing'
import PurchasePublicity from '@/pages/srm/purchasePublicity'
import InquiryDetail from '@/pages/srm/purchaseInquiry/detail'
import BiddingDetail from '@/pages/srm/purchaseBidding/detail'
import CompeteDetail from '@/pages/srm/purchaseCompete/detail'
import PublicityDetail from '@/pages/srm/purchasePublicity/detail'
import ShopIndex from '@/pages/srm/shopIndex'
import ShopAboutUs from '@/pages/aboutUs/shopIndex'

import commodityLoader from '@/loaders/commodityLoader'
import srmHomeLoader from '@/loaders/shopIndexLoader'
import { LAYOUT_TYPE } from '@/types/global'

/**
 * 采购门户路由
 */
const srmRoutes = (commonPrefix: string): RouteObject[] => {
  return [
    {
      path: `${commonPrefix}/purchaseInquiry`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.srm }),
      element: <PurchaseInquiry />,
    },
    {
      path: `${commonPrefix}/purchaseInquiry/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.srm }),
      element: <PurchaseInquiry />,
    },
    {
      path: `${commonPrefix}/purchaseBidding`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.srm }),
      element: <PurchaseBidding />,
    },
    {
      path: `${commonPrefix}/purchaseBidding/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.srm }),
      element: <PurchaseBidding />,
    },
    {
      path: `${commonPrefix}/purchaseCompete`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.srm }),
      element: <PurchaseCompete />,
    },
    {
      path: `${commonPrefix}/purchaseCompete/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.srm }),
      element: <PurchaseCompete />,
    },
    {
      path: `${commonPrefix}/purchasePublicity`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.srm }),
      element: <PurchasePublicity />,
    },
    {
      path: `${commonPrefix}/purchasePublicity/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.srm }),
      element: <PurchasePublicity />,
    },
    {
      path: `${commonPrefix}/enterprisePurchasing`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.srm }),
      element: <EnterprisePurchasing />,
    },
    {
      path: `${commonPrefix}/enterprisePurchasing/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.srm }),
      element: <EnterprisePurchasing />,
    },
    {
      path: `${commonPrefix}/inquiryDetail/:id`,
      element: <InquiryDetail />,
    },
    {
      path: `${commonPrefix}/biddingDetail/:id`,
      element: <BiddingDetail />,
    },
    {
      path: `${commonPrefix}/competeDetail/:id`,
      element: <CompeteDetail />,
    },
    {
      path: `${commonPrefix}/publicityDetail/:id`,
      element: <PublicityDetail />,
    },
    {
      path: `${commonPrefix}/shopIndex/:purchaserId`,
      loader: srmHomeLoader,
      element: <ShopIndex />,
    },
    {
      path: `${commonPrefix}/shopIndex/:purchaserId/purchaseInquiry`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shopIndex }),
      element: <PurchaseInquiry />,
    },
    {
      path: `${commonPrefix}/shopIndex/:purchaserId/purchaseInquiry/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shopIndex }),
      element: <PurchaseInquiry />,
    },
    {
      path: `${commonPrefix}/shopIndex/:purchaserId/purchaseBidding`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shopIndex }),
      element: <PurchaseBidding />,
    },
    {
      path: `${commonPrefix}/shopIndex/:purchaserId/purchaseBidding/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shopIndex }),
      element: <PurchaseBidding />,
    },
    {
      path: `${commonPrefix}/shopIndex/:purchaserId/purchaseCompete`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shopIndex }),
      element: <PurchaseCompete />,
    },
    {
      path: `${commonPrefix}/shopIndex/:purchaserId/purchaseCompete/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shopIndex }),
      element: <PurchaseCompete />,
    },
    {
      path: `${commonPrefix}/shopIndex/:purchaserId/purchasePublicity`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shopIndex }),
      element: <PurchasePublicity />,
    },
    {
      path: `${commonPrefix}/shopIndex/:purchaserId/purchasePublicity/:filter`,
      loader: ({ params, request }) => commodityLoader({ params, request, layoutType: LAYOUT_TYPE.shopIndex }),
      element: <PurchasePublicity />,
    },
    {
      path: `${commonPrefix}/shopIndex/:purchaserId/aboutUs`,
      element: <ShopAboutUs />,
    },
  ]
}
export default srmRoutes
