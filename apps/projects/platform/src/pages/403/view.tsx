import React from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, Row, Col } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { authService } from '@apps/services'
import styles from '../index.less'
import Img from '../../assets/imgs/illus.png'
import { useWebIntl } from '@apps/locales'
import { Space } from '@linkseeks/ui'

const NoFoundPage: React.FC<{}> = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const handleReturn = () => {
    // authService.removeAuth()
    history.redirect('/')
  }

  const logout = async () => {
    await authService.logOut()
    authService.removeAuth()
    authService.removeAuthRouteCache()
    history.goLogin()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.errorBox}>
        <Row>
          <Col span={12}>
            <div className={styles.desc}>
              <h1>
                {intl.formatMessage({ id: 'common.error.nindangqianwuquan', defaultMessage: '您当前无权访问该页面' })}
              </h1>
              <Space>
                <Button type="primary" size="large" style={{ marginTop: 100 }} onClick={handleReturn}>
                  {translate('web.common.huidaoshouye')}
                </Button>
                <Button size="large" style={{ marginTop: 100 }} onClick={logout}>
                  {translate('web.common.chongxindenglu')}
                </Button>
              </Space>
            </div>
          </Col>
          <Col span={12}>
            <img
              className={styles.image}
              src={Img}
              alt={intl.formatMessage({ id: 'common.error.shushangyunfu', defaultMessage: '服务' })}
            />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default NoFoundPage
