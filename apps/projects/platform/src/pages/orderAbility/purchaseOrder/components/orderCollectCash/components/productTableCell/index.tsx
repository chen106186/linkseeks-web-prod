import React, { useRef, useContext } from 'react'
import { Form, Input } from 'antd'
import { useIntl } from '@linkseeks/i18n'
export interface ProductTableCellProps {
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

export const ProductEditableRow: React.FC<any> = ({ ...props }) => {
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

export const ProductTableCell: React.FC<ProductTableCellProps> = ({
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

  const save = async () => {
    try {
      const values = await form.validateFields()
      values.purchaseCount = Number(values.purchaseCount) || 0
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  const chooseFormItem = (type) => {
    switch (type) {
      case 'input': {
        return (
          <Input
            style={{ width: 140 }}
            type="number"
            ref={formItemRef}
            onChange={save}
            {...formItemProps}
            id={dataIndex + record.id}
            className="purchase_amount_input"
          />
        )
      }
    }
  }

  // 校验最小起订
  const validatorNumber = (rule, value, callback) => {
    try {
      const _value = Number(value)
      if (isNaN(_value) || _value < Number(record.minOrder)) {
        throw new Error(
          intl
            .formatMessage({ id: 'purchaseOrder.orderCollect.productTableCell.validator3' })
            .replaceAll('x', record.minOrder),
        )
      }
      if (_value > Number.MAX_SAFE_INTEGER) {
        throw new Error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.productTableCell.validator1' }))
      }
      callback()
    } catch (err) {
      callback(err)
    }
  }

  let childNode = children
  if (editable) {
    childNode = (
      <Form.Item
        className="customFormItem"
        name={dataIndex}
        initialValue={record[dataIndex] || ''}
        rules={[
          {
            required: true,
            message: intl
              .formatMessage({ id: 'purchaseOrder.orderCollect.productTableCell.validator4' })
              .replaceAll('x', `${title}`),
          },
          {
            pattern: /^\d+(\.\d{1,3})?$/,
            message: intl.formatMessage({
              id: 'purchaseOrder.orderCollect.productTableCell.validator2',
            }),
          },
          {
            validator: validatorNumber,
          },
        ]}
      >
        {chooseFormItem(formItem)}
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

ProductTableCell.defaultProps = {}

export default ProductTableCell
