import React from 'react'
import style from './styles/UserLayouts.less'
import { Outlet } from '@linkseeks/router-core'
import UserHeader from './components/UserHeader'
import BaseFooter from './components/BaseFooter'
import { usePassConfig } from '@feature/paas'

/**
 * 登录、注册等用户界面布局
 * @author xjm
 */
const UserLayouts: React.FC<any> = (props) => {
  const paasConfig = usePassConfig()
  return (
    <>
      <div className={style['lingxi-business-user-layout']}>
        <UserHeader logo={paasConfig.global.siteInfo.logo} {...props} />
        <div className={style['lingxi-business-user-bg']}>
          <Outlet />
          <BaseFooter />
        </div>
      </div>
    </>
  )
}

export default UserLayouts
