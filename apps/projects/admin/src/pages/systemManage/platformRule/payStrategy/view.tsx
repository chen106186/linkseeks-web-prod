import React, { useRef, Fragment } from 'react'
import { Button, Popconfirm } from 'antd'
import { history } from '@linkseeks/router-manager'
import { EyeAuthButton } from '@apps/components'
import { StatusAuthButton, EditAuthButton, AuthButton, StandardFormTable, PageHeaderWrapper } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { PlusOutlined } from '@ant-design/icons'
import { getOrderPlatformPaymentPage, postOrderPlatformPaymentDelete, postOrderPlatformPaymentStatus } from '@apps/apis'

const List: React.FC = () => {
  const ref = useRef({} as ActionType)
  const handleModify = async (record: any) => {
    await postOrderPlatformPaymentStatus({
      paymentId: record.paymentId,
      status: record.status === 1 ? 0 : 1,
    })
    ref.current.reload()
  }
  //删除
  const handleDelete = async (paymentId) => {
    await postOrderPlatformPaymentDelete({ paymentId })
    ref.current.reload()
  }
  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'paymentId',
      key: 'paymentId',
      fixed: 'left',
    },
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      searchField: 'Input',
      render: (text: any, record: any) => (
        <EyeAuthButton url={`/systemManage/platformRule/payStrategy/detail?paymentId=${record.paymentId}`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      fixed: 'right',
      render: (text: any, record: any) => (
        <StatusAuthButton
          fieldNames="status"
          handleConfirm={() => handleModify(record)}
          record={record}
          customStyle={{ paddingLeft: 0 }}
        />
      ),
    },
    {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      fixed: 'right',
      render: (_, record) =>
        !record.status && (
          <Fragment>
            <EditAuthButton>
              <Button
                type="link"
                onClick={() =>
                  history.push(`/systemManage/platformRule/payStrategy/edit?paymentId=${record.paymentId}`)
                }
              >
                编辑
              </Button>
            </EditAuthButton>
            <AuthButton type="custom" code="delete">
              <Popconfirm title="确定要执行这个操作?" onConfirm={() => handleDelete(record.paymentId)}>
                <Button type="link">删除</Button>
              </Popconfirm>
            </AuthButton>
          </Fragment>
        ),
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getOrderPlatformPaymentPage({ ...params }).then((res) => {
        resolve(res.data)
      })
    })
  }
  return (
    <PageHeaderWrapper>
      <StandardFormTable
        actionRef={ref}
        columns={columns}
        rowKey="paymentId"
        request={fetchData}
        autoScrollX
        searchButtons={[
          {
            key: 'add',
            type: 'primary',
            icon: <PlusOutlined />,
            children: '新建',
            onClick() {
              history.push('/systemManage/platformRule/payStrategy/add')
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}
export default List
