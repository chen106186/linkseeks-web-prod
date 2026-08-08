import React, { Fragment, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SrmHeader from '@/components/SrmHeader'
import SrmMainNav from '@/components/SrmMainNav'
import styles from './styles.module.less'

const SrmPortalLayout: React.FC = () => {
  const { pathname } = useLocation()
  const hideNavRoutes = ['/helpCenter']

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
          <SrmHeader />
          <SrmMainNav />
        </Fragment>
      )}
      <div className={styles.container}>
        <Outlet />
      </div>
    </Fragment>
  )
}

export default SrmPortalLayout
