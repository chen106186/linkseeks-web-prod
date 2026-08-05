import { render } from '@/app'
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Button, Space, Row, Col, Dropdown, Steps } from 'antd'
import { CompassOutlined, CompassFilled, UpOutlined } from '@ant-design/icons'
import styles from './index.less'
import cx from 'classnames'

const { Step } = Steps

const UseGuaid: React.FC<{}> = () => {
  const intl = useIntl()
  const menu = (
    <div className={styles.giudeMenuBox}>
      <Steps progressDot current={1000} direction="vertical">
        <Step
          title={intl.formatMessage({ id: 'home.useGuaid.title' })}
          description={
            <>
              <p>{intl.formatMessage({ id: 'home.useGuaid.description' })}</p>
              <a href="">{intl.formatMessage({ id: 'home.useGuaid.a' })}</a>
            </>
          }
        />
        <Step
          title={intl.formatMessage({ id: 'home.useGuaid.title' })}
          description={
            <>
              <p>{intl.formatMessage({ id: 'home.useGuaid.description' })}</p>
              <a href="">{intl.formatMessage({ id: 'home.useGuaid.a' })}</a>
            </>
          }
        />
        <Step
          title={intl.formatMessage({ id: 'home.useGuaid.title' })}
          description={
            <>
              <p>{intl.formatMessage({ id: 'home.useGuaid.description' })}</p>
              <a href="">{intl.formatMessage({ id: 'home.useGuaid.a' })}</a>
            </>
          }
        />
        <Step
          title={intl.formatMessage({ id: 'home.useGuaid.title' })}
          description={
            <>
              <p>{intl.formatMessage({ id: 'home.useGuaid.description' })}</p>
              <a href="">{intl.formatMessage({ id: 'home.useGuaid.a' })}</a>
            </>
          }
        />
        <Step
          title={intl.formatMessage({ id: 'home.useGuaid.title' })}
          description={
            <>
              <p>{intl.formatMessage({ id: 'home.useGuaid.description' })}</p>
              <a href="">{intl.formatMessage({ id: 'home.useGuaid.a' })}</a>
            </>
          }
        />
      </Steps>
    </div>
  )
  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row>
          <Col span={24}>
            <div className={styles.homeGuide}>
              <div className={cx(styles.gridStyle, styles.gridStyleFirst)}>
                <p className={styles.firstp}>
                  <CompassFilled className={styles.guideIconFirst} />
                  <span>&nbsp;{intl.formatMessage({ id: 'home.useGuaid.firstp' })}</span>
                </p>
              </div>
              <Dropdown overlay={menu}>
                <div className={styles.gridStyle}>
                  <div>
                    <p className={styles.guideTitle}>{intl.formatMessage({ id: 'home.useGuaid.guideTitle' })}</p>
                    <p className={styles.guideDesc}>{intl.formatMessage({ id: 'home.useGuaid.guideDesc' })}</p>
                  </div>
                  <UpOutlined className={styles.guideIcon} />
                </div>
              </Dropdown>
              <Dropdown overlay={menu}>
                <div className={styles.gridStyle}>
                  <div>
                    <p className={styles.guideTitle}>{intl.formatMessage({ id: 'home.useGuaid.guideTitle' })}</p>
                    <p className={styles.guideDesc}>{intl.formatMessage({ id: 'home.useGuaid.guideDesc' })}</p>
                  </div>
                  <UpOutlined className={styles.guideIcon} />
                </div>
              </Dropdown>
              <Dropdown overlay={menu}>
                <div className={cx(styles.gridStyle, styles.gridStyleLast)}>
                  <div>
                    <p className={styles.guideTitle}>{intl.formatMessage({ id: 'home.useGuaid.guideTitle' })}</p>
                    <p className={styles.guideDesc}>{intl.formatMessage({ id: 'home.useGuaid.guideDesc' })}</p>
                  </div>
                  <UpOutlined className={styles.guideIcon} />
                </div>
              </Dropdown>
              <div className={styles.guideClose}>
                <p>{intl.formatMessage({ id: 'home.useGuaid.guideClose' })}</p>
              </div>
            </div>
          </Col>
        </Row>
      </Space>
    </div>
  )
}

export default UseGuaid
