import React from 'react'
import { Form, Input, Tooltip } from 'antd'
import CitySelect from '../CitySelect'
import { QuestionCircleOutlined } from '@ant-design/icons'
import RequireItem from '../RequireItem'
import { useIntl } from '@linkseeks/i18n'
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

const CreatePortal = () => {
  const [form] = Form.useForm()
  const intl = useIntl()
  return (
    <Form {...layout} form={form}>
      {/* 归属地市 */}
      <Form.Item label={intl.formatMessage({ id: 'components.guishudishi' })}>
        <Input />
      </Form.Item>
      {/* 公司LOGO */}
      <Form.Item label={intl.formatMessage({ id: 'components.gongsiLOGO' })}>
        <Input />
      </Form.Item>
      {/* 公司简介 */}
      <Form.Item label={intl.formatMessage({ id: 'components.gongsijianjie' })}>
        <Input />
      </Form.Item>
      {/* 厂房照片 */}
      <Form.Item label={intl.formatMessage({ id: 'components.changfangzhaopian' })}>
        <Input />
      </Form.Item>
      {/* 厂房照片 */}
      <Form.Item
        label={
          <RequireItem
            label={intl.formatMessage({ id: 'components.zizhirongyu' })}
            brief={
              <Tooltip placement="top" title={intl.formatMessage({ id: 'components.rushangbiaozhucezhengshu' })}>
                <QuestionCircleOutlined />
              </Tooltip>
            }
          />
        }
      >
        <Input />
      </Form.Item>
    </Form>
  )
}

export default CreatePortal
