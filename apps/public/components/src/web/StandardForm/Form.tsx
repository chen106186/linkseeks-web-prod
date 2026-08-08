import { Form, FormProps } from '@linkseeks/ui'
import React from 'react'

export interface StandardFormProps extends FormProps {}
export const StandardForm = (props: StandardFormProps) => {
  const defaultSetting: StandardFormProps = {
    labelAlign: 'left',
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  }
  return <Form {...defaultSetting} {...props} />
}

StandardForm.useForm = Form.useForm
StandardForm.Item = Form.Item
