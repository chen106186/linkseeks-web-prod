import React from 'react'
import { Layout, Menu, Avatar, Image } from 'antd'
import { Link } from '@linkseeks/router-core'
import styles from '../styles/MenuSlider.less'
import { getRouters } from '@/utils/auth'
import { isDev } from '@/constants'
import { observer, inject } from 'mobx-react'
import CustomIcon from './CustomIcon'
import Icon from '@ant-design/icons'
import { ReactComponent as DefaultAvatar } from '@/assets/imgs/default_avatar.svg'
import defaultHomePath from '@/utils/defaultHomePath'
import { useGlobal } from '@apps/container'
const { Sider } = Layout

export interface OuterSiderProps {
  menuData: Array<any>
  pathname: string | undefined
  currentRouter: any
}

const OuterSider: React.FC<OuterSiderProps> = observer((props) => {
  const { menuData, pathname = '/', currentRouter } = props
  const authRouters = getRouters()
  const { avatar } = useGlobal()
  let defaultSelectedKeys = ''

  const isAuthPath = (path) => {
    if (isDev) {
      return true
    } else {
      return authRouters.includes(path)
    }
  }

  const getSubMenu = () => {
    const subHeadMenus: Array<any> = []
    menuData.forEach((item) => {
      // 为适配pass菜单自由组合变更， 使用code进行高亮显示
      const code = currentRouter.relationParentCode
      // console.log(code, item.relationParentCode)
      if (code && code === item.relationParentCode) {
        defaultSelectedKeys = item.relationParentCode
      }

      !item.hideInMenu &&
        isAuthPath(item.path) &&
        subHeadMenus.push({
          path: item.path,
          title: item.name,
          icon: item.icon,
          key: item.key,
          // 新增code属性 用于辨别子菜单是否属于该菜单下的属性
          relationParentCode: item.relationParentCode,
        })
    })
    return subHeadMenus
  }
  const siderMenu = getSubMenu()
  return (
    <>
      <Sider collapsed={true} collapsedWidth={64} className={styles.wrapperSilder}>
        <div className={styles.userPic}>
          <Link to={defaultHomePath()}>
            {avatar ? (
              <img src={avatar} className={styles.avatar} />
            ) : (
              <Icon component={() => <DefaultAvatar className={styles.logo} />} />
            )}
          </Link>
        </div>
        <ul className={styles.menuBox}>
          {siderMenu.map((item) => (
            <li key={item.key} className={defaultSelectedKeys === item.relationParentCode ? styles.currentItem : ''}>
              <Link to={item.path}>
                <CustomIcon type={item.icon} style={{ width: 16, height: 16 }} />
                <label>{item.title}</label>
              </Link>
            </li>
          ))}
        </ul>
      </Sider>
    </>
  )
})

OuterSider.defaultProps = {}

// export default OuterSider
export default OuterSider
