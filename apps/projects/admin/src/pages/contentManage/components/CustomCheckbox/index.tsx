import React from 'react'
import { Checkbox } from 'antd'

const CustomCheckbox = (props) => {
  console.log(props)
  const editable = props.editable
  const handleChange = (e) => {
    props.mutators.change(e.target.checked)
  }

  return (
    <Checkbox disabled={!editable} checked={props.value} onChange={handleChange}>
      置顶
    </Checkbox>
  )
}

CustomCheckbox.isFieldComponent = true

export default CustomCheckbox
