import React from 'react'
import { ISchemaFieldProps, ISchemaFieldComponentProps } from '@apps/formily'

const VirtualChildren = (props: ISchemaFieldComponentProps) => {
  // console.log(props)
  const { children } = props.schema.getExtendsComponentProps()
  // const componentProps = schema.getExtendsComponentProps()
  // const { children } = componentProps
  return children ? children : <div>virtual</div>
}

VirtualChildren.defaultProps = {}

VirtualChildren.isVirtualFieldComponent = true

export default VirtualChildren
