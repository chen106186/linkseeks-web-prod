import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, Popconfirm, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  EyeAuthButton,
  StatusAuthButton,
  AuthButton,
  EditAuthButton,
  PageHeaderWrapper,
  StandardFormTable,
} from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import {
  getProductPlatformGetAttributeList,
  postProductPlatformDeleteAttribute,
  postProductPlatformUpdateAttributeStatus,
} from '@apps/apis'

const Attribute: React.FC = () => {
  const ref = useRef({} as ActionType)

  const confirm = (record: any) => {
    postProductPlatformUpdateAttributeStatus({ id: record.id, isEnable: !record.isEnable }).then((res) => {
      if (res.code === 43018) {
        message.error(res.message)
      } else {
        ref.current.reload()
      }
    })
  }

  const clickDelete = (record: any) => {
    postProductPlatformDeleteAttribute({ id: record.id }).then(() => {
      ref.current.reload()
    })
  }

  const handleEdit = (record: any) => {
    history.push(`/productManage/classAndProperty/attribute/edit?id=${record.id}`)
  }

  const cancel = () => {
    console.log('cancel')
  }

  const fetchData = (params?: any) => {
    return new Promise((resolve) => {
      getProductPlatformGetAttributeList({ ...params, name: params.name || '' }).then((res) => {
        resolve(res.data)
      })
    })
  }

  const defaultColumns = StandardFormTable.createColumns([
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '属性名称',
      dataIndex: 'name',
      key: 'name',
      searchField: 'Input',
      render: (text: any, record: any) => (
        <EyeAuthButton url={`/productManage/classAndProperty/attribute/detail?id=${record.id}&preview=1`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: '属性组名',
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: '是否规格属性',
      dataIndex: 'isPrice',
      key: 'isPrice',
      searchField: {
        type: 'Select',
        placeholder: '属性类型',
        name: 'isSkuAttribute',
        valueEnum: [
          {
            label: '类目属性',
            value: false,
          },
          {
            label: '规格属性',
            value: true,
          },
        ],
      },
      render: (text) => (text ? '是' : '否'),
    },
    {
      title: '展示方式',
      dataIndex: 'type',
      key: 'type',
      render: (text: number) => {
        const txt = new Map([
          [1, '单选'],
          [2, '多选'],
          [3, '输入'],
        ])
        return txt.get(text)
      },
    },
    {
      title: '是否必填',
      dataIndex: 'isMust',
      key: 'isMust',
      render: (text: any) => (text ? '是' : '否'),
    },
    {
      title: '状态',
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (text: any, record: any) => (
        <StatusAuthButton
          customStyle={{ paddingLeft: 0 }}
          handleConfirm={() => confirm(record)}
          record={record}
          fieldNames="isEnable"
          expectTrueValue={true}
        />
      ),
    },
    {
      title: '操作',
      key: 'option',
      render: (text: any, record: any) => (
        <>
          <EditAuthButton>
            <Button type="link" onClick={() => handleEdit(record)}>
              编辑
            </Button>
          </EditAuthButton>
          {!record.isEnable && (
            <AuthButton type="custom" code="delete">
              <Popconfirm
                title="确定要执行这个操作?"
                onConfirm={() => clickDelete(record)}
                onCancel={cancel}
                okText="是"
                cancelText="否"
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            </AuthButton>
          )}
        </>
      ),
    },
  ])

  return (
    <PageHeaderWrapper backDom={false}>
      <StandardFormTable
        columns={defaultColumns}
        autoScrollX
        request={(params) => fetchData(params)}
        searchButtons={[
          {
            key: 'add',
            children: '新建',
            onClick() {
              history.push('/productManage/classAndProperty/attribute/add')
            },
            type: 'primary',
            icon: <PlusOutlined />,
          },
        ]}
        rowKey="id"
        actionRef={ref}
      />
    </PageHeaderWrapper>
  )
}

export default Attribute
