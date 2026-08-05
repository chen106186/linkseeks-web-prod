import React from 'react'
import { Form } from 'antd'
import ProcessRadio, { ProcessRadioPropsType } from '@/components/ProcessRadio'
import { useIntl } from '@linkseeks/i18n'

interface PropsType extends ProcessRadioPropsType {
  name?: string
  message?: string
  disabled?: boolean
}

export default function ProcessBaseRadio(props: PropsType) {
  const intl = useIntl()
  const {
    name = 'baseProcessId',
    message = `${intl.formatMessage({ id: 'common.select', defaultMessage: '请选择' })}${intl.formatMessage({
      id: 'processRuleSetting.liucheng',
      defaultMessage: '流程',
    })}`,
    disabled,
    dataSource,
    ...rest
  } = props

  return (
    <Form.Item name={name} rules={[{ required: true, message }]}>
      <ProcessRadio disabled={disabled} dataSource={dataSource} {...rest} />
    </Form.Item>
  )
}
