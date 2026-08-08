import React, { useEffect } from 'react'
import RangeTime from './index'
import { Moment } from 'moment'

interface Iprops {
  value: Moment[] | string
  editable: boolean
  ruleErrors: string[]
  props: {
    ['x-component-props']: any
  }
  mutators: {
    change: (params: Moment[]) => void
  }
}

const toArray = (value: string | Moment[]): Moment[] => {
  if (!value) {
    return []
  }
  if (Array.isArray(value)) {
    return value
  }
  return []
}

const FormilyRangeTime: React.FC<Iprops> = (props: Iprops) => {
  const { value, editable, ruleErrors } = props
  // const schemaProps = useSchemaProps()
  // console.log(schemaProps);
  const componentProps = props.props?.['x-component-props'] || {}
  const momentValue = toArray(value)
  const hasError = ruleErrors.length > 0

  const onChange = (info: Moment[]) => {
    props.mutators.change(info)
  }

  return (
    <div style={{ flex: 1 }}>
      <RangeTime disabled={!editable} rangeTime={momentValue} onChange={onChange} {...componentProps} />
      {hasError && <p style={{ marginBottom: 0, color: '#ff4d4f' }}>{ruleErrors.join(',')}</p>}
    </div>
  )
}

const WrapFormilyRangeTime: typeof FormilyRangeTime & {
  isFieldComponent?: boolean
} = FormilyRangeTime

WrapFormilyRangeTime.isFieldComponent = true
export default WrapFormilyRangeTime
