import React, { useRef, useContext } from 'react'
import { Form, Input } from 'antd'
import './index.less'
import { validatorByte } from '@/utils/regExp'
import { useIntl } from '@linkseeks/i18n'

export interface PaymentTableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: string
  record: any
  handleSave: (record: any) => Promise<any>
  forceEdit: boolean
  formItem: string
  formItemProps: any
}

const EditableContext = React.createContext<any>({})

export const PaymentEditableRow: React.FC<any> = ({ ...props }) => {
  const [form] = Form.useForm()

  const ctx = {
    form,
  }
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={ctx}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

export const PaymentTableCell: React.FC<PaymentTableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  forceEdit,
  formItem,
  formItemProps = {},
  ...restProps
}) => {
  const formItemRef = useRef<any>()
  const { form } = useContext(EditableContext)
  const intl = useIntl()
  const save = async (e) => {
    try {
      const values = await form.validateFields()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  const chooseFormItem = (type, dataIndex) => {
    switch (type) {
      case 'input': {
        return (
          <Input
            style={{ width: 140 }}
            type={dataIndex === 'payNode' ? 'string' : 'number'}
            ref={formItemRef}
            onChange={save}
            {...formItemProps}
            id={dataIndex + record.batchNo}
            className="payment_setting_input"
          />
        )
      }
    }
  }

  let childNode = children
  if (editable) {
    childNode = (
      <Form.Item
        className="customFormItem"
        name={dataIndex}
        initialValue={record ? record[dataIndex] : ''}
        rules={[
          {
            required: true,
            message: `${title}${intl.formatMessage({
              id: 'processRuleSetting.bixutianxie',
              defaultMessage: '必须填写',
            })}`,
          },
          dataIndex === 'payNode'
            ? {
                validator: (r, v, c) => validatorByte(r, v, c, 24),
              }
            : {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: intl.formatMessage({
                  id: 'processRuleSetting.zhifubilijin',
                  defaultMessage: '支付比例仅限两位小数',
                }),
              },
        ]}
      >
        {chooseFormItem(formItem, dataIndex)}
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

PaymentTableCell.defaultProps = {}

export default PaymentTableCell
