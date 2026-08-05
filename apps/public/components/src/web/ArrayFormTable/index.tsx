import React, { ReactNode } from 'react'
import { EditIcon, PlusCircleIcon } from '@linkseeks/icons'
import { Input, Table, Form, TableProps, FormInstance, Button, Space } from '@linkseeks/ui'
import { ColumnGroupType, ColumnType } from 'antd/lib/table'
import { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import './index.less'
import { useMemoizedFn } from '@linkseeks/hooks'
import { Validator } from '@apps/validator'
import isEmpty from 'lodash/isEmpty'

interface FormTableContextProps {
  editKey: number | string
  value?: any
  onChange?(value: any): void
  showControl?: boolean
  maxLength?: number
}
const FormTableContext = createContext<FormTableContextProps>({ editKey: '' })
export interface ArrayFormTableProps extends TableProps<any> {
  columns?: ((ColumnGroupType<any> | ColumnType<any>) & { editable?: boolean; dataIndex?: string })[]
  getCellOptions?(item: any): any
  value?: any
  onChange?(value): void
  rowKey?: any
  customerEditableCell?: any
  /**
   * 是否显示新增按钮
   */
  showControl?: boolean
  /**
   * 是否支持拖拽排序
   */
  sortable?: boolean
  /**
   * 输入的最大长度
   */
  maxLength?: number
  onAdd?(): void
  onRemove?(record: any, index: number): void
  onEdit?(record, index): void
  onSave?(value: any, index: number): void
  onValueChange?(current: any, allCurrent?: any): void
  /**
   * 操作项额外按钮
   */
  extra?(record, index): ReactNode
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  dataIndex: string
  title: any
  formType: 'number' | 'text'
  record: any
  index: number
  children: React.ReactNode
  editable: boolean
  [key: string]: any
}

const validator = new Validator()
const EditableCell = (props: EditableCellProps) => {
  const { formType, dataIndex, record, title, editable, children, index, handleSave, id, ...resetProps } = props
  const contextValues = useContext(FormTableContext)
  let childNode = children

  if (editable) {
    if (contextValues.showControl) {
      if (contextValues.editKey === index) {
        childNode = (
          <Form.Item
            name={[id!, index, dataIndex]}
            rules={[validator.validateTextLength({ length: contextValues.maxLength })]}
          >
            <Input />
          </Form.Item>
        )
      }
    } else {
      childNode = (
        <Form.Item
          name={[id!, index, dataIndex]}
          rules={[validator.validateTextLength({ length: contextValues.maxLength })]}
        >
          <Input />
        </Form.Item>
      )
    }
  }

  return <td {...resetProps}>{childNode}</td>
}

/**
 * 表格类型的表单
 * 支持自增
 */
const ArrayFormTable = forwardRef((props: ArrayFormTableProps, ref) => {
  const {
    customerEditableCell,
    value = [],
    onChange,
    rowKey = 'id',
    showControl,
    columns,
    onAdd,
    onRemove,
    onEdit,
    onSave,
    extra,
    id,
    onValueChange,
    maxLength,
    ...resetProps
  } = props
  const [formInstance] = Form.useForm()
  const [editKey, setEditKey] = useState<number | string>('')
  useImperativeHandle(ref, () => {
    return {
      ...formInstance,
    }
  })

  const handleEdit = (record, index) => {
    if (onEdit) {
      onEdit && onEdit(record, index)
    } else {
      setEditKey(index)
    }
  }

  const handleSave = (record, index) => {
    const value = formInstance.getFieldsValue([id!])
    if (onSave) {
      onSave(value[id!], index)
    } else {
      onChange && onChange(value[id!])
    }
    setEditKey('')
  }
  const mergeColumns = useMemoizedFn(() => {
    if (columns) {
      const results = columns.map((col) => {
        if (!col.editable) {
          return col
        }

        return {
          ...col,
          onCell: (record: any, index: number) => ({
            record,
            formType: 'text',
            dataIndex: col.dataIndex,
            editable: col.editable,
            index,
            key: col.key,
            title: col.title,
            id,
          }),
        }
      })

      if (showControl) {
        results.push({
          title: '操作',
          key: 'control',
          width: 110,
          render(_, record, index) {
            return (
              <Space>
                {extra && extra(record, index)}
                {editKey !== index ? (
                  <Button type="link" onClick={() => handleEdit(record, index)}>
                    编辑
                  </Button>
                ) : (
                  <Button type="link" onClick={() => handleSave(record, index)}>
                    保存
                  </Button>
                )}

                {index !== 0 && (
                  <Button type="link" onClick={() => handleRemove(record, index)}>
                    删除
                  </Button>
                )}
              </Space>
            )
          },
        })
      }
      return results
    } else {
      return []
    }
  })

  const handleRemove = (record, index: number) => {
    if (onRemove) {
      onRemove(record, index)
    } else {
      const target = [...value]
      target.splice(index, 1)
      onChange && onChange(target)
    }
  }
  const handleAdd = () => {
    if (onAdd) {
      onAdd()
    } else {
      const target = [...value]
      target.push({})
      onChange && onChange(target)
    }
  }

  const contextValues = {
    onChange,
    value,
    editKey,
    showControl,
    maxLength,
  }

  const handleValueChange = (current, all) => {
    onValueChange && onValueChange(current, all)
  }

  useEffect(() => {
    if (
      (!formInstance.getFieldValue(id!) ||
        (formInstance.getFieldValue(id!) && Object.keys(formInstance.getFieldValue(id!).length === 0))) &&
      value
    ) {
      formInstance.setFieldValue(id!, value)
    }
  }, [value, id, editKey])

  return (
    <FormTableContext.Provider value={contextValues}>
      <Form component={false} form={formInstance} preserve onValuesChange={handleValueChange}>
        <div>
          <Table
            columns={mergeColumns() as any}
            pagination={false}
            className="array-form"
            components={{
              body: {
                cell: customerEditableCell || EditableCell,
              },
            }}
            rowKey={rowKey}
            dataSource={value}
            {...resetProps}
          />
          {showControl && (
            <Button onClick={handleAdd} block style={{ marginTop: 16 }} type="primary" icon={<PlusCircleIcon />}>
              新增
            </Button>
          )}
        </div>
      </Form>
    </FormTableContext.Provider>
  )
})

export default ArrayFormTable
