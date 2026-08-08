import React, { ReactNode, useEffect } from 'react'
import { Form, FormProps, createSchemaField, ISchema } from '@apps/form'
import componentExport from './componentExport'
import setRegisterValidateRules from './utils/registerValidateRules'
import { currentStateType, getCurrentState } from './utils/keepAlive'
import './index.less'

export interface NiceFormProps extends FormProps {
  children?: ReactNode
  components?: any
  scope?: any
  schema: ISchema
  form: FormProps['form']
}

// 自定义校验规则
setRegisterValidateRules()

const NiceForm: React.FC<NiceFormProps> = (props) => {
  const { children, components, scope, schema, form, ...reset } = props
  const defineComponents = Object.assign(componentExport, components)
  const SchemaField = createSchemaField({ components: defineComponents, scope: scope })
  useEffect(() => {
    const paginationInfo: currentStateType = getCurrentState()
    // 一般 列表检索传入的 controlRender 的 NiceForm 是没有 value 或者 initialValues 的
    // value 或者 initialValues 的，表单页有
    if (
      paginationInfo &&
      window.location.pathname === paginationInfo.pathname &&
      !('value' in reset) &&
      !('initialValues' in reset)
    ) {
      // @ts-ignore
      form.setFormState((state) => (state.values = paginationInfo.queryParams))
    }
  }, [])

  return (
    <Form form={form} colon={false} {...reset}>
      <SchemaField schema={schema} />
      {children}
    </Form>
  )
}

NiceForm.defaultProps = {}

export default NiceForm
