import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Row, Col, Form, Input, Button, Select } from 'antd'
import { Card } from '@linkseeks/ui'

import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
interface BasicInfoLayoutProps {}

const BasicInfoLayout: React.FC<BasicInfoLayoutProps> = (props: any) => {
  return (
    <Card id="basicInfoLayout" title={intl.formatMessage({ id: 'dealAbility.jibenxinxi' })}>
      <Fragment>
        <Row gutter={[48, 24]}>
          <Col span={12}>
            <Form.Item
              label={intl.formatMessage({
                id: 'transaction_components.xuqiudanzhaiyao',
                defaultMessage: '需求单摘要',
              })}
              name="name"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'transaction_components.qingshuruxuqiudanzhaiyao',
                    defaultMessage: '请输入需求单摘要',
                  }),
                },
              ]}
            >
              <Input maxLength={30} placeholder={intl.formatMessage({ id: 'dealAbility.zuichang60zifu30gehan' })} />
            </Form.Item>
          </Col>
        </Row>
      </Fragment>
    </Card>
  )
}

export default BasicInfoLayout
