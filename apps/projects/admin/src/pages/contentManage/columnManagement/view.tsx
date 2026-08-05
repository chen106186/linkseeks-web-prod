import React, { useRef } from 'react'
import { Space, Popconfirm } from 'antd'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { PlusOutlined } from '@ant-design/icons'
import { StatusAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable, EyeAuthButton } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import {
  getManageContentColumnPage,
  postManageContentColumnDelete,
  postManageContentColumnUpdateStatus,
} from '@apps/apis'

const columnList: React.FC = () => {
  const ref = useRef({} as ActionType)

  const fetchData = async (params) => {
    const res = await getManageContentColumnPage(params)
    return res.data
  }

  const handleModify = (value) => {
    const { id, status } = value
    const postData = {
      id: id,
      enableStatus: status ^ 1,
    }
    postManageContentColumnUpdateStatus(postData as any).then((data) => {
      ref.current.reload()
    })
  }

  // 栏目删除
  const handleRemove = (id: number) => {
    postManageContentColumnDelete({ id: id }).then((data) => {
      ref.current.reload()
    })
  }

  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      key: 'id',
      fixed: 'left',
      width: 60,
    },
    {
      title: '栏目名称',
      key: 'name',
      searchField: 'Input',
      fixed: 'left',
      render: (text: string, record: any) => (
        <EyeAuthButton url={`/contentManage/columnManagement/detail?id=${record.id}&preview=1`}>{text}</EyeAuthButton>
      ),
    },
    { title: '栏目分类', key: 'type', render: (text) => (text === 1 ? '市场行情' : '资讯') },
    { title: '栏目排序', key: 'sort' },
    {
      title: '状态',
      key: 'status',
      render: (text, record) => {
        return <StatusAuthButton handleConfirm={() => handleModify(record)} record={record} fieldNames="status" />
      },
    },
    {
      title: '操作',
      key: 'option',
      render: (val, record) => {
        return (
          //  无效 status == 0 可以删除修改该
          <Space>
            {record.status === 0 ? (
              <>
                <AuthButton type="custom" code="edit">
                  <Link to={`/contentManage/columnManagement/detail?id=${record.id}`}>编辑</Link>
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
              history.push(`/contentManage/columnManagement/add`)
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default columnList
