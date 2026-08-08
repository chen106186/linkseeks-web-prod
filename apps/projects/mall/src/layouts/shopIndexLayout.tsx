import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useGlobalConext } from '@/context/globalProvider'
import SearchShopResult from '@/components/SearchShopResult'
import { StoreProvider, useInitStore } from '@/context/storeProvider'
import ShopTop from '@/pages/srm/components/ShopTop'
import ShopNav from '@/pages/srm/components/ShopNav'
import styles from './styles.module.less'

const ShopIndexLayout: React.FC = () => {
  const { shopInfo } = useGlobalConext()
  const state = useInitStore()

  useEffect(() => {
    if (!import.meta.env.SSR) {
      const body = document.getElementsByTagName('body')[0]
      body.className = `theme-shop-science`
    }
  }, [])

  if (!shopInfo) {
    return <SearchShopResult />
  }

  return (
    <StoreProvider value={state}>
      <ShopTop />
      <ShopNav />
      <div className={styles.container}>
        <Outlet />
      </div>
    </StoreProvider>
  )
}

export default ShopIndexLayout
