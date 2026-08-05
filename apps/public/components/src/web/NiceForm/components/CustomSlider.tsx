import React from 'react'
import { Slider, Input, Space } from '@linkseeks/ui'
import { Field, useField } from '@apps/form'

const CustomSlider = (props) => {
  const field = useField<Field>()
  const { value = 0, min = 0, max = 0, width = '100%', layout = {}, isNumber = false } = props

  const handleChange = (e) => {
    const fieldValue = e.target ? e.target.value || 0 : e
    let nowValue = parseInt(fieldValue).toString()
    if (nowValue < min) {
      return
    } else if (nowValue > max) {
      nowValue = max
    }

    field.setState((state) => {
      state.value = nowValue === '0' ? '' : nowValue
    })
    // props.mutators.change(nowValue === '0' ? '' : nowValue)
  }

  return (
    <div style={{ width: '100%', ...layout }}>
      <Slider style={{ width }} disabled={!props.editable} value={value} onChange={handleChange} {...props} />
      {isNumber ? (
        <div>
          <Input type="number" className="underline_input" value={value} onChange={handleChange} />
        </div>
      ) : (
        <Space>
          <Input
            type="number"
            disabled
            max={max}
            value={props.value}
            onChange={(e) => props.mutators.change(e.target.value)}
            addonAfter="尺"
          />
          {max && <span>还剩：{max - value}尺</span>}
        </Space>
      )}
    </div>
  )
}

CustomSlider.defaultProps = {}

CustomSlider.isFieldComponent = true

export default CustomSlider
