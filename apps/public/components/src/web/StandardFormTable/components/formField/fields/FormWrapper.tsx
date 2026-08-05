import React from 'react'
import { Form, FormItemProps } from '@linkseeks/ui'

const FormItem = Form.Item

export interface FormWrapperProps extends FormItemProps {}
const FormWrapper = (props: FormWrapperProps) => {
  return <FormItem noStyle {...props} />
}

export default FormWrapper
