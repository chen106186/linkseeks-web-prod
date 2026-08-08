import { LogoutOutlined, LockOutlined } from '@ant-design/icons'
import { Avatar, Menu } from 'antd'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import PersonDropdown from './PersonDropdown'
import styles from '../styles/RightContent.less'
import { inject, observer } from 'mobx-react'
import Icon from '@ant-design/icons'
import { ReactComponent as DefaultAvatar } from '@/assets/imgs/default_avatar.svg'
import { authService } from '@apps/services'
import useAuth from '@apps/services/auth/useAuth'
import { useGlobal } from '@apps/container'
import useCacheQuery from '@apps/components/src/web/StandardFormTable/hooks/useCacheQuery'

const AvatarDropdown = (props) => {
  const intl = useIntl()
  const userAuth = useAuth().getAuth()
  const { avatar } = useGlobal()
  const cacheQuery = useCacheQuery()

  const logout = async () => {
    await authService.logOut()
    authService.removeAuth()
    authService.removeAuthRouteCache()
    history.goLogin()
    // 退出登录时清除表格的缓存查询参数
    cacheQuery.removeAllCacheData()
  }

  const currentUser = {
    name: userAuth?.userName || userAuth?.memberName || intl.formatMessage({ id: 'common.weizhiyonghu' }),
    avatar: avatar || '',
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} triggerSubMenuAction="click">
      <Menu.Item key="changePwd">
        <Link to="/systemAbility/accountSetting">
          <LockOutlined />
          {intl.formatMessage({ id: 'common.xiugaimima' })}
        </Link>
      </Menu.Item>
      <Menu.Item onClick={logout} key="logout">
        <LogoutOutlined />
        {intl.formatMessage({ id: 'common.tuichudenglu' })}
      </Menu.Item>
    </Menu>
  )

  return (
    <PersonDropdown overlay={menuHeaderDropdown} trigger={['click']}>
      <span className={`${styles.action} ${styles.account}`}>
        {currentUser.avatar ? (
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        ) : (
          <Icon component={() => <DefaultAvatar className={styles.logo} />} />
        )}

        <span className={styles.name}>{currentUser?.name}</span>
      </span>
    </PersonDropdown>
  )
}

export default AvatarDropdown
