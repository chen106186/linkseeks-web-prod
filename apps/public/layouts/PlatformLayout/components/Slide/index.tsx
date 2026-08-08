import { Layout, Menu } from 'antd'
import { useMemo, useEffect } from 'react'
import { RhombusIcon, ChevronRightIcon } from '@linkseeks/icons'
import { RouteItem, Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { useMenu } from '../../../useMenu'
import { useSlideMenu } from './useSlideMenu'
import style from './index.less'

const { Sider } = Layout
const IsNoSlideMenuList = ['/home', '/srmHome', '/403', '/404', '/500']
const Slide = () => {
  const intl = useIntl()
  const { menuData, pathname, collapsed, setCollapsed } = useMenu()
  const { defaultSelectedKeys, slideTitle } = useSlideMenu()
  const isNoSlideMenu = useMemo(() => IsNoSlideMenuList.includes(pathname), [pathname])
  const subMenuData = useMemo(() => {
    const abilityName = pathname.split('/')[1]
    const result = menuData.find((v) => v.code === abilityName)

    /**
     * 递归遍历所有菜单项，只返回menuMeta为true的
     */
    const filterChildren = (data: any[]) => {
      return data.filter((r) => {
        if (r.children) {
          r.children = filterChildren(r.children)
        }
        return r.menuMeta
      })
    }

    if (result) {
      return filterChildren(result.children || [])
    } else {
      return []
    }
  }, [menuData, pathname])

  useEffect(() => {
    if (subMenuData.length === 0) {
      setCollapsed(true)
    } else {
      setCollapsed(false)
    }
  }, [subMenuData])

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
            <h6 className={style['slide-header-text']}>{intl.formatMessage({ id: 'common.title' })}</h6>
          </div>
          <div className={style['slide-sub-header']}>
            {slideTitle && (
              <span className={style['slide-header-sub-text']}>{`${slideTitle}${intl.formatMessage({
                id: 'common.ability',
              })}`}</span>
            )}
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
