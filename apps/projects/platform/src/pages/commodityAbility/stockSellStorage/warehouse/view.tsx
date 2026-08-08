import React, { useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card, Space, Popconfirm } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { PlusOutlined } from '@ant-design/icons'
import { getProductWarehouseList, postProductWarehouseStartOrStop, getProductWarehouseDelete } from '@apps/apis'
import { EyeAuthButton } from '@apps/components'
import { StatusAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { POSITION_STATUS_EFFECTIVE, POSITION_STATUS_INVALID } from '@/constants/commodity'
import { searchSchema } from './schema'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const formActions = createFormActions()

const WareHouse: React.FC<{}> = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { pathname } = useLocation()

  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      // align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.cangkumingcheng' }),
      dataIndex: 'name',
      // align: 'center',
      render: (text: any, record: any) => {
        return (
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            url={`/commodityAbility/stockSellStorage/warehouse/detail?id=${record.id}`}
          >
            {text}
          </EyeAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.cangkudizhi' }),
      dataIndex: 'address',
      // align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.cangkufuzhairen' }),
      dataIndex: 'principal',
      // align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.lianxidianhua' }),
      dataIndex: 'tel',
      // align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.zhuangtai' }),
      dataIndex: 'state',
      // align: 'center',
      sorter: (a, b) => a.state - b.state,
      render: (text: any, record: any) => {
        return (
          <AuthButton type="custom" code="state">
            <StatusAuthButton fieldNames="state" handleConfirm={() => handleModify(record)} record={record} />
          </AuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.caozuo' }),
      dataIndex: 'option',
      // align: 'center',
      render: (text: any, record: any) => (
        <>
          {record.state === POSITION_STATUS_INVALID && (
            <>
              <EditAuthButton>
                <Button
                  type="link"
                  onClick={() => history.push(`/commodityAbility/stockSellStorage/warehouse/edit?id=${record.id}`)}
                >
                  {intl.formatMessage({ id: 'stockSellStorage.bianji' })}
                </Button>
              </EditAuthButton>

              <AddAuthButton>
                <Popconfirm
                  title={intl.formatMessage({ id: 'stockSellStorage.quedingyaoshanchugaicangwei' })}
                  onConfirm={() => handleDelete(record)}
                  okText={intl.formatMessage({ id: 'stockSellStorage.shi' })}
                  cancelText={intl.formatMessage({ id: 'stockSellStorage.fou' })}
                >
                  <Button type="link" danger>
                    {intl.formatMessage({ id: 'stockSellStorage.shanchu' })}
                  </Button>
                </Popconfirm>
              </AddAuthButton>
            </>
          )}
        </>
      ),
    },
  ]

  const fetchListData = (params: any) => {
    return new Promise((resolve, reject) => {
      getProductWarehouseList(params)
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  const handleModify = (record) => {
    postProductWarehouseStartOrStop({
      id: record.id,
      state: record.state === POSITION_STATUS_EFFECTIVE ? POSITION_STATUS_INVALID : POSITION_STATUS_EFFECTIVE,
    }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const handleDelete = (record) => {
    getProductWarehouseDelete({
      id: record.id,
    }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const handleJumpAdd = () => {
    history.push('/commodityAbility/stockSellStorage/warehouse/add')
  }

  const Actions = (
    <Space>
      <AddAuthButton>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleJumpAdd}>
          {intl.formatMessage({ id: 'stockSellStorage.xinjian' })}
        </Button>
      </AddAuthButton>
    </Space>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              expressionScope={{
                Actions,
              }}
              effects={($, actions) => {}}
              schema={searchSchema}
              onSubmit={(values) => ref.current.reload(values)}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default WareHouse
