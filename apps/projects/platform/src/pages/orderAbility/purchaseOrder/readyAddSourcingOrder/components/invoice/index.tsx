import React from 'react'
import { Card } from '@linkseeks/ui'
import { Row, Col, Form, Checkbox } from 'antd'
import { useWebIntl } from '@apps/locales'
import InvoiceSelect from './invoiceSelect'

interface InvoiceProps {}

const Invoice: React.FC<InvoiceProps> = () => {
  const translate = useWebIntl()

  return (
    <Card title={translate('web.resource.order.fapiaoxinxi')}>
      <Row>
        <Col span={24}>
          <Form.Item name="isInvoice" valuePropName="checked">
            <Checkbox>{translate('web.resource.balance.xuyaofapiao')}</Checkbox>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => {
              const isInvoice = getFieldValue('isInvoice')
              if (isInvoice) {
                return (
                  <Form.Item
                    name="invoice"
                    wrapperCol={{
                      span: 24,
                    }}
                  >
                    <InvoiceSelect />
                  </Form.Item>
                )
              }
              return null
            }}
          </Form.Item>
        </Col>
      </Row>
    </Card>
  )
}

export default Invoice
