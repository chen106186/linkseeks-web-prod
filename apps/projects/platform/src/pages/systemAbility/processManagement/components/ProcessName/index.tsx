import React from 'react'
import { Form, Input } from 'antd'
import { validatorByte } from '@/utils/regExp'
import { PAGE_TYPE } from '@/constants'
import { useIntl } from '@linkseeks/i18n'

type PropsType = {
  name?: string
  label?: string
  maxCount?: number
  disabled?: boolean
  isDefault?: boolean
  pageType?: 'add' | 'edit' | 'view'
}

export default function ProcessName(props: PropsType) {
  const intl = useIntl()

  const {
    name = 'name',
    label = intl.formatMessage({ id: 'processRuleSetting.liuchengguizeming', defaultMessage: '流程规则名称' }),
    maxCount = 48,
    disabled,
    isDefault,
    pageType,
  } = props

  return (
    <>
      <Form.Item
        name={name}
        label={label}
        rules={[
          {
            required: true,
            message: `${intl.formatMessage({ id: 'common.enter', defaultMessage: '请填写' })}${label}`,
          },
          { validator: (rule, value, callback) => validatorByte(rule, value, callback, maxCount) },
        ]}
      >
        <Input disabled={disabled} maxLength={maxCount} />
      </Form.Item>
      {pageType !== PAGE_TYPE.ADD && (
        <Form.Item
          name="isDefault"
          label={intl.formatMessage({ id: 'processRuleSetting.shifoumorenliucheng', defaultMessage: '是否默认流程' })}
        >
          <div>
            {isDefault
              ? intl.formatMessage({ id: 'common.button.yes', defaultMessage: '是' })
              : intl.formatMessage({ id: 'common.button.no', defaultMessage: '否' })}
          </div>
        </Form.Item>
      )}
    </>
  )
}
