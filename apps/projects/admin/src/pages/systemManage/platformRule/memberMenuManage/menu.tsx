import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Table, InputNumber, Popconfirm, Button, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import TabTree, { createTreeActions } from '@/components/TabTree'
import { createFormActions, LifeCycleTypes } from '@apps/formily'
import { menuSchema } from './schema'
import { omit } from '@/utils'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import NiceForm from '@/components/NiceForm'
import {
  getMemberPlatformMenuFind,
  getMemberPlatformMenuTree,
  postMemberPlatformMenuAdd,
  postMemberPlatformMenuDelete,
  postMemberPlatformMenuUpdate,
} from '@apps/apis'
import { validatorByte } from '@/utils/regExp'

const { ON_FORM_INPUT_CHANGE } = LifeCycleTypes

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: 'number' | 'text'
  record: any
  index: number
  children: React.ReactNode
}

const treeActions = createTreeActions()
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
  const isRequired = dataIndex !== 'remark' ? true : false
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: isRequired,
              message: `请输入${title}!`,
            },
            {
              validator: (rule, value, callback) =>
                validatorByte(rule, value, callback, dataIndex !== 'remark' ? 20 : 100),
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

enum FormState {
  FREE, // 空闲状态
  EDIT, // 编辑状态
  ADD, // 新增状态
}

const formActions = createFormActions()

const addRowKey = (arr: any[]) => {
  if (!Array.isArray(arr)) {
    return []
  }
  return arr.map((v) => {
    if (v.buttonId) {
      v._rowKey = v.buttonId
    }
    return v
  })
}

const fetchMenuDataDetail = async ({ id }) => {
  const result: any = await getMemberPlatformMenuFind({ menuId: id })
  result.data.attrs = JSON.stringify(result.data.attrs)
  return result
}

const MemberMenu: React.FC<{ source: string }> = (props) => {
  const { source } = props
  const fetchMenuData = async (params?) => {
    const res = await getMemberPlatformMenuTree({
      source,
    })
    return res
  }
  const {
    treeStatus,
    setTreeStatus,
    treeData,
    setIsEditForm,
    nodeRecord,
    setNodeRecord,
    handleSelect,
    getTreeMaps,
    resetMenu,
    handleDeleteMenu,
    toolsRender,
  } = useTreeTabs({
    treeActions,
    deleteMenu: postMemberPlatformMenuDelete,
    fetchMenuData: fetchMenuData,
    fetchItemDetailData: fetchMenuDataDetail,
    customKey: 'menuId',
  })

  const formInitValue = nodeRecord && treeStatus === FormState.EDIT ? getTreeMaps(nodeRecord.key) : {}

  useEffect(() => {
    if (treeStatus === FormState.ADD) {
      setData([])
    }
  }, [treeStatus])

  useEffect(() => {
    formInitValue && setData(addRowKey(formInitValue.buttons))
  }, [getTreeMaps])

  // button操作
  const [buttonForm] = Form.useForm()
  const [data, setData] = useState<any[]>([])
  const [editingKey, setEditingKey] = useState(0)
  const isEditing = (record: any) => record._rowKey === editingKey

  const edit = (record: any) => {
    // 进行过修改操作， 等于修改过表单
    setIsEditForm(true)
    buttonForm.setFieldsValue({ ...record })
    setEditingKey(record._rowKey)
  }

  const handleDeleteRow = (key: any) => {
    // 进行过删除操作， 等于修改过表单
    setIsEditForm(true)
    const dataSource = [...data]
    setData(dataSource.filter((item) => item._rowKey !== key))
  }

  const cancel = (record) => {
    setEditingKey(0)
    // const newData = data.filter(v => v._rowKey !== record._rowKey)
    // setData([...newData])
  }

  // 保存表格某一行
  const saveCell = async (record: any) => {
    try {
      const rowValue = await buttonForm.validateFields()
      // 进行过保存操作， 等于修改过表单
      setIsEditForm(true)
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

  const handleSubmitAllSetting = () => {
    formActions.submit()
  }

  const columns = [
    {
      title: '按钮标识',
      dataIndex: 'code',
      width: '20%',
      editable: true,
    },
    {
      title: '按钮名称',
      dataIndex: 'name',
      width: '28%',
      editable: true,
    },
    {
      title: '按钮说明',
      dataIndex: 'remark',
      width: '32%',
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
            <Popconfirm title="确定取消?" okText="是" cancelText="否" onConfirm={() => cancel(record)}>
              <a>取消</a>
            </Popconfirm>
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

  const handleAddButton = () => {
    // 新增的时候默认无id， 在传入时需要自行mock一份自增id + 1
    let mockId = 0
    if (data.length > 0) {
      console.log(data, 'data')
      mockId = data[data.length - 1].id ? data[data.length - 1].id + 1 : data[data.length - 1]._rowKey + 1
    }
    const newData = {
      _rowKey: mockId,
      // buttonUrl: '/',
      code: 'default',
      name: 'default',
      remark: 'default',
    }
    setEditingKey(mockId)
    setData((data: any) => [...data, newData])
  }

  // 保存设置提交
  const handleSubmit = (value) => {
    value.up = value.up ? 1 : 0
    value.dataAuthConfig = value.dataAuthConfig ? 1 : 0
    // 去掉模拟的key

    const code = formActions.getFieldValue('url')
    const buttons = data ? data.map((v) => omit(v, ['_rowKey'])) : []
    buttons.map((item: any) => {
      item.buttonUrl = code
    })
    try {
      value.attrs = JSON.parse(value.attrs)
    } catch (error) {}
    const editOrAdd = nodeRecord && treeStatus === FormState.EDIT
    const params = editOrAdd
      ? { ...value, menuId: nodeRecord.menuId, buttons, source }
      : {
          ...value,
          parentId: nodeRecord ? nodeRecord.parentId : 0,
          buttons,
          source,
        }
    console.log(buttons)
    console.log(params)
    // return;
    const fn = editOrAdd ? postMemberPlatformMenuUpdate : postMemberPlatformMenuAdd
    fn(params).then(({ code }) => {
      if (code === 1000) {
        resetMenu()
        setTreeStatus(FormState.FREE)
        setNodeRecord(undefined)
        // 保存后要将是否填写过表单设为false
        setIsEditForm(false)
        setData([])
      }
    })
  }

  return (
    <div className="common-wrapper">
      <Row gutter={[36, 36]}>
        <Col span={8}>
          <div className="common-panel-title mb-30">选择要编辑的菜单项</div>
          {treeData && treeData.length > 0 ? (
            <TabTree
              fetchData={(params) => fetchMenuData(params)}
              treeData={treeData}
              actions={treeActions}
              toolsRender={toolsRender}
              handleSelect={(key, node) => handleSelect(key, node)}
              customKey="menuId"
            />
          ) : (
            <Button block type="primary" onClick={() => handleSelect()}>
              暂无菜单, 开始新增
            </Button>
          )}
        </Col>
        <Col span={16}>
          {treeStatus !== FormState.FREE && (
            <>
              <div className="common-panel-title mb-30">{treeStatus === FormState.ADD ? '新增' : '编辑'}</div>
              <NiceForm
                schema={menuSchema}
                value={formInitValue}
                actions={formActions}
                effects={($) => {
                  console.log($)
                  $(ON_FORM_INPUT_CHANGE).subscribe(() => {
                    setIsEditForm(true)
                  })
                  $('onFormReset').subscribe(() => {
                    console.log('mount')
                  })
                  // useAsyncSelect('code', fetchMenuCode, res => res.map(v => ({
                  //   label: v.code + ' && ' + v.remark,
                  //   value: v.code
                  // })))
                }}
                onSubmit={handleSubmit}
              ></NiceForm>
              <div className="common-panel-title mb-30">按钮权限设置</div>
              <Form form={buttonForm}>
                <Table
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  rowKey={(record, index) => {
                    return record.buttonUrl + record.buttonName + index
                  }}
                  bordered
                  dataSource={data}
                  columns={mergedColumns}
                  rowClassName="editable-row"
                  pagination={false}
                  // pagination={{
                  //   onChange: cancel,
                  // }}
                />
              </Form>
              <Button onClick={handleAddButton} style={{ width: '100%', marginTop: 24, backgroundColor: '#fafbfc' }}>
                <PlusOutlined /> 新增接口
              </Button>
              <Button
                onClick={handleSubmitAllSetting}
                type="primary"
                style={{ marginTop: 32, marginBottom: 16, marginRight: 24 }}
              >
                保存设置
              </Button>
              <Popconfirm title="确定要删除吗？" okText="是" cancelText="否" onConfirm={handleDeleteMenu}>
                <Button style={{ marginTop: 32, marginBottom: 16 }}>删除菜单</Button>
              </Popconfirm>
            </>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default MemberMenu
