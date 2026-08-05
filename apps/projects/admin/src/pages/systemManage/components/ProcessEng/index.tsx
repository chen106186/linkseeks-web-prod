import React, { memo } from 'react'
import { Form, Row, Col, Input } from 'antd'
import { Card as CardLayout } from '@linkseeks/ui'
import { validatorByte } from '@/utils/regExp'
interface ProcessEngProps {
  disabled?: boolean
}

const ProcessEngLayout: React.FC<ProcessEngProps> = (props: any) => {
  const { disabled } = props

  return (
    <CardLayout id="processEng" title="流程规则" bodyStyle={{ paddingBottom: '0px' }}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            className="use-custom-required"
            label="流程规则名称"
            name="name"
            rules={[
              { required: true, message: '请输入流程规则名称' },
              { validator: (rule, value, callback) => validatorByte(rule, value, callback, 48) },
            ]}
          >
            <Input disabled={disabled} placeholder="最长48个字符，24个汉字" />
          </Form.Item>
        </Col>
      </Row>
    </CardLayout>
  )
}
export default memo(ProcessEngLayout)
