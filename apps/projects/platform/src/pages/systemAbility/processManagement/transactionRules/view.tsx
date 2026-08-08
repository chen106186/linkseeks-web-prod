import React, { ReactNode, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Popconfirm, Card, Space } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { PlusOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { getOrderTradeProcessPage, postOrderTradeProcessDelete, postOrderTradeProcessStatusUpdate } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

const formActions = createFormActions()

const TransactionRules: React.FC<{}> = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { pathname } = useLocation()
  const fetchData = (params: any) => {
    if (!params?.name) delete params.name
    return new Promise((resolve) => {
      getOrderTradeProcessPage(params).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'processRuleSetting.jiaoyiguizeID', defaultMessage: '交易规则ID' }),
      dataIndex: 'processId',
      key: 'processId',
    },
    {
      title: intl.formatMessage({ id: 'processRuleSetting.liuchengguizeming', defaultMessage: '流程规则名称' }),
      dataIndex: 'name',
      key: 'name',
      className: 'commonPickColor',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`${pathname}/detail?id=${record.processId}&preview=1`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'processRuleSetting.jiaoyiliuchengming', defaultMessage: '交易流程名称' }),
      dataIndex: 'processName',
      key: 'processName',
    },
    {
      title: intl.formatMessage({ id: 'processRuleSetting.caozuoshijian', defaultMessage: '操作时间' }),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => text && formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'processRuleSetting.zhuangtai', defaultMessage: '状态' }),
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => {
        let component: ReactNode = null
        component = (
          <AuthButton type="custom" code="state">
            <Popconfirm
              title={intl.formatMessage({
                id: 'processRuleSetting.quedingyaozhixing',
                defaultMessage: '确定要执行这个操作',
              })}
              onConfirm={() => confirm(record)}
              okText={intl.formatMessage({ id: 'processRuleSetting.shi', defaultMessage: '是' })}
              cancelText={intl.formatMessage({ id: 'processRuleSetting.fou', defaultMessage: '否' })}
            >
              <Button type="link" style={record.status ? { color: '#00A98F' } : { color: 'red' }}>
                {record.status ? (
                  <>
                    {intl.formatMessage({ id: 'processRuleSetting.youxiao', defaultMessage: '有效' })}{' '}
                    <PlayCircleOutlined />
                  </>
                ) : (
                  <>
                    {intl.formatMessage({ id: 'processRuleSetting.wuxiao', defaultMessage: '无效' })}{' '}
                    <PauseCircleOutlined />
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
      title: intl.formatMessage({ id: 'processRuleSetting.caozuo', defaultMessage: '操作' }),
      dataIndex: 'option',
      render: (text: any, record: any) => {
        return (
          <>
            {record.status === 0 ? (
              <>
                <AuthButton type="custom" code="delete">
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'processRuleSetting.quedingyaozhixing',
                      defaultMessage: '确定要执行这个操作?',
                    })}
                    onConfirm={() => handelDelete(record)}
                    okText={intl.formatMessage({ id: 'processRuleSetting.shi', defaultMessage: '是' })}
                    cancelText={intl.formatMessage({ id: 'processRuleSetting.fou', defaultMessage: '否' })}
                  >
                    <Button type="link">
                      {intl.formatMessage({ id: 'processRuleSetting.shanchu', defaultMessage: '删除' })}
                    </Button>
                  </Popconfirm>
                </AuthButton>
                <EditAuthButton>
                  <Button type="link" onClick={() => history.push(`${pathname}/edit?id=${record.processId}`)}>
                    {intl.formatMessage({ id: 'processRuleSetting.xiugai', defaultMessage: '修改' })}
                  </Button>
                </EditAuthButton>
              </>
            ) : (
              ''
            )}
          </>
        )
      },
    },
  ]

  const confirm = (record: any) => {
    postOrderTradeProcessStatusUpdate({ processId: record.processId, status: record.status ? 0 : 1 }).then((res) => {
      ref.current.reloadCurrent()
    })
  }

  const handelDelete = (record: any) => {
    postOrderTradeProcessDelete({ processId: record.processId }).then((res) => {
      if (res.code === 1000) ref.current.reloadCurrent()
    })
  }

  const Actions = (
    <Space>
      <AddAuthButton>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => history.push(`${pathname}/add`)}>
          {intl.formatMessage({ id: 'processRuleSetting.xinjian', defaultMessage: '新建' })}
        </Button>
      </AddAuthButton>
    </Space>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'processId',
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
                          placeholder: intl.formatMessage({
                            id: 'processRuleSetting.guizemingcheng',
                            defaultMessage: '规则名称',
                          }),
                          advanced: false,
                          // tip: '输入 单据名称 进行搜索',
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

export default TransactionRules
