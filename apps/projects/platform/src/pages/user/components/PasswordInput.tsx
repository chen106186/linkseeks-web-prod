import React from 'react'
import { Input, Tooltip, Form } from 'antd'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getIntl } from '@linkseeks/i18n'
import { PasswordTooltip } from '@apps/components'
import styles from './index.less'

interface PasswordInputPropsType {
  value: string
  type: string
  placeholder: string
  size: any
  styles?: any
  onChange: Function
}
const intl = getIntl()
const PasswordInput: React.FC<PasswordInputPropsType> & { isFieldComponent: boolean } = (props) => {
  const { type, placeholder, size, value, onChange } = props

  const handleChange = (value) => {
    onChange(value)
  }

  return (
    <div style={{ width: '100%' }} className={styles.customInput}>
      <Tooltip placement="right" title={<PasswordTooltip password={value} />} color="#FFF">
        <Form.Item
          name="password"
          style={{ marginBottom: 0 }}
          rules={[
            { pattern: PATTERN_MAPS.password, message: intl.formatMessage({ id: 'user.qingshuruzhengquedemima' }) },
          ]}
        >
          <Input
            placeholder={placeholder}
            autoComplete="new-password"
            value={value}
            size={size}
            type={type}
            onChange={handleChange}
          />
        </Form.Item>
      </Tooltip>
    </div>
  )
}

PasswordInput.defaultProps = {
  type: 'password',
  placeholder: intl.formatMessage({ id: 'user.qingshezhinidedenglumi' }),
  size: 'large',
  value: '',
}

PasswordInput.isFieldComponent = false

export default PasswordInput
