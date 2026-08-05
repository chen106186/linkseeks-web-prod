import React, { useRef } from 'react'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { Button, message, Popconfirm } from 'antd'
import { StatusAuthButton, EditAuthButton, AuthButton, StandardFormTable, PageHeaderWrapper } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { PlusOutlined } from '@ant-design/icons'
import {
  getOrderPlatformPaymentMemberParameterPage,
  postOrderPlatformPaymentMemberParameterDelete,
  postOrderPlatformPaymentMemberParameterStatus,
} from '@apps/apis'

const MerchantPayTypeLayout: React.FC = () => {
  const ref = useRef({} as ActionType)
  const handleChangeStatus = (record) => {
    const param = {
      status: record.status === 1 ? 0 : 1,
      paymentId: record.paymentId,
    }
    postOrderPlatformPaymentMemberParameterStatus(param).then((res) => {
      if (res.code !== 1000) {
        message.error(res.message)
        return
      }
      ref.current.reload()
    })
  }

  const handleDelete = (record) => {
    const param = {
      paymentId: record.paymentId,
    }
    postOrderPlatformPaymentMemberParameterDelete(param).then((res) => {
      if (res.code !== 1000) {
        message.error(res.message)
        return
      }
      ref.current.reload()
    })
  }

  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      key: 'paymentId',
      dataIndex: 'paymentId',
      fixed: 'left',
    },
    {
      title: '会员名称',
      key: 'name',
      dataIndex: 'name',
      searchField: 'Input',
      fixed: 'left',
      render: (text, record) => (
        <Link
          to={{
            pathname: '/systemManage/platformRule/merchantPayType/detail',
          }}
          state={{
            record,
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: '会员类型',
      key: 'memberTypeName',
      dataIndex: 'memberTypeName',
    },
    {
      title: '会员角色',
      key: 'roleName',
      dataIndex: 'roleName',
    },
    {
      title: '会员等级',
      key: 'levelTag',
      dataIndex: 'levelTag',
      // render: (_text, record: any) => <LevelBrand level={record.level} />
    },
    {
      title: '资金归集模式',
      key: 'fundModeName',
      dataIndex: 'fundModeName',
    },
    {
      title: '支付方式',
      key: 'payTypeName',
      dataIndex: 'payTypeName',
    },
    {
      title: '支付渠道',
      key: 'payChannelName',
      dataIndex: 'payChannelName',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      fixed: 'right',
      render: (text: any, record: any) => (
        <StatusAuthButton
          fieldNames="status"
          handleConfirm={() => handleChangeStatus(record)}
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
      render: (text: any, record: any) => (
        <>
          {record.status !== 1 && (
            <>
              <AuthButton type="custom" code="delete">
                <Popconfirm title="确定要删除吗？" okText="是" cancelText="否" onConfirm={() => handleDelete(record)}>
                  <Button style={{ paddingLeft: 0 }} type="link">
                    删除
                  </Button>
                </Popconfirm>
              </AuthButton>
              <EditAuthButton>
                <Link
                  to={{
                    pathname: '/systemManage/platformRule/merchantPayType/edit',
                  }}
                  state={{
                    record,
                  }}
                >
                  编辑
                </Link>
              </EditAuthButton>
            </>
          )}
        </>
      ),
    },
  ]

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        actionRef={ref}
        columns={columns}
        rowKey="paymentId"
        request={getOrderPlatformPaymentMemberParameterPage}
        autoScrollX
        searchButtons={[
          {
            key: 'add',
            type: 'primary',
            icon: <PlusOutlined />,
            children: '新增',
            onClick() {
              history.push('/systemManage/platformRule/merchantPayType/add')
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}
export default MerchantPayTypeLayout
