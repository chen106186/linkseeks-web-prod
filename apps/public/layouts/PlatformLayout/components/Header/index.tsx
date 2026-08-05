import { Fragment } from 'react'
import { Dropdown, Layout } from '@linkseeks/ui'
import { MenuIcon, ListIcon, BellIcon, ArrowDownFillIcon } from '@linkseeks/icons'
import { authStorage } from '@linkseeks/storage'
import { history } from '@linkseeks/router-manager'
import style from './index.less'
import defaultAvatar from './default_avatar.png'
import { useMenu } from '../../../useMenu'
import { authService } from '@apps/services/auth/index.service'
const { Header, Content } = Layout

interface IProps {
  /**
   * 自定义头部右边
   */
  rightContentRender?: () => React.ReactNode
}

const LayoutHeader: React.FC<IProps> = (props) => {
  const { rightContentRender } = props
  const { collapsed, setCollapsed } = useMenu()
  const userInfo = authStorage.getItem()
  const handleClickMenu = () => {
    setCollapsed(!collapsed)
  }

  /**
   * 退出登录
   */
  const handleLogOut = () => {
    authService.removeAuth()
    authService.removeAuthRouteCache()
    history.goLogin()
  }

  const items = [
    {
      label: <div onClick={handleLogOut}>退出登录</div>,
      key: 'logout',
    },
  ]

  const RenderIcon = collapsed ? ListIcon : MenuIcon
  return (
    <Header className={style['header']}>
      <RenderIcon size={24} className={style['icon']} onClick={handleClickMenu} />
      <div className={style['right-content']}>
        {rightContentRender ? (
          rightContentRender()
        ) : (
          <Fragment>
            <BellIcon size={20} className={style.bellIcon} />
            <Dropdown menu={{ items }}>
              <div className={style.avatarWrap}>
                <img src={userInfo?.logo || defaultAvatar} className={style['avatar']} />
                <div className={style['username']}>
                  <span>{userInfo?.userName}</span>
                  <ArrowDownFillIcon size={16} />
                </div>
              </div>
            </Dropdown>
          </Fragment>
        )}
      </div>
    </Header>
  )
}

export default LayoutHeader
