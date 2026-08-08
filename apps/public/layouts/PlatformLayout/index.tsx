import { useRouter, useLocation, RouteItem } from '@linkseeks/router-core'
import { useEffect, useState } from 'react'
import { Layout } from '@linkseeks/ui'
import { useRequest } from '@linkseeks/hooks'
import Slide from './components/Slide'
import { MenuContext, getMenuData } from '../useMenu'
import OutSlide from './components/OutSlide'
import LayoutContent from './components/Content'
import useAuthMenu from '@apps/services/auth/useAuthMenu'
import { useRouteActive } from '@linkseeks/router-core'
import { ErrorLayout } from '..'
// import { getMemberAuthList } from '@apps/apis'

const getActiveService = (pathname: string) => {
  return '/' + pathname.split('/')[1]
}
export interface LayoutProps {
  /**
   * 自定义头部右边
   */
  rightContentRender?: () => React.ReactNode
}

// 手动添加需要忽略布局的路由
const excludeLayoutRoutes = ['/user']

const AdminLayout = (props: LayoutProps) => {
  const { rightContentRender } = props
  const { routeMenuData, routeMenuHashData } = useRouter()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const { menuRoutes } = useAuthMenu()
  const { activeCode } = useRouteActive()
  // const menuData = getMenuData(routeMenuData, { excludeLayoutRoutes })
  const menuProps = {
    menuData: menuRoutes,
    pathname,
    activeCode,
    collapsed,
    setCollapsed,
  }

  return (
    <ErrorLayout>
      <div className="platform-layout">
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
