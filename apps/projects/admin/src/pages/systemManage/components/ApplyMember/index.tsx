import React, { memo } from 'react'
import { Form, Radio, Space } from 'antd'
import { Card as CardLayout } from '@linkseeks/ui'
import styles from './index.less'
import SelectMemberTable from '../SelectMemberTable'

interface InvoiceTypeProps {
  disabled?: boolean
  fetchMemberApi: Function
  showAdvancedFilter?: boolean
}

const SELECT_TYPE = [
  { value: 1, label: '所有会员（默认）' },
  { value: 2, label: '指定会员' },
]

const ApplyMember: React.FC<InvoiceTypeProps> = (props: any) => {
  const { disabled, fetchMemberApi, showAdvancedFilter = true } = props

  return (
    <CardLayout
      id="applyMember"
      title="适用会员"
      bodyStyle={{ paddingBottom: '1px' }}
      classNames={styles['invoice-type']}
    >
      <Form.Item name="allMembers" initialValue={1}>
        <Radio.Group disabled={disabled}>
          {SELECT_TYPE.map((_item) => (
            <Radio key={_item.value} value={_item.value}>
              {_item.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.allMembers !== currentValues.allMembers}
      >
        {({ getFieldValue }) => (
          <Form.Item
            name="members"
            rules={[{ required: getFieldValue('allMembers') === 2, message: '请选择适用会员' }]}
            hidden={getFieldValue('allMembers') === 1}
          >
            <SelectMemberTable
              disabled={disabled}
              fetchMemberApi={fetchMemberApi}
              showAdvancedFilter={showAdvancedFilter}
            />
          </Form.Item>
        )}
      </Form.Item>
    </CardLayout>
  )
}
export default memo(ApplyMember)
