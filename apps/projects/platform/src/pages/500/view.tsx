import React from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Row, Col } from 'antd'
import { GlobalConfig } from '@/global/config'
import UserHeader from '../../layouts/components/UserHeader'
import styles from '../index.less'
import Img from '../../assets/imgs/Artwork.png'

const InternetError: React.FC<{}> = () => {
  const intl = useIntl()

  const handleReload = () => {
    history.goBack()
  }

  return (
    <div className={styles.wrapper}>
      <UserHeader logo={GlobalConfig.global.siteInfo.logo} />
      <div className={styles.errorBox}>
        <Row>
          <Col span={12}>
            <div className={styles.desc}>
              <h1>
                {intl.formatMessage({ id: 'common.error.aiya！wangluo', defaultMessage: '哎呀！网络连接出错了' })}
              </h1>
              <h4>
                {intl.formatMessage({
                  id: 'common.error.gaicuowukeneng',
                  defaultMessage: '该错误可能由于如下原因所致',
                })}
                ：
              </h4>
              <p>·{intl.formatMessage({ id: 'common.error.diannaoweilianjie', defaultMessage: '电脑未连接到网络' })}</p>
              <p>
                ·{intl.formatMessage({ id: 'common.error.fanghuoqianghuosha', defaultMessage: '防火墙或杀毒软件阻止' })}
              </p>
              <Button type="primary" size="large" style={{ marginTop: 100 }} onClick={handleReload}>
                {intl.formatMessage({ id: 'common.error.shuaxinyemianshi', defaultMessage: '刷新页面试试' })}
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

export default InternetError
