import React, { Component } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Card, Row, Col, Space, Button } from 'antd'
import style from './initBase.less'
const initBase: React.FC<{}> = (props: any) => {
  const intl = useIntl()
  const initImg = require('../../../assets/imgs/icon_initpayBase@2x.png')
  return (
    <Card>
      <Row>
        <Col pull={6} push={6}>
          <Row>
            <Col span={12}>
              <img className={style['init-img']} src={initImg} />
            </Col>
            <Col span={12} className={style['right']}>
              <Space direction="vertical">
                <div className={style['title']}>
                  {intl.formatMessage({ id: 'payandSettle.components.initBase.title' })}
                </div>
                <div>{intl.formatMessage({ id: 'payandSettle.components.initBase.text' })}</div>
                <Button className={style['btn']} type="primary" size="small">
                  {intl.formatMessage({ id: 'payandSettle.components.initBase.button' })}
                </Button>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}
export default initBase
