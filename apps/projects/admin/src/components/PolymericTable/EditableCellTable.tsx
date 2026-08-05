/*
 * @Author: XieZhiXiong
 * @Date: 2020-08-20 16:15:59
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-16 14:30:20
 * @Description: 基于 NormalTable 简单的可编辑列 Table
 */
import React, { useContext, useState, useEffect, useRef } from 'react'
import { Input, Form } from 'antd'
import { NormalTableProps, EditableCellProps } from './interface'
import NormalTable from './NormalTable'

const EditableContext = React.createContext<any>({})

interface EditableRowProps {
  index: number
  onFieldsChange: (changedFields: []) => {}
}

const EditableRow: React.FC<EditableRowProps> = ({ index, onFieldsChange, ...props }) => {
  const [form] = Form.useForm()

  const handleFieldsChange = (changedFields, allFields) => {
    if (onFieldsChange) {
      onFieldsChange(changedFields)
    }
  }

  return (
    <Form form={form} component={false} onFieldsChange={handleFieldsChange}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  index,
  record,
  rules = [],
  addonAfter = null,
  onSave,
  onValidateError,
  ...restProps
}) => {
  const [editing, setEditing] = useState(true)
  const inputRef = useRef<Input | null>(null)
  const form = useContext(EditableContext)
  const inputId = `${dataIndex}-${index}` // 拼接 name-index，不然全部展示输入框会警告 id 不唯一的问题

  useEffect(() => {
    if (editing) {
      // inputRef.current.focus();
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex as string]: record[dataIndex as string] })
  }

  const save = async (e) => {
    try {
      const values = await form.validateFields()

      // toggleEdit();
      if (onSave) {
        onSave({
          ...record,
          [dataIndex as string]: values[inputId],
        })
      }
    } catch (errInfo) {
      if (onValidateError) {
        onValidateError(errInfo)
      }
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={inputId} rules={rules} initialValue={record[dataIndex as string]}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} addonAfter={addonAfter} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

const EditableCellTable: React.FC<NormalTableProps<{}>> = (props) => {
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  return <NormalTable components={components} rowClassName={() => 'editable-row'} {...props} />
}

export default React.memo(EditableCellTable)
