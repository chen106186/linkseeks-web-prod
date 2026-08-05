import React from 'react'
import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

interface Iprops {
  value: boolean
  editable: boolean
  props: {
    ['x-component-props']: any
  }
  mutators: {
    change: (checked: boolean) => void
  }
}

const FormilyCheckBox: React.FC<Iprops> & { isFieldComponent?: boolean } = (props: Iprops) => {
  const { value, editable } = props
  const componentProps = props.props?.['x-component-props'] || {}
  const children = props.props?.['x-component-props']?.['children'] || ''
  const checked = !!value

  const handleChange = (e: CheckboxChangeEvent) => {
    props.mutators.change(e.target.checked)
  }

  return (
    <Checkbox checked={checked} onChange={handleChange} disabled={!editable} {...componentProps}>
      {children}
    </Checkbox>
  )
}

FormilyCheckBox.isFieldComponent = true

export default FormilyCheckBox
