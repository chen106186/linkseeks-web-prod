import React from 'react'
import { Radio } from 'antd'
import styles from './index.less'
const RadioGroud = (props: any) => {
  const options = props.options || [
    { label: '是', value: 1 },
    { label: '否', value: 0 },
  ]
  return (
    <Radio.Group
      className={styles['radio-group-box']}
      size="small"
      defaultValue={0}
      value={props.value}
      buttonStyle="solid"
      options={options}
      optionType="button"
      onChange={(e) => props.mutators.change(e)}
    />
  )
}

RadioGroud.defaultProps = {}
RadioGroud.isFieldComponent = true
export default RadioGroud
