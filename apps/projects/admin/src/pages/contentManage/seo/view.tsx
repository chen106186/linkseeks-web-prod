import React, { useRef } from 'react'
import type { ReactNode } from 'react'
import { EditAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { history } from '@linkseeks/router-manager'
import { Button, Popconfirm, Typography } from 'antd'
import { PauseCircleOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { getManageSeoPage, postManageSeoDelete, postManageSeoUpdateStatus } from '@apps/apis'

const ShopSeo: React.FC = () => {
  const ref = useRef({} as ActionType)
  /** 修改状态 */
  const confirm = (e: any) => {
    const enableStatus = e.status === 1 ? 0 : 1
    postManageSeoUpdateStatus({ id: e.id, enableStatus }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      ref.current.reload()
    })
  }
  /** 删除 */
  const handleDelete = (id: number) => {
    postManageSeoDelete({ id }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      ref.current.reload()
    })
  }

  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      fixed: 'left',
      width: 60,
    },
    {
      title: '页面名称',
      key: 'name',
      dataIndex: 'name',
      searchField: 'Input',
      fixed: 'left',
      render: (text: any, record: any) => (
        <Typography.Link href={`/contentManage/seo/detail?id=${record.id}`}>{text}</Typography.Link>
      ),
    },
    {
      title: '访问链接',
      key: 'link',
      dataIndex: 'link',
      render: (text: any) => `http://${text}`,
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      fixed: 'right',
      render: (text: any, record: any) => {
        let component: ReactNode = null
        component = (
          <AuthButton type="custom" code="status">
            <Popconfirm title="确定要执行这个操作?" onConfirm={() => confirm(record)} okText="是" cancelText="否">
              <Button type="link" style={record.status === 1 ? { color: '#00A98F' } : { color: 'red' }}>
                {record.status === 1 ? (
                  <>
                    有效 <PlayCircleOutlined />
                  </>
                ) : (
                  <>
                    无效 <PauseCircleOutlined />
                  </>
                )}
              </Button>
            </Popconfirm>
          </AuthButton>
        )
        return component
      },
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      fixed: 'right',
      render: (_text: any, record: any) => (
        <>
          <AuthButton type="custom" code="delete">
            <Popconfirm
              title="确定要执行这个操作?"
              onConfirm={() => handleDelete(record.id)}
              disabled={record.status === 1}
              okText="是"
              cancelText="否"
            >
              <Button disabled={record.status === 1} type="link">
                删除
              </Button>
            </Popconfirm>
          </AuthButton>
          <EditAuthButton>
            <Button
              disabled={record.status === 1}
              type="link"
              onClick={() => history.push(`/contentManage/seo/edit?id=${record.id}`)}
            >
              修改
            </Button>
          </EditAuthButton>
        </>
      ),
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getManageSeoPage({ ...params }).then((res) => {
        resolve(res.data)
      })
    })
  }

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
              history.push(`/contentManage/seo/add`)
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}
export default ShopSeo
