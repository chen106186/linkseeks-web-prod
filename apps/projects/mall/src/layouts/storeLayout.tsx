import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import ShopHeader from '@/components/ShopHeader'
import ShopMainNav from '@/components/ShopMainNav'
import { useGlobalConext } from '@/context/globalProvider'
import SearchShopResult from '@/components/SearchShopResult'
import { StoreProvider, useInitStore } from '@/context/storeProvider'
import SideNav from '@/components/SideNav'
import styles from './styles.module.less'

const StoreLayout: React.FC = () => {
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
      <ShopHeader />
      <ShopMainNav />
      <SideNav />
      <div className={styles.container}>
        <Outlet />
      </div>
    </StoreProvider>
  )
}

export default StoreLayout
