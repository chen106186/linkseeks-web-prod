import React, { useRef, useContext } from 'react'
import { Form, Input } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import styles from './index.less'

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
            id={dataIndex + record.productId}
            className="delivery_amount_input"
          />
        )
      }
    }
  }

  let childNode = children
  if (editable) {
    childNode = (
      <Form.Item
        className={styles.customFormItem}
        name={dataIndex}
        initialValue={record[dataIndex]}
        rules={[
          {
            required: true,
            message: `${title}${intl.formatMessage({
              id: 'transaction_components.bixutianxie',
              defaultMessage: '必须填写',
            })}`,
          },
          {
            pattern: /^\d+(\.\d{1,3})?$/,
            message: intl.formatMessage({
              id: 'transaction_components.shuliangjinxiansanweixiaoshu',
              defaultMessage: '数量仅限三位小数',
            }),
          },
          // {
          //   min: 0,
          //   message: `数量大于等于0`,
          // },
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
