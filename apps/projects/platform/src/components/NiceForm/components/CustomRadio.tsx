import React from 'react';
import { Radio, Tooltip } from 'antd';

const CustomCheckbox = props => {
  const { layout, value, dataSource } = props

  return (
    <Radio.Group value={value} onChange={props.onChange} className={layout === 'column' ? 'identityRadio' : 'businessRadio'} name={props.name}>
      {
        dataSource && dataSource.map((v, i) => <Tooltip title={v.label} placement='leftTop' key={v.value}><Radio.Button value={v.value} >{v.label}</Radio.Button></Tooltip>)
      }
    </Radio.Group>
  )
}

export default CustomCheckbox