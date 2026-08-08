import React from 'react'
import { Slider, Input, Space, InputNumber } from 'antd'
import { useIntl } from '@linkseeks/i18n'
const CustomSlider = (props) => {
  const value = props.value || 0
  const componentProps = props.props['x-component-props'] || {}
  const { min = 0, max = 0, width = '100%', layout = {}, isNumber = false } = componentProps
  const intl = useIntl()

  const handleChange = (e) => {
    const fieldValue = e.target ? e.target.value || 0 : e
    let nowValue = Number(fieldValue).toString()
    if (nowValue < min) {
      return
    } else if (nowValue > max) {
      nowValue = max
    }
    props.mutators.change(nowValue === '0' ? '' : nowValue)
  }

  return (
    <div style={{ width: '100%', ...layout }}>
      <Slider
        style={{ width }}
        disabled={!props.editable}
        value={value}
        onChange={handleChange}
        {...props.props['x-component-props']}
      />
      {isNumber ? (
        <div>
          {/* <Input type='number' className='underline_input' value={value} onChange={handleChange}/> */}
          <InputNumber
            className="underline_input"
            value={value}
            onChange={handleChange}
            {...props.props['x-component-props']}
          />
        </div>
      ) : (
        <Space>
          <Input
            type="number"
            disabled
            max={max}
            value={props.value}
            onChange={(e) => props.mutators.change(e.target.value)}
            addonAfter={intl.formatMessage({ id: 'components.chi' })}
          />
          {max && (
            <span>
              {intl.formatMessage({ id: 'components.haisheng' })}：{max - value}
              {intl.formatMessage({ id: 'components.chi' })}
            </span>
          )}
        </Space>
      )}
    </div>
  )
}

CustomSlider.defaultProps = {}

CustomSlider.isFieldComponent = true

export default CustomSlider
