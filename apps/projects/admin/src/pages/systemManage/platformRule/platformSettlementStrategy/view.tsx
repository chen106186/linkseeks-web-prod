/**
 * @author Bill
 * @description 平台结算策略
 */

import React, { useRef } from 'react'
import { Button, Space, Popconfirm } from 'antd'
import { EyeAuthButton, EditAuthButton, AuthButton, StandardFormTable, PageHeaderWrapper } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { StatusAuthButton } from '@apps/components'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import {
  getSettlementPlatformConfigPagePlatformSettlementStrategy,
  postSettlementPlatformConfigDeletePlatformSettlementStrategy,
  postSettlementPlatformConfigSetPlatformSettlementStrategyStatus,
} from '@apps/apis'

const MemberSettle: React.FC = () => {
  const ref = useRef({} as ActionType)

  const fetchData = async (params: any) => {
    const { data } = await getSettlementPlatformConfigPagePlatformSettlementStrategy(params)
    return data
  }

  const handleModify = async (record) => {
    const { code } = await postSettlementPlatformConfigSetPlatformSettlementStrategyStatus({
      id: record.id,
      status: record.status ? 0 : 1,
    })
    if (code == 1000) {
      ref.current.reload()
    }
  }

  const handleRemove = (params) => {
    postSettlementPlatformConfigDeletePlatformSettlementStrategy(params).then(({ data, code }) => {
      if (code === 1000) {
        ref.current.reload()
      }
    })
  }

  const columns: RecordColumns<any>[] = [
    { title: 'ID', key: 'id', fixed: 'left' },
    {
      title: '策略名称',
      key: 'name',
      fixed: 'left',
      searchField: 'Input',
      render: (text, record) => {
        return (
          <div>
            <EyeAuthButton
              url={`/systemManage/platformRule/platformSettlementStrategy/detail?id=${record.id}&preview=1`}
            >
              {text}
            </EyeAuthButton>
          </div>
        )
      },
    },
    { title: '结算方式', key: 'settlementWayName' },
    { title: '结算单据', key: 'settlementOrderTypeName' },
    {
      title: '状态',
      key: 'status',
      fixed: 'right',
      render: (text, record) => {
        return (
          <StatusAuthButton
            handleConfirm={() => handleModify(record)}
            record={record}
            fieldNames="status"
            customStyle={{ paddingLeft: 0 }}
          />
        )
      },
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (text, record) => {
        if (record.status == 1) {
          return null
        }
        return (
          <Space>
            <EditAuthButton>
              <Link to={`/systemManage/platformRule/platformSettlementStrategy/edit?id=${record.id}`}>修改</Link>
            </EditAuthButton>
            <AuthButton type="custom" code="delete">
              <Popconfirm
                title="确定删除?"
                onConfirm={() => handleRemove({ id: record.id })}
                okText="是"
                cancelText="否"
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            </AuthButton>
          </Space>
        )
      },
    },
  ]

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        actionRef={ref}
        columns={columns}
        rowKey="id"
        request={fetchData}
        autoScrollX
        searchButtons={[
          {
            key: 'add',
            type: 'primary',
            icon: <PlusOutlined />,
            children: '新建',
            onClick() {
              history.push('/systemManage/platformRule/platformSettlementStrategy/add')
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default MemberSettle
