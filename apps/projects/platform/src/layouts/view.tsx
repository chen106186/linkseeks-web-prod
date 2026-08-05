import PlatformLayout from '@apps/layouts/PlatformLayout'
import { Outlet, useLocation } from '@linkseeks/router-core'
import { HOME_PATH, SRM_PURCHASER_HOME_PATH } from '@/constants/home'
import UserLayouts from './UserLayouts'
import RightContent from './components/RightContent'

const Layout = () => {
  const { pathname } = useLocation()
  if (/^\/user/.test(pathname)) {
    return (
      <UserLayouts>
        <Outlet />
      </UserLayouts>
    )
  }

  if (
    /h5/.test(pathname) ||
    /design/.test(pathname) ||
    /fixtures/.test(pathname) ||
    /contract\/template\/templateList\/preview/.test(pathname)
  ) {
    return <Outlet />
  }

  return <PlatformLayout rightContentRender={() => <RightContent />} />
}

export default Layout
