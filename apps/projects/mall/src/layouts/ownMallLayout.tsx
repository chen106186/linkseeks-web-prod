import React, { Fragment, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import OwnHeader from '@/components/OwnHeader'
import OwnMainNav from '@/components/OwnMainNav'
import useLink from '@/hooks/useLink'
import SideNav from '@/components/SideNav'
import styles from './styles.module.less'

const OwnMallLayout: React.FC = () => {
  const { linkPrefix } = useLink()
  const { pathname } = useLocation()

  const hideNavRoutes = [
    linkPrefix('/purchaseOrder'),
    linkPrefix('/order'),
    linkPrefix('/pay'),
    linkPrefix('/pay/result'),
    linkPrefix('/helpCenter'),
  ]

  useEffect(() => {
    if (!import.meta.env.SSR) {
      const body = document.getElementsByTagName('body')[0]
      body.className = `theme-mall-science`
    }
  }, [])

  const judgeShowNavAndHeader = (): boolean => {
    if (hideNavRoutes.some((router) => pathname.indexOf(router) !== -1)) {
      return false
    }
    return true
  }

  return (
    <Fragment>
      {judgeShowNavAndHeader() && (
        <Fragment>
          <OwnHeader />
          <OwnMainNav />
          <SideNav />
        </Fragment>
      )}
      <div className={styles.container}>
        <Outlet />
      </div>
    </Fragment>
  )
}

export default OwnMallLayout
