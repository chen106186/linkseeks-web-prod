import React, { useRef } from 'react'
import { Space, Popconfirm } from 'antd'
import { Link } from '@linkseeks/router-core'
import { PlusOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { SCENE, POSITION } from '../utils/utils'
import { StatusAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable, EyeAuthButton } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { getManageContentImagePage, postManageContentImageDelete, postManageContentImageUpdateStatus } from '@apps/apis'

const ImagesManagement: React.FC = () => {
  const ref = useRef({} as ActionType)

  const fetchData = async (params: any) => {
    const res = await getManageContentImagePage(params)
    return res.data
  }

  // 修改状态
  const handleUpdateStatus = (id, status) => {
    const postData = { id: id, enableStatus: status, shelfStatus: 0 }
    postManageContentImageUpdateStatus(postData).then(() => {
      ref.current.reload()
    })
  }

  const handleDelete = (id) => {
    postManageContentImageDelete({ id: id }).then(() => {
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
      title: '图片名称',
      key: 'name',
      searchField: 'Input',
      render: (text: string, record: any) => (
        <EyeAuthButton url={`/contentManage/imagesManagement/detail?id=${record.id}&preview=1`}>{text}</EyeAuthButton>
      ),
    },
    {
      title: '使用场景',
      key: 'useScene',
      render: (text) => {
        return <div>{SCENE[text]}</div>
      },
    },
    {
      title: '所在位置',
      key: 'position',
      render: (text) => {
        return <div>{POSITION[text]}</div>
      },
    },
    {
      title: '状态',
      key: 'status',
      fixed: 'right',
      render: (text, record) => {
        return (
          <StatusAuthButton
            customStyle={{ paddingLeft: 0 }}
            handleConfirm={() => handleUpdateStatus(record.id, record.status ^ 1)}
            record={record}
            fieldNames="status"
          />
        )
      },
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (val, record) => {
        return (
          <Space>
            {/* // 只有 无效 才有 修改和删除 */}
            {record.status == 0 ? (
              <>
                <AuthButton type="custom" code="edit">
                  <Link to={`/contentManage/imagesManagement/detail?id=${record.id}`}>编辑</Link>
                </AuthButton>
                <AuthButton type="custom" code="delete">
                  <Popconfirm
                    title="确定要执行这个操作吗"
                    onConfirm={() => handleDelete(record.id)}
                    okText="是"
                    cancelText="否"
                  >
                    <a href="#">删除</a>
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
              history.push(`/contentManage/imagesManagement/add`)
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default ImagesManagement
