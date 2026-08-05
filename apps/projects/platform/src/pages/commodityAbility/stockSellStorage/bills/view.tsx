import React, { useState, useRef, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card, Dropdown, Menu, Space, Badge, Popconfirm, message } from 'antd'
import { PlusOutlined, DownOutlined, DeleteOutlined, RollbackOutlined, SnippetsOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import {
  getProductInvoicesList,
  getProductInvoicesTypeAll,
  getProductWarehouseAll,
  postProductInvoicesBatchDelete,
  postProductInvoicesBatchReview,
} from '@apps/apis'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import UploadModal from '@/components/UploadModal'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { DOC_STATUS_UNREVIEWED, DOC_STATUS_REVIEWED, DOC_STATUS } from '@/constants/commodity'
import { billsSchema } from './schema'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const formActions = createFormActions()

const Bills: React.FC<{}> = () => {
  const intl = useIntl()
  const { pathname } = useLocation()
  const ref = useRef<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([])
  const [visibleModal, setVisibleModal] = useState(false)
  const [moreVisible, setMoreVisible] = useState(false)
  const [batchLoading, setBatchLoading] = useState(false)
  const [batchKey, setBatchKey] = useState<React.ReactText>('')

  const fetchListData = async (params: any) => {
    const res = await getProductInvoicesList(params)
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  // 获取单据类型
  const fetchInvoicesType = async () => {
    const { data, code } = await getProductInvoicesTypeAll()
    if (code === 1000) {
      return data?.map((v) => ({ label: v.name, value: v.id }))
    }
    return []
  }

  // 获取对应仓库
  const fetchInventory = async () => {
    const { data, code } = await getProductWarehouseAll()
    if (code === 1000) {
      return data?.map((v) => ({ label: v.name, value: v.id }))
    }
    return []
  }

  const deleteInvoices = (ids: number[], callback?: () => void) => {
    setBatchLoading(true)
    postProductInvoicesBatchDelete({
      ids,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        if (callback) {
          callback()
        }
      })
      .finally(() => {
        setBatchLoading(false)
      })
  }

  const auditInvoices = (ids: number[], reviewType: number, callback?: () => void) => {
    setBatchLoading(true)
    postProductInvoicesBatchReview(
      {
        ids,
        reviewType,
      },
      {
        ctlType: 'none',
      },
    )
      .then((res) => {
        if (res.code !== 1000) {
          message.info(res.message)
          return
        }
        if (callback) {
          callback()
        }
      })
      .finally(() => {
        setBatchLoading(false)
      })
  }
  useEffect(() => {
    if (batchLoading || !selectedRowKeys.length) {
      return
    }
    switch (batchKey) {
      case 'BatchDelete': {
        deleteInvoices(selectedRowKeys, () => {
          setSelectedRowKeys([])
          ref.current.reloadCurrent()
        })
        break
      }

      case 'BatchAudit': {
        auditInvoices(selectedRowKeys, 1, () => {
          setSelectedRowKeys([])
          ref.current.reloadCurrent()
        })
        break
      }

      case 'BatchCounterclaim': {
        auditInvoices(selectedRowKeys, 0, () => {
          setSelectedRowKeys([])
          ref.current.reloadCurrent()
        })
        break
      }

      default:
        break
    }
    setBatchKey('')
  }, [batchKey])
  const handleBatch = (key: React.ReactText) => {
    setBatchKey(key)
  }

  const menu = (
    <AuthButton type="custom" code="batch">
      <Menu onClick={(e) => handleBatch(e.key)}>
        {/* <Menu.Item key="DeleteBatch" icon={<ZoomOutOutlined />}>
          {intl.formatMessage({ id: 'stockSellStorage.shanchudaorupici' })}
        </Menu.Item> */}
        <Menu.Item key="BatchDelete" icon={<DeleteOutlined />}>
          {intl.formatMessage({ id: 'stockSellStorage.piliangshanchu' })}
        </Menu.Item>
        <Menu.Item key="BatchAudit" icon={<SnippetsOutlined />}>
          {intl.formatMessage({ id: 'stockSellStorage.piliangshenhe' })}
        </Menu.Item>
        <Menu.Item key="BatchCounterclaim" icon={<RollbackOutlined />}>
          {intl.formatMessage({ id: 'stockSellStorage.piliangfanshen' })}
        </Menu.Item>
      </Menu>
    </AuthButton>
  )

  const handleAudit = (id, reviewType) => {
    auditInvoices([id], reviewType, () => {
      setSelectedRowKeys([])
      ref.current.reloadCurrent()
    })
  }

  const handleDelete = (id) => {
    deleteInvoices([id], () => {
      setSelectedRowKeys([])
      ref.current.reloadCurrent()
    })
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'stockSellStorage.danjuhao' }),
      dataIndex: 'invoicesNo',
      // align: 'center',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/commodityAbility/stockSellStorage/bills/detail?id=${record.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.danjuleixing' }),
      // align: 'center',
      dataIndex: 'invoicesTypeName',
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.danjuzhaiyao' }),
      // align: 'center',
      dataIndex: 'invoicesAbstract',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.duiyingcangku' }),
      // align: 'center',
      dataIndex: 'warehouseName',
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.jiaoyishijian' }),
      // align: 'center',
      dataIndex: 'invoicesTime',
      render: (text) => (text ? formatTimeString(text) : ''),
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.danjuzhuangtai' }),
      // align: 'center',
      dataIndex: 'state',
      render: (text) => (
        <Badge color={text === DOC_STATUS_UNREVIEWED ? '#C1C7D0' : '#41CC9E'} text={DOC_STATUS[text]} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.caozuo' }),
      dataIndex: 'actions',
      // align: 'center',
      render: (_, record: any) => {
        return record.source === 1 ? (
          <>
            {record.state === DOC_STATUS_UNREVIEWED && (
              <>
                <EditAuthButton>
                  <Button
                    type="link"
                    onClick={() => history.push(`/commodityAbility/stockSellStorage/bills/edit?id=${record.id}`)}
                  >
                    {intl.formatMessage({ id: 'stockSellStorage.xiugai' })}
                  </Button>
                </EditAuthButton>
                <AuthButton type="custom" code="examine">
                  <Button type="link" onClick={() => handleAudit(record.id, 1)}>
                    {intl.formatMessage({ id: 'stockSellStorage.shenhe' })}
                  </Button>
                </AuthButton>
                <AuthButton type="custom" code="delete">
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'stockSellStorage.quedingyaoshanchuma',
                    })}
                    okText={intl.formatMessage({ id: 'stockSellStorage.shi' })}
                    cancelText={intl.formatMessage({
                      id: 'stockSellStorage.fou',
                    })}
                    onConfirm={() => handleDelete(record.id)}
                  >
                    <Button type="link" danger>
                      {intl.formatMessage({ id: 'stockSellStorage.shanchu' })}
                    </Button>
                  </Popconfirm>
                </AuthButton>
              </>
            )}
            {record.state === DOC_STATUS_REVIEWED && (
              <Button type="link" onClick={() => handleAudit(record.id, 0)}>
                {intl.formatMessage({ id: 'stockSellStorage.fanshen' })}
              </Button>
            )}
          </>
        ) : null
      },
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  const controllerBtns = (
    <Space>
      <AddAuthButton>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push('/commodityAbility/stockSellStorage/bills/add?source=1')}
        >
          {intl.formatMessage({ id: 'stockSellStorage.xinjian' })}
        </Button>
      </AddAuthButton>
      {/* <AuthButton btnCode='bills.Import' >
        <Button onClick={() => setVisibleModal(true)}>{intl.formatMessage({ id: 'stockSellStorage.daoru' })}</Button>
      </AuthButton> */}

      <Dropdown.Button overlay={menu} trigger={['click']} icon={<DownOutlined />}>
        {intl.formatMessage({ id: 'stockSellStorage.gengduo' })}
      </Dropdown.Button>
    </Space>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          columns={columns}
          currentRef={ref}
          tableProps={{ rowKey: 'id' }}
          rowSelection={rowSelection}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              expressionScope={{
                controllerBtns,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'invoicesNo', FORM_FILTER_PATH)
                useAsyncSelect('invoicesTypeId', fetchInvoicesType)
                useAsyncSelect('warehouseId', fetchInventory)
              }}
              schema={billsSchema}
            />
          }
        />
        <UploadModal
          visibleModal={visibleModal}
          fileText={intl.formatMessage({ id: 'stockSellStorage.danjuziliao' })}
          onCancel={() => setVisibleModal(false)}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Bills
