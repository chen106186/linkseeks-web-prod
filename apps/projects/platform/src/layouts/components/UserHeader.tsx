import React, { useState, useEffect } from 'react'
import { useLocation } from '@linkseeks/router-core'
import { Row, Col } from 'antd'
import { PLATFORM_DOMAIN } from '@/constants'
import { isString } from '@/utils/type'
import { getCookie } from '@/utils/cookie'
import { useIntl } from '@linkseeks/i18n'
import styles from '../styles/UserLayouts.less'
import SelectLang from './SelectLang'

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
  }, [pathname])

  const getRouteName = () => {
    switch (pathname) {
      case '/user/login':
        setTitle(intl.formatMessage({ id: 'common.huanyingdenglu' }))
        break
      case '/user/register':
        setTitle(intl.formatMessage({ id: 'common.huanyingzhuce' }))
        break
      case '/user/getBack':
      case '/user/forget':
        setTitle(intl.formatMessage({ id: 'common.zhaohuimima' }))
        break
    }
  }

  const getBackMallUrl = (): string => {
    const mallLink: string = getCookie('currentMallLink', 'string') as unknown as string
    if (mallLink) {
      return mallLink
    } else {
      return PLATFORM_DOMAIN
    }
  }

  return (
    <div className={styles['user-header']}>
      <Row className={styles['margin_content']} justify="space-between" align="middle" style={{ height: '100%' }}>
        <Col>
          <div className={styles['logo-wrap']}>
            {isString(props.logo) ? (
              <a href={getBackMallUrl()}>
                <img src={props.logo} className={styles.logo} />{' '}
              </a>
            ) : (
              props.logo
            )}
            {title && <div className={styles['user-header-split']}></div>}
            <div className={styles['user-header-title']}>{title}</div>
          </div>
        </Col>
        <Col>
          <SelectLang />
        </Col>
      </Row>
    </div>
  )
}

export default UserHeader
