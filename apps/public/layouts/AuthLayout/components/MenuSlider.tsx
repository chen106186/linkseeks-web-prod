import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { BorderOutlined, DownOutlined, RightOutlined } from '@ant-design/icons'
import OuterSider from './OuterSide'
import { GlobalConfig } from '@/global/config'
import styles from '../styles/MenuSlider.less'
import defaultHomePath from '@/utils/defaultHomePath'

const { Sider } = Layout
const { SubMenu } = Menu

export interface MenuSliderProps {
  collapseState: boolean | undefined
  menuData: Array<any>
  pathname: string | undefined
  currentSelectKey: string[]
  openKeys: string[]
  changeOpenKeys: Function
  currentRouter: any
}

const MenuSlider: React.FC<MenuSliderProps> = (props) => {
  const { menuData, pathname, currentSelectKey = [], openKeys = [], changeOpenKeys } = props
  const [innerCollapsed, setInnerCollapsed] = useState(false)
  let menuItemsCache = null

  const getMenuRouter = (routes: any, pathname: any) => {
    const list = routes.filter((item: any) => pathname.indexOf(item.key) > -1)
    return list[0]
  }

  const getMenus = (menuArray: any, hasChildren = false) => {
    if (!!menuArray && menuArray.length > 0) {
      return menuArray.map((item: any) => {
        // 需要隐藏
        if (item.hideInMenu) {
          return null
        }

        if (item.children) {
          return (
            <SubMenu key={item.key || item.path} title={item.name}>
              {getMenus(item.children, true)}
            </SubMenu>
          )
        }
        return (
          <Menu.Item key={item.key || item.path} className={hasChildren ? styles.menuItem : ''}>
            {hasChildren && <BorderOutlined rotate={45} style={{ fontSize: 6, verticalAlign: 'middle' }} />}
            <Link to={item.path}>
              <span>{item.name}</span>
            </Link>
          </Menu.Item>
        )
      })
    }
  }

  const menuRouter = getMenuRouter(menuData, pathname)

  if (menuRouter && menuRouter.children) {
    menuItemsCache = getMenus(menuRouter.children)
  }

  const handleOpenchange = (keys: string[]) => {
    changeOpenKeys(keys)
  }
  /** @tofix 这里体验不好，不太明白点击子路由的时候为什么需要去reload */
  const clickMenuItem = ({ item, key, keyPath, domEvent }) => {
    // 对比url和点击项的key 相同的话重载页面 并清空筛选的store
    if (key === pathname) {
      clearHeightSearchParams()
      window.location.reload()
    }
  }

  const clearHeightSearchParams = () => {
    const currentState = JSON.parse(sessionStorage.getItem('currentState'))
    const result = { ...currentState, queryParams: {}, current: 1 }
    sessionStorage.setItem('currentState', JSON.stringify(result))
  }

  const customExpandIcon = (props) => {
    if (props.isOpen) {
      return <DownOutlined />
    } else {
      return <RightOutlined />
    }
  }

  return (
    <>
      <OuterSider {...props} />
      <Sider
        theme="light"
        className={styles.menu_sider}
        width={props.collapseState ? 0 : 200}
        collapsedWidth={props.collapseState ? 0 : 80}
        collapsed={props.collapseState}
      >
        <Link to={defaultHomePath()} className={styles.logo}>
          <img src={GlobalConfig.global.siteInfo.logo} />
        </Link>
        <div className={styles.menuTitle}>{menuRouter?.name}</div>
        <Menu
          className={styles.menuSlider}
          onOpenChange={handleOpenchange}
          selectedKeys={currentSelectKey}
          openKeys={openKeys}
          mode="inline"
          onClick={clickMenuItem}
          expandIcon={customExpandIcon}
        >
          {menuItemsCache}
        </Menu>
      </Sider>
    </>
  )
}

MenuSlider.defaultProps = {}

export default MenuSlider
