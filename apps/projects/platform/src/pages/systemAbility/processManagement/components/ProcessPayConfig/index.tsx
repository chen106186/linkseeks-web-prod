import React from 'react'
import { Form, FormInstance } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import NumberInput from '@/components/NumberInput'
import PayConfig from '../PayConfig'
import { getIntl } from '@linkseeks/i18n'

type PropsType = {
  name?: string
  disabled?: boolean
}

const intl = getIntl()

const validatorPayConfig = (value, callback, disabled: boolean) => {
  if (disabled) callback()
  try {
    if (value) {
      let sum = 0
      value.forEach((item) => {
        item.nodes?.forEach((i) => {
          if (['', null, undefined].includes(i.payRate)) {
            throw new Error(
              intl.formatMessage({ id: 'processRuleSetting.qingwansahnzhifubili', defaultMessage: '请完善支付比例' }),
            )
          } else {
            sum += Number(i.payRate)
          }
        })
        // sum += item.nodes?.reduce((s, current) => s + (current.payRate ? Number(current.payRate) : 0), 0)
      })
      if (sum !== 100) {
        throw new Error(
          intl.formatMessage({
            id: 'processRuleSetting.bilizhihe100',
            defaultMessage: '全部支付次数的支付比例之和需要等于100',
          }),
        )
      } else {
        callback()
      }
    } else {
      callback()
    }
  } catch (err) {
    callback(err)
  }
}

export default function ProcessPayConfig({ name = 'payments', disabled }: PropsType) {
  return (
    <>
      <div style={{ color: '#91959B' }}>
        {intl.formatMessage({
          id: 'processRuleSetting.duocizhifutishi',
          defaultMessage: '当前选择的工作流是多次支付，所以需要进行支付配置',
        })}
      </div>
      <Form.Item
        name={name}
        rules={[
          {
            required: !disabled,
            message: `${intl.formatMessage({ id: 'common.enter', defaultMessage: '请填写' })}${intl.formatMessage({
              id: 'processRuleSetting.zhifupeizhi',
              defaultMessage: '支付配置',
            })}`,
          },
          { validator: (r, v, callback) => validatorPayConfig(v, callback, disabled) },
        ]}
      >
        <PayConfig disabled={disabled} />
      </Form.Item>
    </>
  )
}
