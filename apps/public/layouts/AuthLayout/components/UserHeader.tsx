import React, { useState, useEffect } from 'react'
import styles from '../styles/UserLayouts.less'
import { Row, Col } from 'antd'

import HeaderDropdown from './HeaderDropdown'
import { useIntl } from '@linkseeks/i18n'
import { useLocation } from '@linkseeks/router-core'
// import { mallLinkStorage } from '@linkseeks/storage'

/**
 * 平台首页域名
 */

export interface UserHeaderProps {
  logo?: React.ReactNode
  countryList?: { key: string; name: string; icon: string }[]
  location?: any
}
/**
 * 登录、注册等用户头部
 */
const UserHeader: React.FC<UserHeaderProps> = (props) => {
  const intl = useIntl()
  const { pathname } = useLocation()
  const [title, setTitle] = useState<string>()

  useEffect(() => {
    getRouteName()
  }, [location.href])

  const getRouteName = () => {
    switch (pathname) {
      case '/user/login':
        return setTitle(intl.formatMessage({ id: 'common.huanyingdenglu' }))
      case '/user/register':
        return setTitle(intl.formatMessage({ id: 'common.huanyingzhuce' }))
      case '/user/retrieve/password':
        return setTitle(intl.formatMessage({ id: 'common.zhaohuimima' }))
    }
  }

  const getBackMallUrl = (): string => {
    // @todo 未兼容完成
    // const mallLink: string = mallLinkStorage.getItem() as unknown as string
    // if (mallLink) {
    //   return mallLink
    // } else {
    //   return 'http://lx-www.shushangyun.com'
    // }
    return ''
  }
  return (
    <div className={styles['lingxi-business-user-header']}>
      <Row
        className={styles['lingxi-business-margin_content']}
        justify="space-between"
        align="middle"
        style={{ height: 64 }}
      >
        <Col>
          <div className={styles['lingxi-business-logo-wrap']}>
            {typeof props.logo === 'string' ? (
              <a href={getBackMallUrl()}>
                <img src={props.logo} className={styles['lingxi-business-logo']} />{' '}
              </a>
            ) : (
              props.logo
            )}
            {title && <div className={styles['lingxi-business-user-header-split']}></div>}
            <div className={styles['lingxi-business-user-header-title']}>{title}</div>
          </div>
        </Col>
        <Col>
          <HeaderDropdown />
        </Col>
      </Row>
    </div>
  )
}

export default UserHeader
