import React, { useRef, ReactNode } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Button, Space, Popconfirm } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { PlusOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'
import {
  getContractContractTemplatePage,
  postContractContractTemplateDelete,
  postContractContractTemplateEnable,
} from '@apps/apis'
const formActions = createFormActions()
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const intl = getIntl()

const Template: React.FC<{}> = () => {
  const ref = useRef<any>({})
  //表头
  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
    },
    {
      title: intl.formatMessage({ id: 'contract.hetongmubanmingcheng' }),
      dataIndex: 'name',
      width: '15%',
      render: (text: any, record: any) => {
        return (
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/contract/template/templateList/detail?id=${record.id}`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.banbenhao' }),
      dataIndex: 'version',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'contract.mubanshuoming' }),
      dataIndex: 'description',
      width: '35%',
    },
    {
      title: intl.formatMessage({ id: 'contract.zhuangtai' }),
      dataIndex: 'state',
      width: '20%',
      sorter: (a, b) => a.state - b.state,
      render: (text: any, record: any) => {
        let component: ReactNode = null
        component = (
          <AuthButton type="custom" code="state">
            <Popconfirm
              title={intl.formatMessage({ id: 'contract.quedingyaozhixingzhegecao' })}
              onConfirm={() => confirm(record)}
              okText={intl.formatMessage({ id: 'contract.shi' })}
              cancelText={intl.formatMessage({ id: 'contract.fou' })}
            >
              <Button type="link" style={record.state ? { color: '#00A98F' } : { color: 'red' }}>
                {record.state ? (
                  <>
                    {intl.formatMessage({ id: 'contract.youxiao' })} <PlayCircleOutlined />
                  </>
                ) : (
                  <>
                    {intl.formatMessage({ id: 'contract.wuxiao' })} <PauseCircleOutlined />
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
      title: intl.formatMessage({ id: 'contract.caozuo' }),
      dataIndex: 'action',
      width: '20%',
      render: (text: any, record: any) => {
        let component: ReactNode = null
        component = (
          <>
            {record.state === 0 && (
              <>
                <AuthButton type="edit" code="edit">
                  <Button disabled={record.state === 1} style={{ padding: '0px', marginRight: '24px' }} type="link">
                    <Link to={`/contract/template/templateList/edit?id=${record.id}`}>
                      {intl.formatMessage({ id: 'contract.bianji' })}
                    </Link>
                  </Button>
                </AuthButton>

                <AuthButton type="custom" code="del">
                  <Popconfirm
                    title={intl.formatMessage({ id: 'contract.quedingyaozhixingzhegecao' })}
                    onConfirm={() => confirmDel(record)}
                    okText={intl.formatMessage({ id: 'contract.shi' })}
                    cancelText={intl.formatMessage({ id: 'contract.fou' })}
                    disabled={record.state === 1}
                  >
                    <Button disabled={record.state === 1} style={{ padding: '0px' }} type="link">
                      {intl.formatMessage({ id: 'contract.shanchu' })}
                    </Button>
                  </Popconfirm>
                </AuthButton>
              </>
            )}
          </>
        )
        return component
      },
    },
  ]

  // 模拟请求
  const fetchData = (params?: any) => {
    console.log(params) //可以直接打印参数
    return new Promise((resolve, reject) => {
      getContractContractTemplatePage({ ...params })
        .then((res) => {
          resolve(res.data)
        })
        .catch(() => {
          reject()
        })
    })
  }

  const handleJumpAdd = () => {
    history.push('/contract/template/templateList/add')
  }

  const Actions = (
    <Space>
      <AuthButton type="add" code="add">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleJumpAdd}>
          {intl.formatMessage({ id: 'contract.xinjian' })}
        </Button>
      </AuthButton>
    </Space>
  )

  /**合同模板停用/启用 */
  const confirm = (recode: any) => {
    postContractContractTemplateEnable({
      id: recode.id,
      state: recode.state === 1 ? 0 : 1,
    }).then((res) => {
      ref.current.reloadCurrent()
    })
  }

  /**删除 */
  const confirmDel = (recode: any) => {
    postContractContractTemplateDelete({ id: recode.id }).then((res) => {
      ref.current.reloadCurrent()
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              expressionScope={{
                Actions,
              }}
              effects={($, actions) => {}}
              schema={{
                type: 'object',
                properties: {
                  searchWrap: {
                    type: 'object',
                    'x-component': 'Mega-Layout',
                    'x-component-props': {
                      grid: true,
                    },
                    properties: {
                      actions: {
                        type: 'object',
                        'x-component': 'Children',
                        'x-component-props': {
                          children: '{{Actions}}',
                        },
                      },
                      name: {
                        type: 'string',
                        'x-component': 'Search',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'contract.hetongmubanmingcheng' }),
                          advanced: false,
                        },
                      },
                    },
                  },
                },
              }}
              onSubmit={(values) => ref.current.reload(values)}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Template
