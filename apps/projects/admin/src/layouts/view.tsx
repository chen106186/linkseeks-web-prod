import AdminLayout from '@apps/layouts/AdminLayout'
import { Outlet, useLocation } from '@linkseeks/router-core'
import RightContent from './RightContent'

const Layout = () => {
  const { pathname } = useLocation()

  if (/^\/user/.test(pathname) || /design/.test(pathname) || /fixtures/.test(pathname)) {
    return <Outlet />
  }

  return <AdminLayout rightContentRender={() => <RightContent />} />
}

export default Layout
