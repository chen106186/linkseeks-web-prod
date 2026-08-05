import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { Row, Col, Space, Avatar, Typography } from 'antd'
import { Card as CardLayout } from '@linkseeks/ui'
import style from './index.less'

const SourceLayout = () => {
  const intl = useIntl()
  return (
    <CardLayout
      title={intl.formatMessage({ id: 'marketingAbility.dangqianshangpinyonghulaiyuanfenxi' })}
      className={style.cardLayout}
    >
      <Row gutter={[16, 16]}>
        <Col xl={{ span: 12 }} span={24}>
          <div className={style.sourceLayout_wrap}>
            <Space>
              <div className={style.sourceLayout_avatar}>
                <Avatar shape="square" size={32}>
                  Logo
                </Avatar>
              </div>
              <div className={style.sourceLayout_content}>
                <div className={style.sourceLayout_content_title}>
                  {intl.formatMessage({ id: 'marketingAbility.WEBqiyeshangcheng' })}
                </div>
                <div className={style.sourceLayout_content_data}>
                  <Space>
                    <Typography.Text type="success">15%</Typography.Text>
                    <Typography.Text type="secondary">
                      456{intl.formatMessage({ id: 'marketingAbility.ren' })}
                    </Typography.Text>
                  </Space>
                </div>
              </div>
            </Space>
          </div>
        </Col>
        <Col xl={{ span: 12 }} span={24}>
          <div className={style.sourceLayout_wrap}>
            <Space>
              <div className={style.sourceLayout_avatar}>
                <Avatar shape="square" size={32}>
                  Logo
                </Avatar>
              </div>
              <div className={style.sourceLayout_content}>
                <div className={style.sourceLayout_content_title}>
                  {intl.formatMessage({ id: 'marketingAbility.WEBqiyeshangcheng' })}
                </div>
                <div className={style.sourceLayout_content_data}>
                  <Space>
                    <Typography.Text type="success">15%</Typography.Text>
                    <Typography.Text type="secondary">456人</Typography.Text>
                  </Space>
                </div>
              </div>
            </Space>
          </div>
        </Col>
        <Col xl={{ span: 12 }} span={24}>
          <div className={style.sourceLayout_wrap}>
            <Space>
              <div className={style.sourceLayout_avatar}>
                <Avatar shape="square" size={32}>
                  Logo
                </Avatar>
              </div>
              <div className={style.sourceLayout_content}>
                <div className={style.sourceLayout_content_title}>
                  {intl.formatMessage({ id: 'marketingAbility.WEBqiyeshangcheng' })}
                </div>
                <div className={style.sourceLayout_content_data}>
                  <Space>
                    <Typography.Text type="success">15%</Typography.Text>
                    <Typography.Text type="secondary">
                      456{intl.formatMessage({ id: 'marketingAbility.ren' })}
                    </Typography.Text>
                  </Space>
                </div>
              </div>
            </Space>
          </div>
        </Col>
        <Col xl={{ span: 12 }} span={24}>
          <div className={style.sourceLayout_wrap}>
            <Space>
              <div className={style.sourceLayout_avatar}>
                <Avatar shape="square" size={32}>
                  Logo
                </Avatar>
              </div>
              <div className={style.sourceLayout_content}>
                <div className={style.sourceLayout_content_title}>
                  {intl.formatMessage({ id: 'marketingAbility.WEBqiyeshangcheng' })}
                </div>
                <div className={style.sourceLayout_content_data}>
                  <Space>
                    <Typography.Text type="success">15%</Typography.Text>
                    <Typography.Text type="secondary">
                      456{intl.formatMessage({ id: 'marketingAbility.ren' })}
                    </Typography.Text>
                  </Space>
                </div>
              </div>
            </Space>
          </div>
        </Col>
      </Row>
    </CardLayout>
  )
}
export default SourceLayout
