import React from 'react'
import { Checkbox, Form, Select, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import NumberInput from '@/components/NumberInput'
import FetchSelect from '@/components/FetchSelect'
import { getContractSelectListContractTemplate } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

type PropsType = {
  disabled?: boolean
}

export default function ProcessContract({ disabled }: PropsType) {
  const intl = useIntl()

  return (
    <div>
      <Form.Item
        name="hasContract"
        label={intl.formatMessage({ id: 'processRuleSetting.dianzihetong', defaultMessage: '电子合同' })}
        valuePropName="checked"
      >
        <Checkbox disabled={disabled}>
          {intl.formatMessage({ id: 'processRuleSetting.shiyongdianzihe', defaultMessage: '使用电子合同' })}
        </Checkbox>
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.hasContract !== curValues.hasContract}>
        {({ getFieldValue }) => {
          return (
            <Form.Item
              name="contractTempleId"
              label=" "
              hidden={!getFieldValue('hasContract')}
              rules={[
                {
                  required: getFieldValue('hasContract'),
                  message: intl.formatMessage({
                    id: 'processRuleSetting.qingxuanzedianzi',
                    defaultMessage: '请选择电子合同模板',
                  }),
                },
              ]}
              className="use-form-noRequired"
            >
              <FetchSelect
                valueType="single"
                placeholder={intl.formatMessage({
                  id: 'processRuleSetting.qingxuanzedianzi',
                  defaultMessage: '请选择电子合同模板',
                })}
                requestApi={getContractSelectListContractTemplate}
                labelKey="name"
                valueKey="id"
                disabled={disabled}
              />
            </Form.Item>
          )
        }}
      </Form.Item>
    </div>
  )
}
