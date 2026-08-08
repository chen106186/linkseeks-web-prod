import React, { memo } from 'react'
import { Footer } from '@apps/design-ui'
import { LAYOUT_TYPE } from '@/types/global'
import useInitData from '@/hooks/useInitData'
import TopBar from '@/components/TopBar'
import SearchShopResult from '@/components/SearchShopResult'
import { useLocation } from 'react-router-dom'
import ErrorLayout from '@apps/layouts/ErrorLayout'
import { PurchaseOrderProvider, useInitPurcaseOrder } from '../context/purchaseOrderProvider'
import { GlobalProvider } from '../context/globalProvider'
import OwnMallLayout from './ownMallLayout'
import JointMallLayout from './jointMallLayout'
import StoreLayout from './storeLayout'
import ShopIndexLayout from './shopIndexLayout'
import InfoLayout from './infoLayout'
import SrmPortalLayout from './srmPortalLayout'
import MainPortalLayout from './mainPortalLayout'
import LogisticsPortalLayout from './logisticsPortalLayout'
import ProcessPortalLayout from './processPortalLayout'

const LAYOUT_MAP = {
  // 联营商城布局
  [LAYOUT_TYPE.joint]: JointMallLayout,
  // 自营商城布局
  [LAYOUT_TYPE.own]: OwnMallLayout,
  // 店铺布局
  [LAYOUT_TYPE.shop]: StoreLayout,
  // 采购门户布局
  [LAYOUT_TYPE.srm]: SrmPortalLayout,
  // 主门户布局
  [LAYOUT_TYPE.mainPortal]: MainPortalLayout,
  // 物流门户
  [LAYOUT_TYPE.logistics]: LogisticsPortalLayout,
  // 加工门户
  [LAYOUT_TYPE.process]: ProcessPortalLayout,
  // 采购门户主页
  [LAYOUT_TYPE.shopIndex]: ShopIndexLayout,
}

const judgeIsInfoRoute = (path: string): boolean => {
  if (path && path.indexOf('info') > -1) {
    return true
  }
  return false
}

const ThemeLayout: React.FC = () => {
  const { layoutType, globalState } = useInitData()
  const state = useInitPurcaseOrder(globalState?.mallInfo, globalState?.userInfo)
  const { pathname } = useLocation()

  let Layout = LAYOUT_MAP[layoutType]

  if (!Layout) {
    return null
  }

  if (judgeIsInfoRoute(pathname)) {
    Layout = InfoLayout
  }

  const geteEnterpricseShopId = () => {
    if (globalState?.mallInfo?.type === 1) {
      return globalState?.mallInfo.id
    }
    return globalState.mallUrl?.defaultEnterprise?.id || 1
  }

  return (
    <ErrorLayout>
      <GlobalProvider value={globalState}>
        {globalState?.mallInfo ? (
          <PurchaseOrderProvider value={state}>
            <TopBar />
            <Layout />
            <Footer shopId={geteEnterpricseShopId()} {...globalState?.footerDesignConfig} linkdisable={false} />
          </PurchaseOrderProvider>
        ) : (
          <SearchShopResult />
        )}
      </GlobalProvider>
    </ErrorLayout>
  )
}

export default memo(ThemeLayout)
