import React from 'react'
import { Checkbox } from 'antd'
import { getIntl } from '@linkseeks/i18n'

const CustomCheckbox = (props) => {
  const intl = getIntl()
  const editable = props.editable
  const handleChange = (e) => {
    props.mutators.change(e.target.checked)
  }

  return (
    <Checkbox disabled={!editable} checked={props.value} onChange={handleChange}>
      {intl.formatMessage({ id: 'content.notice.topping' })}
    </Checkbox>
  )
}

CustomCheckbox.isFieldComponent = true

export default CustomCheckbox
