import React, { useRef, useContext, useEffect, useCallback } from 'react'
import { Form, Input, Switch, Button } from 'antd'
import type { InputRef } from 'antd'

export interface EditableRowProps {
  editable: boolean
  dataIndex: string
  record: any
  colIndex: number
  forceEdit: boolean
  formItem: string
  formItemProps: any
}

const EditableContext = React.createContext<any>({})

export const EditableRow: React.FC<EditableRowProps> = (props) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

type ComponentType = 'Input' | 'Switch' | 'TextArea' | 'Button'

interface EditableCellProps {
  title: React.ReactNode
  editable?: boolean
  children: React.ReactNode
  dataIndex: any
  record?: any
  rules?: any
  value?: any
  component?: ComponentType
  render?: Function
  format?: Function
  disabled?: boolean
  visible?: boolean
  editProps?: Record<string, any>
  handleChange?: (record: unknown, type: string) => void
}

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable = false,
  visible = true,
  children,
  dataIndex,
  record,
  rules,
  handleChange,
  component,
  value,
  render,
  format,
  disabled,
  editProps = {},
  ...restProps
}) => {
  // const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)

  useEffect(() => {
    form.setFieldsValue(record)
  }, [])

  const save = useCallback(
    async (e) => {
      try {
        form.setFieldsValue({ [dataIndex]: e.target.value })
        const values = await form.validateFields()
        handleChange({ ...record, ...values }, dataIndex)
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    },
    [record, dataIndex, form],
  )

  const changeSwitch = useCallback(async () => {
    try {
      form.setFieldsValue({ [dataIndex]: !record[dataIndex] })
      const values = await form.validateFields()
      handleChange({ ...record, ...values }, dataIndex)
    } catch (errInfo) {
      console.log('changeSwitch failed:', errInfo)
    }
  }, [record, dataIndex, form])

  const onBtnClick = useCallback(async () => {
    try {
      const values = await form.validateFields()
      handleChange({ ...record, ...values }, dataIndex)
    } catch (errInfo) {
      console.log('onBtnClick failed:', errInfo)
    }
  }, [record, dataIndex, form])

  const componentObj: Record<ComponentType, JSX.Element> = {
    Input: (
      <Input
        ref={inputRef}
        value={children[1]}
        onPressEnter={save}
        onBlur={save}
        disabled={record?.disabled}
        {...editProps}
      />
    ),
    TextArea: (
      <Input.TextArea
        ref={inputRef}
        value={children[1]}
        onPressEnter={save}
        onBlur={save}
        disabled={record?.disabled}
        {...editProps}
      />
    ),
    Switch: (
      <Switch
        onChange={changeSwitch}
        checked={format ? format(children[1]) : children[1]}
        disabled={record?.disabled}
        {...editProps}
      />
    ),
    Button: (
      <Button onClick={onBtnClick} disabled={record?.disabled} {...editProps}>
        {editProps?.title}
      </Button>
    ),
  }

  let childNode = children
  if (editable) {
    childNode = (
      <Form.Item style={{ margin: 0 }} name={dataIndex} rules={rules}>
        {!!visible && componentObj[component]}
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

export const EditableBody = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
}
