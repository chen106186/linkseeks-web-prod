import React from 'react'
import { Form, Input } from '@linkseeks/ui'
import { useIntl } from '@linkseeks/i18n'
import { useMemoizedFn } from '@linkseeks/hooks'

type ranageValue = [number | undefined, number | undefined]

export interface NumberRanageProps {
  onChange: [(value: number) => void, (value: number) => void]
  value: ranageValue
  placeholder?: [string, string]
  innerStyle?: any
  name?: any[]
}

const NumberRanage = (props: NumberRanageProps) => {
  const { placeholder = [], onChange = [], value = [], name = [] } = props
  const intl = useIntl()
  const [minChange, maxChange] = onChange
  const [minValue, maxValue] = value
  const [minPlaceHolder, maxPlaceHolder] = placeholder

  const handleChange = useMemoizedFn((event, type) => {
    const value = event.target.value
    if (type === 0) {
      minChange && minChange(value)
    } else if (type === 1) {
      maxChange && maxChange(value)
    }
  })
  return (
    <Input.Group compact>
      <Form.Item name={name[0]} noStyle>
        <Input
          style={{
            width: 100,
            textAlign: 'center',
          }}
          type="number"
          placeholder={minPlaceHolder || intl.formatMessage({ id: 'components.zuixiaozhi', defaultMessage: '最小值' })}
          onChange={(e) => handleChange(e, 0)}
          value={minValue}
        />
      </Form.Item>

      <Input
        style={{
          width: 30,
          pointerEvents: 'none',
          background: '#fff',
        }}
        placeholder="~"
        disabled
      />
      <Form.Item name={name[1]} noStyle>
        <Input
          style={{
            width: 100,
            textAlign: 'center',
          }}
          type="number"
          placeholder={maxPlaceHolder || intl.formatMessage({ id: 'components.zuidazhi', defaultMessage: '最大值' })}
          onChange={(e) => handleChange(e, 1)}
          value={maxValue}
        />
      </Form.Item>
    </Input.Group>
  )
}

export default NumberRanage
