import React from 'react'
import { registerValidationRules } from '@apps/formily' // 或者 @formily/next
import SettleMethod from './settleMethod'

type SettleMethodProps = React.ComponentProps<typeof SettleMethod>

const DAY = 1
const MONTH = 2

registerValidationRules({
  settleMethodRule: (value) => {
    const { active, otherValues, payDay } = value
    const isNumber = /^\d+$/ // 数字
    const pattern = /[0-9]+\.[0-9]*/

    if (active == MONTH) {
      return !isNumber.test(otherValues[1]) || otherValues[1] < 0 || otherValues[1] > 31 || pattern.test(otherValues[1])
        ? '只允许填写1-31号'
        : ''
    }
    if (payDay && (!isNumber.test(payDay) || payDay < 0 || payDay > 31 || pattern.test(payDay))) {
      return '付款日必须为数字且必须在1-31之间'
    }

    return !isNumber.test(otherValues[0]) || pattern.test(otherValues[0]) ? '只允许填写正整数' : ''
  },
})

type XcomponenetProps = {
  options: {
    days: boolean
    month: boolean
  }
  default: any
}

interface Iprops {
  /** 编辑状态 */
  editable: boolean
  initialValue?: SettleMethodProps['value']
  value: SettleMethodProps['value']
  props: {
    ['x-component-props']: XcomponenetProps
  }
  mutators: {
    change: (value: any) => void
  }
}

const Index: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const editable = props.editable
  const value = props.value || { active: 1, otherValues: [30, 1], payDay: null }
  const componentProps = props.props['x-component-props'] || ({} as XcomponenetProps)
  const options = componentProps.options || ({} as XcomponenetProps['options'])

  const onChange = (value) => {
    props.mutators.change(value)
  }

  if (!editable) {
    return (
      <div>
        {value.active == DAY
          ? `账期（默认）， 账期天数${value.otherValues[0]}天 `
          : `月结： 每月${value.otherValues[1]}号`}
        <p>付款日: {value.payDay ? `每月${value.payDay}号` : `付款日没有设置，默认结算日`}</p>
      </div>
    )
  }

  return (
    <div>
      <SettleMethod
        value={value}
        daysVisible={options?.days || false}
        monthVisible={options.month || false}
        onChange={onChange}
      />
    </div>
  )
}

Index.isFieldComponent = true
export default Index
