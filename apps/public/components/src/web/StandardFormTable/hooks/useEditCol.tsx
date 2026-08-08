import React, { useEffect } from 'react'
import { Input, Form } from '@linkseeks/ui'
import { useFormTable } from '../contexts'

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: 'number' | 'text'
  record: any
  index: number
  children: React.ReactNode
}
const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0, width: 220 }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

/**
 * 支持动态编辑单元格
 *
 * 这块的写法有点多余，后面可以优化一下
 */
const useEditCol = () => {
  return {
    components: {
      body: {
        cell: EditableCell,
      },
    },
  }
}

export default useEditCol
