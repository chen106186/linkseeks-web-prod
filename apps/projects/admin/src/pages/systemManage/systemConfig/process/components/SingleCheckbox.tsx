import React, { useEffect, useState } from 'react'
import { Checkbox, CheckboxProps } from 'antd'
import moment from 'moment'

type SN = string | number

interface PropsType extends Omit<CheckboxProps, 'onChange'> {
  checkedValue?: [SN, SN]
  onChange?: (x: SN) => void
}

const SingleCheckbox = (props: PropsType) => {
  const { onChange, checkedValue = [1, 0], value, children, ...rest } = props

  const [checked, setChecked] = useState<boolean>(false)

  const _onChange = (e: any) => {
    const isChecked = e.target.checked
    setChecked(isChecked)
    onChange?.(isChecked ? checkedValue[0] : checkedValue[1])
  }

  useEffect(() => {
    if (value) {
      setChecked(value === checkedValue[0])
    }
  }, [value])

  return (
    <Checkbox checked={checked} {...rest} value={moment(value)} onChange={_onChange}>
      {children}
    </Checkbox>
  )
}

export default SingleCheckbox
