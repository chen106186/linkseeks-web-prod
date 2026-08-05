import React, { useRef, useContext } from 'react'
import { Form, Input } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { FormDetailContext } from '@/formSchema/context'

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
  const { formContext } = useContext(FormDetailContext)

  const save = async () => {
    try {
      const values = await form.validateFields()
      values[dataIndex] = Number(values[dataIndex]) || 0
      handleSave({ ...record, ...values })
      formContext.ctl.setInnerFormErrors(0)
    } catch (errInfo) {
      formContext.ctl.setInnerFormErrors(errInfo.errorFields.length)
      console.log('Save failed:', errInfo)
    }
  }

  const chooseFormItem = (type, v) => {
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

  /** 根据字段dataIndex不同 渲染不同的校验规则 */
  const customRules = (dataIndex) => {
    let rule = []
    switch (dataIndex) {
      case 'amount':
        rule = [
          {
            required: true,
            message: intl.formatMessage({ id: 'saleOrder.productTableCell.validator1' }).replaceAll('x', `${title}`),
          },
          {
            pattern: /^\d+(\.\d{1,3})?$/,
            message: intl.formatMessage({ id: 'saleOrder.productTableCell.validator2' }),
          },
        ]
        break
      case 'carton':
        rule = [
          {
            required: true,
            message: intl.formatMessage({ id: 'saleOrder.productTableCell.validator1' }).replaceAll('x', `${title}`),
          },
          {
            pattern: /^\d+(\.\d{1,1})?$/,
            message: intl.formatMessage({ id: 'saleOrder.productTableCell.validator2' }),
          },
        ]
        break
      case 'weight':
        rule = [
          {
            pattern: /^\d+(\.\d{1,3})?$/,
            message: intl.formatMessage({ id: 'saleOrder.productTableCell.validator3' }),
          },
        ]
        break
      case 'volume':
        rule = [
          {
            pattern: /^\d+(\.\d{1,3})?$/,
            message: intl.formatMessage({ id: 'saleOrder.productTableCell.validator3' }),
          },
        ]
        break
      default:
        rule = []
    }
    return rule
  }

  let childNode = children
  if (editable) {
    childNode = (
      <Form.Item
        className="customFormItem"
        name={dataIndex}
        initialValue={record[dataIndex] || ''}
        rules={customRules(dataIndex)}
      >
        {chooseFormItem(formItem, record[dataIndex] || '')}
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

ProductTableCell.defaultProps = {}

export default ProductTableCell
