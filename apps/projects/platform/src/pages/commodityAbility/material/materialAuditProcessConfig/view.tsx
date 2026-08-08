import React, { useEffect, useRef } from 'react'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { querySchema } from './schemas/query'
import { Button, Card, Popconfirm, Space, Switch } from 'antd'
import { createFormActions } from '@apps/formily'
import {
  getProductMaterialProcessDelete,
  getProductMaterialProcessPage,
  GetProductMaterialProcessPageResponseDetail,
  postProductMaterialProcessUpdateStatus,
} from '@apps/apis'
import { Link, useLocation } from '@linkseeks/router-core'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'

/**
 * 物料审核流程规则配置
 */
const formActions = createFormActions()

const MaterialAuditProcessConfig: React.FC<{}> = (props) => {
  const { pathname } = useLocation()

  const ref = useRef<any>({})
  const translate = useWebIntl()
  const handleEnableOrDisable = async (_row: GetProductMaterialProcessPageResponseDetail) => {
    const { code } = await postProductMaterialProcessUpdateStatus({
      processId: _row.processId,
      status: _row.status ? 0 : 1,
    })

    if (code === 1000) {
      formActions.submit()
    }
  }

  const handleDelete = async (_row: GetProductMaterialProcessPageResponseDetail) => {
    const { code } = await getProductMaterialProcessDelete({
      processId: `${_row.processId}`,
    })
    if (code === 1000) {
      formActions.submit()
    }
  }

  const columns = [
    {
      title: translate('web.resource.commodity.liuchengguizeID'),
      dataIndex: 'processId',
      render: (text, record) => {
        return <Link to={`${pathname}/detail?id=${record.processId}`}>{record.processId}</Link>
      },
    },
    {
      title: translate('web.resource.commodity.liuchengguizeName'),
      dataIndex: 'name',
    },
    {
      title: translate('web.common.status'),
      dataIndex: 'status',
      render: (text, record) => {
        return <Switch checked={!!text} onChange={() => handleEnableOrDisable(record)} />
      },
    },
    {
      title: translate('web.common.controlTime'),
      dataIndex: 'createTime',
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'actions',
      render: (text, record) => {
        if (record.status === 1) {
          return null
        }
        return (
          <Space>
            <EditAuthButton>
              <Link to={`${pathname}/edit?id=${record.processId}`}>{translate('web.common.change')}</Link>
            </EditAuthButton>

            {record.status !== 1 && (
              <AuthButton type="custom" code="remove">
                <Popconfirm
                  title={translate('web.common.confirmDelete')}
                  onConfirm={() => handleDelete(record)}
                  okText={translate('web.common.shi')}
                  cancelText={translate('web.common.fou')}
                >
                  <a>{translate('web.common.delete')}</a>
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
          <Link to={`${pathname}/add`}>
            <Button type="primary">{translate('web.common.add')}</Button>
          </Link>
        </AddAuthButton>
      </Space>
    )
  }

  const handleSearch = (values: { name: string }) => {
    ref.current.reload(values)
  }

  const fetchListData = async (params) => {
    const { code, data } = await getProductMaterialProcessPage(params)
    if (code === 1000) {
      return data
    }

    return {
      totalCount: 0,
      data: [],
    }
  }

  return (
    <PageHeaderWrapper title={translate('web.resource.commodity.wuliaoshenheliuchengguizepeizhi')}>
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

export default MaterialAuditProcessConfig
