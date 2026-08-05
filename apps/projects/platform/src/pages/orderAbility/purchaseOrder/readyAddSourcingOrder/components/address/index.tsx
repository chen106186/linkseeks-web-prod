import React from 'react'
import { Card } from '@linkseeks/ui'
import { Row, Col, Form, DatePicker } from 'antd'
import moment from 'moment'
import { useWebIntl } from '@apps/locales'
import AddressSelect from './addressSelect'
import { useOrder } from '../../orderProvider'
import { ProductItemType } from '../orderProducts'

const Adress: React.FC = () => {
  const { form } = useOrder()
  const products: ProductItemType[] = Form.useWatch('products', form)
  const translate = useWebIntl()

  const showAddress = products && products.length > 0 ? products.some((item) => item.deliveryType === 1) : true

  return (
    <Card title={translate('web.resource.logistics.songhuoxinxi')}>
      <Row>
        <Col span={24}>
          <Form.Item
            label={translate('web.resource.logistics.songhuoriqi')}
            name="deliverDate"
            rules={[
              {
                required: true,
                message: translate('web.common.qingxuanze'),
              },
            ]}
          >
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: 320 }}
              disabledDate={(current) => {
                return current && current < moment().startOf('day')
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label={translate('web.resource.order.songhuodizhi')} hidden={!showAddress} required />
        </Col>
        <Col span={24}>
          <Form.Item
            name="consignee"
            hidden={!showAddress}
            wrapperCol={{
              span: 24,
            }}
            rules={[
              {
                required: true,
                message: translate('web.common.qingxuanze'),
              },
            ]}
          >
            <AddressSelect />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  )
}

export default Adress
