import React, { Fragment } from 'react'
import { Row, Col, Form, Input } from 'antd'
import { Card } from '@linkseeks/ui'
import { getIntl } from '@linkseeks/i18n'

interface OtherExplainLayoutProps {
  form: any
}
const intl = getIntl()
const OtherExplainLayout: React.FC<OtherExplainLayoutProps> = (props: any) => {
  const { form } = props

  const handleSelectChange = (val, type) => {
    const obj = {}
    obj[type] = val
    form.setFieldsValue(obj)
  }

  return (
    <Card id="otherExplainLayout" title={intl.formatMessage({ id: 'dealAbility.qitashuoming' })}>
      <Fragment>
        <Row gutter={[48, 24]}>
          <Col span={12}>
            <Form.Item label={intl.formatMessage({ id: 'dealAbility.jiaofushuoming' })} name="deliverRemark">
              <Input.TextArea
                onChange={(e) => {
                  handleSelectChange(e.target.value, 'deliverRemark')
                }}
                maxLength={50}
                rows={3}
                placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
              />
            </Form.Item>

            <Form.Item label={intl.formatMessage({ id: 'dealAbility.shuifeishuoming' })} name="taxesRemark">
              <Input.TextArea
                maxLength={50}
                onChange={(e) => {
                  handleSelectChange(e.target.value, 'taxesRemark')
                }}
                rows={3}
                placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
              />
            </Form.Item>

            <Form.Item label={intl.formatMessage({ id: 'dealAbility.baozhuangshuoming' })} name="packageRemark">
              <Input.TextArea
                maxLength={50}
                onChange={(e) => {
                  handleSelectChange(e.target.value, 'packageRemark')
                }}
                rows={3}
                placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={intl.formatMessage({ id: 'dealAbility.fukuanshuoming' })} name="paymentRemark">
              <Input.TextArea
                onChange={(e) => {
                  handleSelectChange(e.target.value, 'paymentRemark')
                }}
                maxLength={50}
                rows={3}
                placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
              />
            </Form.Item>
            <Form.Item label={intl.formatMessage({ id: 'dealAbility.wuliushuoming' })} name="logisticsRemark">
              <Input.TextArea
                maxLength={50}
                onChange={(e) => {
                  handleSelectChange(e.target.value, 'logisticsRemark')
                }}
                rows={3}
                placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
              />
            </Form.Item>
            <Form.Item label={intl.formatMessage({ id: 'dealAbility.qitashuoming' })} name="otherRemark">
              <Input.TextArea
                maxLength={50}
                onChange={(e) => {
                  handleSelectChange(e.target.value, 'otherRemark')
                }}
                rows={3}
                placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
              />
            </Form.Item>
          </Col>
        </Row>
      </Fragment>
    </Card>
  )
}

export default OtherExplainLayout
