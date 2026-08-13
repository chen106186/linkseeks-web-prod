import React, { useContext } from 'react'
import { Form, Input } from 'antd'

const EditableContext = React.createContext<any>({})

export const ProductEditableRow: React.FC<any> = ({ ...props }) => {
  const [form] = Form.useForm()

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={{ form }}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const ProductTableCell: React.FC<any> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  formItem,
  formItemProps = {},
  ...restProps
}) => {
  const { form } = useContext(EditableContext)

  const save = async () => {
    try {
      const values = await form.validateFields()
      handleSave({ ...record, ...values })
    } catch (error) {
      return error
    }
  }

  let childNode = children

  if (editable) {
    childNode = (
      <Form.Item
        name={dataIndex}
        initialValue={record[dataIndex]}
        style={{ margin: 0 }}
        rules={[
          { required: true, message: `${title}不能为空` },
          { pattern: /^(0|[1-9]\d*)(\.\d{1,3})?$/, message: '数量最多支持3位小数' },
        ]}
      >
        {formItem === 'input' ? <Input type="number" style={{ width: 140 }} onChange={save} {...formItemProps} /> : null}
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

export default ProductTableCell
