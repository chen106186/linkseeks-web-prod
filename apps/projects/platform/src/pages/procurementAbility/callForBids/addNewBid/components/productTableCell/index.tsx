import React, { useRef, useContext } from 'react'
import { Form, Input, Select, Cascader } from 'antd'

import { store } from '@/store'
import { inject, observer } from 'mobx-react'

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

  // const { BidTenderStore } = store
  // const { commonCategoryData, commonUnitData } = BidTenderStore

  // input的change
  const save = async (e, idx) => {
    console.log(e, idx)
    try {
      const values = await form.validateFields()
      values[idx] = idx === 'count' ? Number(values.count) : values[idx]
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed', errInfo)
    }
  }

  // select的change
  const change = async (va, op, idx) => {
    console.log(va, op, idx)
    try {
      const values = await form.validateFields()
      values[idx] = op['label']
      values['unitId'] = op['value']
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed', errInfo)
    }
  }

  // cascader的change
  const toggle = (va, op, idx) => {
    console.log(va, op, idx)
  }

  const chooseFormItem = (type, v) => {
    switch (type) {
      // input输入类型
      case 'input': {
        return (
          <Input
            style={{ width: 140 }}
            type="number"
            ref={formItemRef}
            onChange={(e) => save(e, dataIndex)}
            {...formItemProps}
            id={dataIndex + record.id}
            className="purchase_amount_input"
          />
        )
      }
      // select选择类型
      case 'select': {
        return (
          <Select
            style={{ width: 140 }}
            ref={formItemRef}
            onChange={(value, option) => change(value, option, dataIndex)}
            id={dataIndex + record.id}
            className="purchase_amount_input"
            // options={commonUnitData.map((item) => ({ label: item.name, value: item.id }))}
            {...formItemProps}
          />
        )
      }
      // Cascader选择类型
      case 'cascader': {
        return (
          <Cascader
            style={{ width: 140 }}
            ref={formItemRef}
            onChange={(value, option) => toggle(value, option, dataIndex)}
            id={dataIndex + record.id}
            className="purchase_amount_input"
            displayRender={(label) => {
              return label[label.length - 1]
            }}
            showSearch={false}
            notFoundContent={null}
            fieldNames={{ label: 'name', value: 'id', children: 'children' }}
            // options={commonCategoryData}
            {...formItemProps}
          />
        )
      }
    }
  }

  let childNode = children
  if (editable) {
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        initialValue={record[dataIndex] || ''}
        // @todo 根据字段类型再做处理
        // rules={[
        //   {
        //     required: true,
        //     message: `${title}必须填写`,
        //   },
        //   {
        //     pattern: /^\d+(\.\d{1,3})?$/,
        //     message: '采购数量仅限三位小数',
        //   },
        // ]}
      >
        {chooseFormItem(formItem, record[dataIndex] || '')}
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

ProductTableCell.defaultProps = {}

export default ProductTableCell
