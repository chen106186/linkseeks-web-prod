import React, { Fragment, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import styles from './styles.module.less'

const MainPortalLayout: React.FC = () => {
  useEffect(() => {
    if (!import.meta.env.SSR) {
      const body = document.getElementsByTagName('body')[0]
      body.className = `theme-mall-science`
    }
  }, [])

  return (
    <Fragment>
      <div className={styles.container}>
        <Outlet />
      </div>
    </Fragment>
  )
}

export default MainPortalLayout
