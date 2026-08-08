import React, { useState, useRef, useContext, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { has } from 'lodash'

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
      values.purchaseCount = Number(values.purchaseCount) || 0
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  const chooseFormItem = (type, v) => {
    switch (type) {
      case 'input': {
        // 用于判断是否是合并下单
        let hasSelectMergeBtn = document.getElementsByClassName('selectMerge')
        // 用于合并订单采购数量回显
        if (hasSelectMergeBtn.length) {
          let keyValue = {}
          keyValue[dataIndex] = v
          form.setFieldsValue(keyValue)
        }

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
      let _value = Number(value)
      if (isNaN(_value) || _value < Number(record['minOrder'])) {
        throw new Error(`数量不小于最小起订数${record['minOrder']}`)
      }
      if (_value > Number.MAX_SAFE_INTEGER) {
        throw new Error('数值精度溢出')
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
            message: `${title}必须填写`,
          },
          {
            pattern: /^\d+(\.\d{1,3})?$/,
            message: '采购数量仅限三位小数',
          },
          {
            validator: validatorNumber,
          },
        ]}
      >
        {chooseFormItem(formItem, record[dataIndex] || '')}
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

ProductTableCell.defaultProps = {}

export default ProductTableCell
