import React, { Fragment, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import JointHeader from '@/components/JointHeader'
import JointMainNav from '@/components/JointMainNav'
import SideNav from '@/components/SideNav'
import styles from './styles.module.less'

const JointMallLayout: React.FC = () => {
  const { pathname } = useLocation()
  const hideNavRoutes = ['/purchaseOrder', '/order', '/pay', '/pay/result', '/helpCenter']

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
          <JointHeader />
          <JointMainNav />
          <SideNav />
        </Fragment>
      )}
      <div className={styles.container}>
        <Outlet />
      </div>
    </Fragment>
  )
}

export default JointMallLayout
