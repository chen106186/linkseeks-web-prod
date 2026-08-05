import React, { useRef } from 'react'
import { Space, Popconfirm } from 'antd'
import { Link } from '@linkseeks/router-core'
import { PlusOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { StatusAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable, EyeAuthButton } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { getManageContentLabelPage, postManageContentLabelDelete, postManageContentLabelUpdateStatus } from '@apps/apis'

const Tags: React.FC = () => {
  const ref = useRef({} as ActionType)

  // 修改状态
  const handleModify = (value) => {
    const { id, status } = value
    const postData = {
      id: id,
      enableStatus: status ^ 1,
    }
    postManageContentLabelUpdateStatus(postData as any).then((data) => {
      ref.current.reload()
    })
  }

  // 栏目删除
  const handleRemove = (id: number) => {
    postManageContentLabelDelete({ id: id }).then(async (data) => {
      ref.current.reload()
    })
  }

  const fetchData = async (params) => {
    const res = await getManageContentLabelPage(params)
    return res.data
  }

  const columns: RecordColumns<any>[] = [
    { title: 'ID', key: 'id', fixed: 'left', width: 60 },
    {
      title: '标签名称',
      key: 'name',
      searchField: 'Input',
      render: (text: string, record: any) => (
        <EyeAuthButton url={`/contentManage/tagsManagement/detail?id=${record.id}&preview=1`}>{text}</EyeAuthButton>
      ),
    },
    { title: '标签说明', key: 'explain' },
    {
      title: '状态',
      key: 'status',
      fixed: 'right',
      render: (text, record) => {
        return <StatusAuthButton handleConfirm={() => handleModify(record)} record={record} fieldNames="status" />
      },
    },
    {
      title: '操作',
      key: 'option',
      render: (val, record) => {
        return (
          <Space>
            {record.status === 0 ? (
              <>
                <AuthButton type="custom" code="edit">
                  <Link to={`/contentManage/tagsManagement/detail?id=${record.id}`}>编辑</Link>
                </AuthButton>
                <AuthButton type="custom" code="delete">
                  <Popconfirm
                    title="确定要执行这个操作？"
                    onConfirm={() => handleRemove(record.id)}
                    okText="是"
                    cancelText="否"
                  >
                    <a>删除</a>
                  </Popconfirm>
                </AuthButton>
              </>
            ) : null}
          </Space>
        )
      },
    },
  ]

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        searchButtons={[
          {
            key: 'add',
            children: '新建',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick() {
              history.push(`/contentManage/tagsManagement/add`)
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default Tags
