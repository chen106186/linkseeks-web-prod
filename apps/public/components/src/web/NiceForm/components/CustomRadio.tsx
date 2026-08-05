import React from 'react'
import { Radio, Tooltip } from '@linkseeks/ui'
import { Field, useField } from '@apps/form'

const CustomCheckbox = (props: any) => {
  const field = useField<Field>()
  const { dataSource } = field
  const { layout } = props
  return (
    <Radio.Group
      value={props.value}
      onChange={props.onChange}
      className={layout === 'column' ? 'identityRadio' : 'businessRadio'}
      name={props.name}
    >
      {dataSource &&
        dataSource.map((v, i) => (
          <Tooltip title={v.label} placement="leftTop" key={v.value + i}>
            <Radio.Button value={v.value}>{v.label}</Radio.Button>
          </Tooltip>
        ))}
    </Radio.Group>
  )
}

export default CustomCheckbox
