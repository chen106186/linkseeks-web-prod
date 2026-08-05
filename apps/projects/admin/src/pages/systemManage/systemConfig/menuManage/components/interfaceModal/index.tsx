import { Row, Col, Tree, Form, Table, InputNumber, Popconfirm, Button, Input, Modal } from '@linkseeks/ui'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { PlusCircleIcon } from '@linkseeks/icons'
import { useMenuContext } from '../../services/context'
import memberService from '../../services/member.service'
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: 'number' | 'text'
  record: any
  index: number
  children: React.ReactNode
}

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
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

const InterfaceModal = () => {
  const [buttonForm] = Form.useForm()
  const { interfaceList, selectButton, setInterfaceList, interfaceToggle, interfaceVisible } = useMenuContext()
  const [data, setData] = useState<any[]>([])
  const [editingKey, setEditingKey] = useState(0)
  const isEditing = (record: any) => record._rowKey === editingKey

  useEffect(() => {
    setData(
      interfaceList.map((v) => {
        v._rowKey = v.id
        return v
      }),
    )
  }, [interfaceList])
  const handleDeleteRow = (key: any) => {
    // 进行过删除操作， 等于修改过表单
    const dataSource = [...data]
    setData(dataSource.filter((item) => item._rowKey !== key))
  }

  const saveCell = async (record: any) => {
    try {
      const rowValue = await buttonForm.validateFields()
      record.isMock && delete record.isMock
      // 进行过保存操作， 等于修改过表单
      const newData = [...data]
      const index = data.findIndex((item) => record._rowKey === item._rowKey)
      if (index > -1) {
        const item = data[index]
        newData.splice(index, 1, {
          ...item,
          ...rowValue,
        })
        setData(newData)
        setEditingKey(-1)
      } else {
        newData.push(rowValue)
        setData(newData)
        setEditingKey(0)
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const cancel = (record) => {
    setData((data) => data.filter((v) => !v.isMock))
    setEditingKey(-1)
  }

  const edit = (record: any) => {
    buttonForm.setFieldsValue({ ...record })
    setEditingKey(record._rowKey || record.id)
  }

  const handleAddButton = () => {
    buttonForm.resetFields()
    // 新增的时候默认无id， 在传入时需要自行mock一份自增id + 1
    let mockId = 0
    if (data.length > 0) {
      mockId = data[data.length - 1].id
        ? Math.max(...data.map((item) => item.id)) + 1
        : Math.max(...data.map((item) => item._rowKey)) + 1
    }
    const newData = {
      _rowKey: mockId,
      isMock: true,
      path: '/',
    }
    setEditingKey(mockId)
    setData((data: any) => [...data, newData])
  }

  const columns = [
    {
      title: '接口路径',
      dataIndex: 'path',
      width: '70%',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <a onClick={() => saveCell(record)} style={{ marginRight: 8 }}>
              保存
            </a>
            <a onClick={() => cancel(record)}>取消</a>
          </span>
        ) : (
          <span>
            <Button type="link" onClick={() => edit(record)} style={{ marginRight: 8 }}>
              编辑
            </Button>
            <Popconfirm
              title="确定要删除?"
              okText="是"
              cancelText="否"
              onConfirm={() => handleDeleteRow(record._rowKey)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  const handleConfirm = async () => {
    await memberService.setInterfaceList(selectButton.id, data)
    setInterfaceList(data)
    interfaceToggle()
  }
  return (
    <Modal
      width={1024}
      title="接口设置"
      open={interfaceVisible}
      closable
      onCancel={() => interfaceToggle(false)}
      onOk={handleConfirm}
    >
      <div>
        <Form form={buttonForm}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            rowKey={(record, index) => index + 'key'}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={false}
          />
        </Form>
        <Button onClick={handleAddButton} style={{ marginTop: 24 }} block type="primary">
          新增接口
        </Button>
      </div>
    </Modal>
  )
}

export default InterfaceModal
