import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card, Space, Popconfirm } from 'antd'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { PlusOutlined } from '@ant-design/icons'
import {
  getProductInvoicesTypeList,
  postProductInvoicesTypeStartOrStop,
  getProductInvoicesTypeDelete,
} from '@apps/apis'
import { EyeAuthButton } from '@apps/components'
import { StatusAuthButton } from '@apps/components'
import { ColumnType } from 'antd/lib/table/interface'
import NiceForm from '@/components/NiceForm'
import { DOC_TYPE_STATUS_EFFECTIVE, DOC_TYPE_STATUS_INVALID, DOC_DIRECTION } from '@/constants/commodity'
import { searchSchema } from './schema'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const formActions = createFormActions()

const billsType: React.FC<{}> = () => {
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
      title: intl.formatMessage({ id: 'stockSellStorage.danjuleixingbianhao' }),
      dataIndex: 'number',
      // align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.danjumingcheng' }),
      dataIndex: 'name',
      // align: 'center',
      render: (text: any, record: any) => {
        return (
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            url={`/commodityAbility/stockSellStorage/billsType/detail?id=${record.id}&preview=1`}
          >
            {text}
          </EyeAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.fangxiang' }),
      dataIndex: 'direction',
      // align: 'center',
      render: (text) => {
        return <span>{DOC_DIRECTION[text]}</span>
      },
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.zhuangtai' }),
      dataIndex: 'status',
      // align: 'center',
      sorter: (a, b) => a.state - b.state,
      render: (text: any, record: any) => (
        <AuthButton type="custom" code="state">
          <StatusAuthButton fieldNames="state" handleConfirm={() => handleModify(record)} record={record} />
        </AuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.caozuo' }),
      dataIndex: 'option',
      // align: 'center',
      render: (text: any, record: any) => (
        <>
          {record.state === DOC_TYPE_STATUS_INVALID && (
            <>
              <EditAuthButton>
                <Button
                  type="link"
                  onClick={() => history.push(`/commodityAbility/stockSellStorage/billsType/edit?id=${record.id}`)}
                >
                  {intl.formatMessage({ id: 'stockSellStorage.bianji' })}
                </Button>
              </EditAuthButton>

              <AuthButton type="custom" code="delete">
                <Popconfirm
                  title={intl.formatMessage({ id: 'stockSellStorage.quedingyaoshanchugaidanju' })}
                  onConfirm={() => handleDelete(record)}
                  okText={intl.formatMessage({ id: 'stockSellStorage.shi' })}
                  cancelText={intl.formatMessage({ id: 'stockSellStorage.fou' })}
                >
                  <Button type="link" danger>
                    {intl.formatMessage({ id: 'stockSellStorage.shanchu' })}
                  </Button>
                </Popconfirm>
              </AuthButton>
            </>
          )}
        </>
      ),
    },
  ]

  const fetchListData = (params: any) => {
    return new Promise((resolve, reject) => {
      getProductInvoicesTypeList(params)
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

  const handleModify = (record: any) => {
    postProductInvoicesTypeStartOrStop({
      id: record.id,
      state: record.state === DOC_TYPE_STATUS_EFFECTIVE ? DOC_TYPE_STATUS_INVALID : DOC_TYPE_STATUS_EFFECTIVE,
    }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const handleDelete = (record) => {
    getProductInvoicesTypeDelete({
      id: record.id,
    }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const handleJumpAdd = () => {
    history.push(`/commodityAbility/stockSellStorage/billsType/add`)
  }

  const Actions = (
    <Space>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleJumpAdd}>
        {intl.formatMessage({ id: 'stockSellStorage.xinjian' })}
      </Button>
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

export default billsType
