import { Form as AntdForm, FormProps as AntdFormProps } from 'antd'
import { BaseFormFieldProp } from '../types'

interface MergeInputProps extends AntdFormProps, BaseFormFieldProp {}
const Form = (props: MergeInputProps) => {
  return <AntdForm className="ui-form" {...(props as any)} />
}

Form.Item = AntdForm.Item
Form.List = AntdForm.List
Form.ErrorList = AntdForm.ErrorList
Form.useForm = AntdForm.useForm
Form.useFormInstance = AntdForm.useFormInstance
Form.useWatch = AntdForm.useWatch
Form.Provider = AntdForm.Provider

export default Form
