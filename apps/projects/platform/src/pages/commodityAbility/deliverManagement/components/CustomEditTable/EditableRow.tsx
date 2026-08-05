import React, { useEffect } from 'react'
import { Form } from 'antd'

export const EditableContext = React.createContext<any>({})

export const EditableRow: React.FC<
  React.HTMLAttributes<HTMLTableRowElement> & {
    /**
     * ref存储表单的校验
     */
    tablefromref: any
    /**
     * 当前表格显示的有多少条数据
     */
    rowlength: number
    /**
     * 当前一整行的数据
     */
    record: any
  }
> = (props) => {
  const { tablefromref, rowlength, record } = props
  const [form] = Form.useForm()
  useEffect(() => {
    if (tablefromref?.current && Array.isArray(tablefromref?.current) && rowlength !== tablefromref?.current.length) {
      tablefromref.current.push({ key: record.index, validateFields: form.validateFields })
    }
  }, [rowlength, form, tablefromref, record])
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}
