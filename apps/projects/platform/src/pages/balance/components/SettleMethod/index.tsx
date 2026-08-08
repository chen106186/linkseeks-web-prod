import React, { useEffect, useState } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { Radio, Input, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import styles from './index.less'
import { registerValidationRules } from '@apps/formily' // 或者 @formily/next
import SettleMethod, { SettleActiveType } from './settleMethod'

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
        ? getIntl().formatMessage({ id: 'balance.components.settleMethod.registerValidationRules.1' })
        : ''
    }
    if (payDay && (!isNumber.test(payDay) || payDay < 0 || payDay > 31 || pattern.test(payDay))) {
      return getIntl().formatMessage({
        id: 'balance.memberSettle.settleMethod.payDayValidate',
        defaultMessage: '付款日必须为数字且必须在1-31之间',
      })
    }

    return !isNumber.test(otherValues[0]) || pattern.test(otherValues[0])
      ? getIntl().formatMessage({ id: 'balance.components.settleMethod.registerValidationRules.2' })
      : ''
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
  const intl = useIntl()

  const onChange = (value) => {
    props.mutators.change(value)
  }

  if (!editable) {
    return (
      <div>
        {value.active == DAY
          ? intl.formatMessage({ id: 'balance.components.settleMethod.index.1', data: value.otherValues[0] })
          : intl.formatMessage({ id: 'balance.components.settleMethod.index.2', data: value.otherValues[1] })}
        <p>
          {value.payDay
            ? intl.formatMessage({
                id: 'balance.memberSettle.settleMethod.payDay.info',
                defaultMessage: `付款日: 每月${value.payDay}号`,
                data: value.payDay,
              })
            : intl.formatMessage({
                id: 'balance.memberSettle.settleMethod.payDay.default',
                defaultMessage: `付款日：付款日未设置，默认为结算日`,
              })}
        </p>
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
