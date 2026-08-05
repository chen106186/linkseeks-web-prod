import React from 'react'
import { Row, Col } from 'antd'
import isString from 'lodash/isString'
import styles from '../index.less'

export interface UserHeaderProps {
  logo?: string
  countryList?: { key: string; name: string; icon: string }[]
  location?: any
}
/**
 * 登录、注册等用户头部
 */
const UserHeader: React.FC<UserHeaderProps> = (props) => {
  return (
    <div className={styles['user-header']}>
      <Row className={styles['margin_content']} justify="space-between" align="middle" style={{ height: '100%' }}>
        <Col>
          <div className={styles['logo-wrap']}>
            {isString(props.logo) ? (
              <a href="/">
                <img src={props.logo} className={styles.logo} />{' '}
              </a>
            ) : (
              props.logo
            )}
            <div className={styles['user-header-split']}></div>
            <div className={styles['user-header-title']}>忘记密码</div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default UserHeader
