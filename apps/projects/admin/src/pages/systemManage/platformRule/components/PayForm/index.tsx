import React, { Component } from 'react'
import SchemaForm, { IAntdFormItemProps, IAntdSchemaFormProps } from '@apps/formily'
import Text from './components/Text'
import RadioGroud from './components/RadioGroud'
import PayTable from './components/PayTable'
import MultTable from '@/components/NiceForm/components/MultTable'
export interface PayFormProps extends IAntdSchemaFormProps {}
const PayForm: React.FC<PayFormProps> = (props) => {
  const { children, components, ...reset } = props
  const customComponents = {
    Text,
    RadioGroud,
    PayTable,
    MultTable,
  }
  const defineComponents = Object.assign(customComponents, components)
  return (
    <SchemaForm colon={false} components={defineComponents} {...reset}>
      {children}
    </SchemaForm>
  )
}
PayForm.defaultProps = {}
export default PayForm
