import React from 'react'
import { Form, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import NumberInput from '@/components/NumberInput'
import { useIntl } from '@linkseeks/i18n'

type PropsType = {
  name?: string
  label?: string
  maxCount?: number
  disabled?: boolean
}

export default function ProcessCancelTime(props: PropsType) {
  const intl = useIntl()
  const {
    name = 'expireHours',
    label = `${intl.formatMessage({ id: 'processRuleSetting.dingdanquxiaoshi', defaultMessage: '订单取消时间' })}`,
    disabled,
  } = props

  return (
    <>
      <Form.Item name={name} label={label}>
        <NumberInput
          style={{ width: '100%', marginBottom: 8 }}
          decimals={1}
          addonAfter={`${intl.formatMessage({ id: 'processRuleSetting.xiaoshi', defaultMessage: '小时' })}`}
          max={999}
          tips={`${intl.formatMessage({
            id: 'processRuleSetting.xiadanhouchaoguoduo',
            defaultMessage: '下单后超过多少小时未支付后自动取消订单',
          })}`}
          disabled={disabled}
        />
      </Form.Item>
    </>
  )
}
