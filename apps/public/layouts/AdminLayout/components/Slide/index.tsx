import { Layout, Menu } from 'antd'
import { useMemo } from 'react'
import { RhombusIcon, ChevronRightIcon } from '@linkseeks/icons'
import { RouteItem, Link } from '@linkseeks/router-core'
import { useMenu } from '../../../useMenu'
import { useSlideMenu } from './useSlideMenu'
import style from './index.less'

const { Sider } = Layout
const IsNoSlideMenuList = ['/home', '/403', '/404', '/customerManage']

const Slide = (props) => {
  const { menuData, pathname, collapsed } = useMenu()
  const { defaultSelectedKeys, slideTitle } = useSlideMenu()
  const isNoSlideMenu = useMemo(() => IsNoSlideMenuList.includes(pathname), [pathname])

  const subMenuData = useMemo(() => {
    const result = menuData.find((v) => pathname.includes(v.path))

    if (result) {
      return result.children?.filter((r) => r.menuMeta) || []
    } else {
      return []
    }
  }, [menuData, pathname])

  const LinkItem = ({ path, title, isSelf }: any) => {
    return (
      <Link to={path} reloadDocument={isSelf}>
        {title}
      </Link>
    )
  }
  // 渲染菜单项
  const getMenuItems = (routes: RouteItem[], isSubMenu?: boolean) => {
    return routes.map(({ children, routeKey, title, path }) => {
      const isFirstMenu = isSubMenu !== false && children && children.length > 0
      return Object.assign(
        {
          key: routeKey,
          icon: isSubMenu !== false ? null : <RhombusIcon size={14} />,
          label: isFirstMenu ? title : <LinkItem path={path} title={title} isSelf={pathname === path} />,
          title: title,
        },
        children && children.length > 0 ? { children: getMenuItems(children!, false) } : {},
      )
    })
  }

  return (
    <Sider className={style['sider']} width={isNoSlideMenu || collapsed ? 0 : 200} trigger={null}>
      {!isNoSlideMenu && (
        <>
          <div className={style['slide-header']}>
            <h6 className={style['slide-header-text']}>平台后台</h6>
          </div>
          <div className={style['slide-sub-header']}>
            {slideTitle && <span className={style['slide-header-sub-text']}>{`${slideTitle}管理`}</span>}
          </div>
          <Menu
            mode="inline"
            className={style.menuSlider}
            items={getMenuItems(subMenuData)}
            inlineIndent={8}
            defaultSelectedKeys={defaultSelectedKeys}
            defaultOpenKeys={defaultSelectedKeys}
            expandIcon={(props) => (
              <ChevronRightIcon
                style={{ transform: props.isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s' }}
                size={14}
              />
            )}
          />
        </>
      )}
    </Sider>
  )
}

export default Slide
