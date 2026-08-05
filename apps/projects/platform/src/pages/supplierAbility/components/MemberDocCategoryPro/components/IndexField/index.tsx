/**
 * @Description 序号 Filed
 */
import React, { HTMLAttributes } from 'react'
import { FormPath } from '@apps/formily'

const IndexField: React.FC<any> & { isFieldComponent: boolean } = (props) => {
  const { name } = props
  const xComponentProps: HTMLAttributes<HTMLDivElement> = props.props['x-component-props'] || {}

  const index = FormPath.transform(name, /\d/, ($1) => {
    return `${$1 + 1}`
  })

  return <div {...xComponentProps}>{index}</div>
}

IndexField.isFieldComponent = true

export default IndexField
