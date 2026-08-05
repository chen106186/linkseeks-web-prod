import React, { useRef } from 'react'
import { Button, Popconfirm, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { EditAuthButton, AuthButton, StandardFormTable, PageHeaderWrapper } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { getManageSensitiveWordPage, postManageSensitiveWordDelete } from '@apps/apis'

const SensitiveWords: React.FC = () => {
  const ref = useRef({} as ActionType)
  // 删除
  const confirmCancel = (ids: number[], type: boolean) => {
    if (ids.length > 0) {
      postManageSensitiveWordDelete({ ids }).then((res) => {
        message.destroy()
        if (res.code === 1000) {
          if (type) {
            message.success('批量删除成功')
          } else {
            message.success('删除成功')
          }
          ref.current.reload()
        }
      })
    } else {
      message.error('请选择要操作的数据')
    }
  }
  const columns: RecordColumns<any>[] = [
    {
      title: '敏感词编码',
      key: 'batchNo',
      dataIndex: 'batchNo',
    },
    {
      title: '敏感词名称',
      key: 'name',
      dataIndex: 'name',
      searchField: 'Input',
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      key: 'options',
      dataIndex: 'options',
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <>
            <EditAuthButton>
              <Button
                style={{ paddingLeft: 0 }}
                type="link"
                href={`/systemManage/basicBusinessManage/sensitiveWords/edit?id=${record.id}&name=${btoa(
                  encodeURIComponent(record.name),
                )}&remark=${btoa(encodeURIComponent(record.remark))}`}
              >
                修改
              </Button>
            </EditAuthButton>
            <AuthButton type="custom" code="delete">
              <Popconfirm
                onConfirm={() => confirmCancel([record.id], false)}
                title="确定要执行这个操作?"
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" style={{ paddingLeft: 0 }}>
                  删除
                </Button>
              </Popconfirm>
            </AuthButton>
          </>
        )
      },
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getManageSensitiveWordPage({ ...params }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        actionRef={ref}
        columns={columns}
        rowKey="id"
        request={fetchData}
        autoScrollX
        isRowSelection
        searchButtons={[
          {
            key: 'add',
            type: 'primary',
            icon: <PlusOutlined />,
            children: '新建',
            onClick() {
              history.push(`/systemManage/basicBusinessManage/sensitiveWords/add`)
            },
          },
          {
            key: 'deleteBatch',
            children: '批量删除',
            onClick() {
              confirmCancel(ref.current?.selectionKeys, true)
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}
export default SensitiveWords
