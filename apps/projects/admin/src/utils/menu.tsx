import React from 'react'
import { MenuDataItem, MessageDescriptor, Route, RouterTypes, WithFalse } from './typing'
import { MenuMode, MenuProps } from 'antd/es/menu'
import { MenuTheme } from 'antd/es/menu/MenuContext'
import DynamicIcon from '@/components/DynamicIcons'
import { Menu } from 'antd'
import { isUrl } from '.'
import { Link } from '@linkseeks/router-core'

const { SubMenu } = Menu
export type ContentWidth = 'Fluid' | 'Fixed'
export interface Settings {
  /**
   * theme for nav menu
   */
  navTheme: MenuTheme | 'realDark' | undefined
  /**
   * nav menu position: `sidemenu` or `topmenu`
   */
  layout: 'sidemenu' | 'topmenu'
  /**
   * layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
   */
  contentWidth: ContentWidth

  /**
   * sticky header
   */
  fixedHeader: boolean
  /**
   * sticky siderbar
   */
  fixSiderbar: boolean
  menu: { locale?: boolean; defaultOpenAll?: boolean }
  title: string
  // Your custom iconfont Symbol script Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理
  // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
  iconfontUrl: string
  primaryColor: string
  colorWeak?: boolean
}
export interface BaseMenuProps
  extends Partial<RouterTypes<Route>>,
    Omit<MenuProps, 'openKeys' | 'onOpenChange'>,
    Partial<Settings> {
  className?: string
  collapsed?: boolean
  handleOpenChange?: (openKeys: string[]) => void
  isMobile?: boolean
  menuData?: MenuDataItem[]
  mode?: MenuMode
  onCollapse?: (collapsed: boolean) => void
  openKeys?: WithFalse<string[]> | undefined
  /**
   * 要给菜单的props, 参考antd-menu的属性。https://ant.design/components/menu-cn/
   */
  menuProps?: MenuProps
  style?: React.CSSProperties
  theme?: MenuTheme
  formatMessage?: (message: MessageDescriptor) => string
  subMenuItemRender?: WithFalse<
    (
      item: MenuDataItem & {
        isUrl: boolean
      },
      defaultDom: React.ReactNode,
    ) => React.ReactNode
  >
  menuItemRender?: WithFalse<
    (
      item: MenuDataItem & {
        isUrl: boolean
      },
      defaultDom: React.ReactNode,
    ) => React.ReactNode
  >
  postMenuData?: (menusData?: MenuDataItem[]) => MenuDataItem[]
}

class MenuUtil {
  constructor(props: BaseMenuProps) {
    this.props = props
  }

  props: BaseMenuProps

  getNavMenuItems = (menusData: MenuDataItem[] = []): React.ReactNode[] =>
    menusData
      .filter((item) => item.name && !item.hideInMenu)
      .map((item) => this.getSubMenuOrItem(item))
      .filter((item) => item)

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item: MenuDataItem): React.ReactNode => {
    const { subMenuItemRender } = this.props
    if (
      Array.isArray(item.children) &&
      !item.hideChildrenInMenu &&
      item.children.some((child) => child && !!child.name)
    ) {
      const name = this.getIntlName(item)
      // 兼容tree结构目录
      if (item.isTree) {
        return (
          <SubMenu title={item.leftRender} key={item.key || item.path} onTitleClick={item.onTitleClick}>
            {this.getNavMenuItems(item.children)}
          </SubMenu>
        )
      }

      //  get defaultTitle by menuItemRender
      const defaultTitle = item.icon ? (
        <span>
          <DynamicIcon type={item.icon} />
          <span className="lx-menu-link-text">{name}</span>
        </span>
      ) : (
        name
      )

      const title = subMenuItemRender ? subMenuItemRender({ ...item, isUrl: false }, defaultTitle) : defaultTitle

      return (
        // <div key={item.key || item.path} onClick={item.onTitleClick}>{defaultTitle}</div>
        <SubMenu title={title} key={item.key || item.path} onTitleClick={item.onTitleClick}>
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      )
    }
    return <Menu.Item key={item.key || item.path}>{this.getMenuItemPath(item)}</Menu.Item>
  }

  getIntlName = (item: MenuDataItem) => {
    const { formatMessage } = this.props
    const { name, locale } = item
    // 去除菜单的国际化 交给配置来控制
    // if (locale && formatMessage) {
    //   return formatMessage({
    //     id: locale,
    //     defaultMessage: name,
    //   });
    // }
    return name
  }

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = (item: MenuDataItem) => {
    const name = this.getIntlName(item)
    const icon = <DynamicIcon type={item.icon} />
    const { location = { pathname: '/' }, isMobile, onCollapse, menuItemRender } = this.props
    if (item.isTree) {
      return (
        <>
          {item.leftRender && item.leftRender({ name, icon })}
          {item.rightRender && item.rightRender({ name, icon })}
        </>
      )
    }
    const itemPath = this.conversionPath(item.path || '/')
    const { target } = item
    // if local is true formatMessage all name。

    let defaultItem = (
      <>
        {icon}
        <span className="lx-menu-link-text">{name}</span>
      </>
    )
    const linkItem = item.path && (
      <Link className="lx-menu-item-link" to={item.path as string}>
        {defaultItem}
      </Link>
    )
    const isHttpUrl = isUrl(itemPath)
    // Is it a http link
    if (isHttpUrl) {
      defaultItem = (
        <a href={itemPath} target={target}>
          {icon} <span>{name}</span>
        </a>
      )
    }

    if (menuItemRender) {
      return menuItemRender(
        {
          ...item,
          isUrl: isHttpUrl,
          itemPath,
          isMobile,
          replace: itemPath === location.pathname,
          onClick: () => onCollapse && onCollapse(true),
        },
        defaultItem,
      )
    }
    return item.children || !item.path ? defaultItem : linkItem
  }

  conversionPath = (path: string) => {
    if (path && path.indexOf('http') === 0) {
      return path
    }
    return `/${path || ''}`.replace(/\/+/g, '/')
  }
}

export default MenuUtil
