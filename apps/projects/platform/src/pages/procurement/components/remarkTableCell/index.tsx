import React, { useContext, useState, useEffect, useRef } from 'react'
import { Input, Form, FormInstance } from 'antd'

const EditableContext = React.createContext<FormInstance<any> | null>(null)

interface EditableRowProps {
  index: number
}

export const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: string
  record: any
  handleSave: (record: any) => void
}

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const inputRef = useRef<Input>(null)
  const form = useContext(EditableContext)

  const save = async () => {
    try {
      const values = await form.validateFields()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        initialValue={record[dataIndex]}
        // rules={[
        //   {
        //     required: true,
        //     message: `${title}必须填写`,
        //   },
        //   {
        //     pattern: /^\d+(\.\d{1,2})?$/,
        //     message: `${title}仅限两位小数`,
        //   },
        // ]}
      >
        <Input
          style={{ width: 140 }}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          type="number"
          // disabled={!record['editable']}
        />
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}
