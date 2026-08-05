import React, { useRef, useContext } from 'react'
import { Form, Input } from 'antd'
import './index.less'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

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
  const save = async (e) => {
    try {
      const values = await form.validateFields()
      values.taxRate = Number(values.taxRate) || 0
      values.price = Number(values.price) || 0
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed', errInfo)
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
            message: `${title}${intl.formatMessage({ id: 'table.purchase.bixutianxie' })}`,
          },
          dataIndex === 'price'
            ? {
                pattern: /^\d+(\.\d{1,4})?$/,
                message: intl.formatMessage({ id: 'table.purchase.danjiajinxiansi' }),
              }
            : {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: intl.formatMessage({ id: 'table.purchase.shuilüjinxianliang' }),
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
