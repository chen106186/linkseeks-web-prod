import React from 'react'
import { history } from '@linkseeks/router-manager'
import { authService } from '@apps/services'
import { Button, Row, Col } from 'antd'
import styles from '../index.less'
import Img from '../../assets/illus.png'

const NoFoundPage: React.FC<{}> = () => {
  const handleReturn = () => {
    // authService.removeAuth()
    history.redirect('/home')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.errorBox}>
        <Row>
          <Col span={12}>
            <div className={styles.desc}>
              <h1>您当前无权访问该页面</h1>
              <Button type="primary" size="large" style={{ marginTop: 100 }} onClick={handleReturn}>
                回到首页
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <img className={styles.image} src={Img} alt="数商云服务" />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default NoFoundPage
