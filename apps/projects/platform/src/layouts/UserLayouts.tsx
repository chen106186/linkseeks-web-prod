import React, { PropsWithChildren } from 'react'
import { useGlobalLogo } from '@apps/services'

import styles from './styles/UserLayouts.less'
import UserHeader from './components/UserHeader'
import BaseFooter from './components/BaseFooter'
import { getOssUrlPath } from '@apps/constants'

interface IProps {}

/**
 * 登录、注册等用户界面布局
 * @author xjm
 */
const UserLayouts: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { logo } = useGlobalLogo()

  return (
    <div className={styles['user-layout']}>
      <UserHeader
        logo={logo || getOssUrlPath(`/%E7%93%B4%E7%8A%80logo-%E7%BE%8E%E6%94%BFcfbbb8d6580843359a0e7bab2c48b2b0.png`)}
        {...props}
      />
      <div className={styles['user-bg']}>
        {props.children}
        <BaseFooter />
      </div>
    </div>
  )
}

export default UserLayouts
