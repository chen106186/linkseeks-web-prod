import React from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Row, Col } from 'antd'
import { GlobalConfig } from '@/global/config'
import UserHeader from '../../layouts/components/UserHeader'
import styles from '../index.less'
import Img from '../../assets/imgs/illus.png'

const NoFoundPage: React.FC<{}> = () => {
  const intl = useIntl()

  const handleReturn = () => {
    history.goBack()
  }

  return (
    <div className={styles.wrapper}>
      <UserHeader logo={GlobalConfig.global.siteInfo.logo} />
      <div className={styles.errorBox}>
        <Row>
          <Col span={12}>
            <div className={styles.desc}>
              <h1>{intl.formatMessage({ id: 'common.error.aiya！yemian', defaultMessage: '哎呀！页面未找到' })}</h1>
              <h4>
                {intl.formatMessage({
                  id: 'common.error.gaicuowukeneng',
                  defaultMessage: '该错误可能由于如下原因所致',
                })}
                ：
              </h4>
              <p>·{intl.formatMessage({ id: 'common.error.yemianyishixiao', defaultMessage: '页面已失效' })}</p>
              <p>·{intl.formatMessage({ id: 'common.error.yemianyixiugai', defaultMessage: '页面已修改或者删除' })}</p>
              <Button type="primary" size="large" style={{ marginTop: 100 }} onClick={handleReturn}>
                {intl.formatMessage({ id: 'common.error.fanhuidaozhuye', defaultMessage: '返回到主页' })}
              </Button>
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
