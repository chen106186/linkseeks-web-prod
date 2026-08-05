import React from 'react'
import { Radio, Tooltip } from 'antd'

const CustomCheckbox = (props) => {
  const { layout } = props
  return (
    <Radio.Group
      value={props.value}
      onChange={props.onChange}
      className={layout === 'column' ? 'identityRadio' : 'businessRadio'}
      name={props.name}
    >
      {props.dataSource &&
        props.dataSource.map((v, i) => (
          <Tooltip title={v.label} placement="leftTop" key={v.value + i}>
            <Radio.Button value={v.value}>{v.label}</Radio.Button>
          </Tooltip>
        ))}
    </Radio.Group>
  )
}

export default CustomCheckbox
