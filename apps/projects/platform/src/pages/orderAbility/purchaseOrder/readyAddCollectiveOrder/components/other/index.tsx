import React from 'react'
import { Card, Col, Input, Row } from '@linkseeks/ui'
import { Form } from 'antd'
import { validatorByte } from '@/utils/regExp'
import { useWebIntl } from '@apps/locales'

const Other: React.FC = () => {
  const translate = useWebIntl()

  return (
    <Card title={translate('web.common.qitaxinxi')}>
      <Row gutter={32}>
        <Col span={12}>
          <Form.Item
            label={translate('web.resource.mall.baozhuangyaoqiu')}
            name={['requirement', 'pack']}
            rules={[{ validator: (r, v, c) => validatorByte(r, v, c, 100) }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={['requirement', 'remark']}
            label={translate('web.common.remark')}
            rules={[{ validator: (r, v, c) => validatorByte(r, v, c, 100) }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  )
}

export default Other
