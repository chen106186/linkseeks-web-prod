import React from 'react'
import { Row, Col, Typography } from 'antd'
import style from './index.less'
import { BellOutlined, CheckCircleOutlined, ClockCircleOutlined, StockOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'

const ActivityLayout = () => {
  const intl = useIntl()
  return (
    <Row gutter={[16, 16]}>
      <Col xl={{ span: 6 }} span={12}>
        <div className={style.col}>
          <div className={style.col_20}>
            <Typography.Title level={4}>10</Typography.Title>
            <Typography.Text type="secondary">
              {intl.formatMessage({ id: 'marketingAbility.jinrizhengzaizhixinghuodong' })}
            </Typography.Text>
          </div>
          <div className={style.col_4}>
            <div className={style.col_icon} style={{ backgroundColor: '#00A98F' }}>
              <BellOutlined className={style.col_icon_fontSize} />
            </div>
          </div>
        </div>
      </Col>
      <Col xl={{ span: 6 }} span={12}>
        <div className={style.col}>
          <div className={style.col_20}>
            <Typography.Title level={4}>100</Typography.Title>
            <Typography.Text type="secondary">
              {intl.formatMessage({ id: 'marketingAbility.jinricanyuhuodongzongke' })}
            </Typography.Text>
          </div>
          <div className={style.col_4}>
            <div className={style.col_icon} style={{ backgroundColor: '#007BFC' }}>
              <ClockCircleOutlined className={style.col_icon_fontSize} />
            </div>
          </div>
        </div>
      </Col>
      <Col xl={{ span: 6 }} span={12}>
        <div className={style.col}>
          <div className={style.col_20}>
            <Typography.Title level={4}>100</Typography.Title>
            <Typography.Text type="secondary">
              {intl.formatMessage({ id: 'marketingAbility.jinrihuodongshangpinzongding' })}
            </Typography.Text>
          </div>
          <div className={style.col_4}>
            <div className={style.col_icon} style={{ backgroundColor: '#EB9B00' }}>
              <CheckCircleOutlined className={style.col_icon_fontSize} />
            </div>
          </div>
        </div>
      </Col>
      <Col xl={{ span: 6 }} span={12}>
        <div className={style.col}>
          <div className={style.col_20}>
            <Typography.Title level={4}>10,000.00</Typography.Title>
            <Typography.Text type="secondary">
              {intl.formatMessage({ id: 'marketingAbility.jinrihuodongshangpinzonggou' })}
            </Typography.Text>
          </div>
          <div className={style.col_4}>
            <div className={style.col_icon} style={{ backgroundColor: '#EF3346' }}>
              <StockOutlined className={style.col_icon_fontSize} />
            </div>
          </div>
        </div>
      </Col>
    </Row>
  )
}
export default ActivityLayout
