import React, { useEffect, useRef } from 'react'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { querySchema } from './schemas/query'
import { Button, Card, Popconfirm, Space, Switch } from 'antd'
import { createFormActions } from '@apps/formily'
import { Link } from '@linkseeks/router-core'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import {
  getContractCoordinationProcessDelete,
  GetContractCoordinationProcessDeleteRequest,
  getContractCoordinationProcessPage,
  GetContractCoordinationProcessPageRequest,
  postContractCoordinationProcessStatusUpdate,
  PostContractCoordinationProcessStatusUpdateRequest,
} from '@apps/apis'

/**
 * 合同协同审核流程规则
 */
const formActions = createFormActions()
const CREATE_URL = '/systemAbility/processManagement/contractTogetherRules/add'

const ContractTogetherRules = () => {
  const ref = useRef<any>({})

  const handleEnableOrDisable = async (_row: PostContractCoordinationProcessStatusUpdateRequest) => {
    const { code } = await postContractCoordinationProcessStatusUpdate({
      processId: _row.processId,
      status: _row.status ? 0 : 1,
    })

    if (code === 1000) {
      formActions.submit()
    }
  }

  const handleDelete = async (_row: GetContractCoordinationProcessDeleteRequest) => {
    const { code } = await getContractCoordinationProcessDelete({
      processId: `${_row.processId}`,
    })
    if (code === 1000) {
      formActions.submit()
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'processId',
    },
    {
      title: '流程规则名称',
      dataIndex: 'processName',
      render: (text, record) => {
        return (
          <Link to={`/systemAbility/processManagement/contractTogetherRules/detail?id=${record.processId}`}>
            {record.processName}
          </Link>
        )
      },
    },
    {
      title: '合同协同流程名称',
      dataIndex: 'name',
      // render: (text, record) => {
      //   return (
      //     <Link to={`/systemAbility/processManagement/contractTogetherRules/detail?id=${record.processId}`}>
      //       {record.name}
      //     </Link>
      //   )
      // }
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        return <Switch checked={!!text} onChange={() => handleEnableOrDisable(record)} />
      },
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: (text, record) => {
        if (record.status === 1) {
          return null
        }
        return (
          <Space>
            <EditAuthButton>
              <Link to={`/systemAbility/processManagement/contractTogetherRules/edit?id=${record.processId}`}>
                修改
              </Link>
            </EditAuthButton>

            {record.status !== 1 && (
              <AuthButton type="custom" code="delete">
                <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record)} okText="是" cancelText="否">
                  <a>删除</a>
                </Popconfirm>
              </AuthButton>
            )}
          </Space>
        )
      },
    },
  ]

  const controllerBtns = () => {
    return (
      <Space>
        <AddAuthButton>
          <Link to={CREATE_URL}>
            <Button type="primary">新增</Button>
          </Link>
        </AddAuthButton>
      </Space>
    )
  }

  const handleSearch = (values: { name: string }) => {
    ref.current.reload(values)
  }

  const fetchListData = async (params) => {
    const { code, data } = await getContractCoordinationProcessPage(params)
    if (code === 1000) {
      return data
    }

    return {
      totalCount: 0,
      data: [],
    }
  }

  return (
    <PageHeaderWrapper title={'合同协同流程规则'}>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'processId',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={fetchListData}
          controlRender={
            <NiceForm
              components={{ controllerBtns }}
              schema={querySchema}
              actions={formActions}
              onSubmit={handleSearch}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              }}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default ContractTogetherRules
