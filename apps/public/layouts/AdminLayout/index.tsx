import { useRouter, useLocation, RouteItem, useOutlet, useRouteActive } from '@linkseeks/router-core'
import { useEffect, useState } from 'react'
import { Layout } from '@linkseeks/ui'
import { useRequest } from '@linkseeks/hooks'
import Slide from './components/Slide'
import { MenuContext, getMenuData } from '../useMenu'
import OutSlide from './components/OutSlide'
import LayoutContent from './components/Content'
import useAuthMenu from '@apps/services/auth/useAuthMenu'
import { Loading } from '@apps/components'
import { ErrorLayout } from '..'

const getActiveService = (pathname: string) => {
  return '/' + pathname.split('/')[1]
}
export interface LayoutProps {
  /**
   * 自定义头部右边
   */
  rightContentRender?: () => React.ReactNode
}

const AdminLayout = (props: LayoutProps) => {
  const { rightContentRender } = props
  // const { routeMenuData, routeMenuHashData } = useRouter()
  const { pathname } = useLocation()
  const [activeService, setActiveService] = useState('')
  const { activeCode } = useRouteActive()
  const [collapsed, setCollapsed] = useState(false)
  const { menuRoutes } = useAuthMenu()

  const menuProps = {
    menuData: menuRoutes,
    pathname,
    activeCode,
    collapsed,
    setCollapsed,
  }

  return (
    <ErrorLayout>
      <div className="admin-layout">
        <MenuContext.Provider value={menuProps}>
          <Layout style={{ height: '100vh' }}>
            <OutSlide />
            <Slide />
            <LayoutContent rightContentRender={rightContentRender} />
          </Layout>
        </MenuContext.Provider>
      </div>
    </ErrorLayout>
  )
}

export default AdminLayout
