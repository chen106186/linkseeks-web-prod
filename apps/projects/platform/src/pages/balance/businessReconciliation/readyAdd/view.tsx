import React, { useRef } from 'react'
import { Card, Typography, Space, Button, Popconfirm, Dropdown, Menu, message } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import { createFormActions } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'

import {
  postSettlementBusinessReconciliationToSaveReconciliationList,
  postSettlementBusinessReconciliationSubmitReconciliation,
  postSettlementBusinessReconciliationDeleteReconciliation,
} from '@apps/apis'

const intl = getIntl()
const { Text } = Typography

// 待新增对账单

const formActions = createFormActions()

const ReadyAdd: React.FC = () => {
  const ref = useRef<any>({})
  const loadingTableData = async (params) => {
    const _params = { ...params }
    if (params.createTimeStart) {
      _params.createTimeStart = formatTimeString(Number(params.createTimeStart), 'YYYY-MM-DD')
    }
    if (params.createTimeEnd) {
      _params.createTimeEnd = formatTimeString(Number(params.createTimeEnd), 'YYYY-MM-DD')
    }
    const { data } = await postSettlementBusinessReconciliationToSaveReconciliationList(_params)
    message.destroy()
    return data
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.duizhangdanhao' }),
      key: 'reconciliationNo',
      dataIndex: 'reconciliationNo',
      render: (text: any, record: any) =>
        AuthUrl('detail') ? (
          <Link to={`readyAdd/preview?id=${record.reconciliationId}&no=${text}`}>{text}</Link>
        ) : (
          <Button type="link" style={{ padding: 0 }}>
            {text}
          </Button>
        ),
    },
    {
      title: intl.formatMessage({
        id: 'balance.reconciliationAbstract',
        defaultMessage: '对账单摘要',
      }),
      key: 'reconciliationAbstract',
      dataIndex: 'reconciliationAbstract',
      render: (text: any, record: any) => (
        <Space direction="vertical" style={{ width: 300 }}>
          <Text type="secondary">{text}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'balance.fukuanfang' }),
      key: 'payer',
      dataIndex: 'payer',
    },
    {
      title: intl.formatMessage({ id: 'balance.duizhangzongjinehanshui' }),
      key: 'reconciliationMoneyAmount',
      dataIndex: 'reconciliationMoneyAmount',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })}${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.danjushijian' }),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'balance.waibuzhuangtai' }),
      key: 'statusName',
      dataIndex: 'statusName',
      render: (text: any) => <StatusTag type="primary" title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'balance.caozuo' }),
      dataIndex: 'operate',
      align: 'center',
      render: (text: any, record: any) => (
        <>
          {record.status === 1 && (
            <AuthButton type="custom" code="submit">
              <Popconfirm
                title={intl.formatMessage({ id: 'balance.quedingyaotijiaoma' })}
                okText={intl.formatMessage({ id: 'balance.shi' })}
                cancelText={intl.formatMessage({ id: 'balance.fou' })}
                onConfirm={() => fetchSubmitBatch(record.reconciliationId)}
              >
                <Button type="link">{intl.formatMessage({ id: 'balance.tijiao' })}</Button>
              </Popconfirm>
            </AuthButton>
          )}
          <Dropdown
            overlay={() => (
              <Menu onClick={(e) => handleMenuClick(e, record)}>
                {AuthUrl('edit') && <Menu.Item key="1">{intl.formatMessage({ id: 'balance.bianji' })}</Menu.Item>}
                {AuthUrl('del') && record.status === 1 && (
                  <Popconfirm
                    title={intl.formatMessage({ id: 'balance.querenyaoshanchuma' })}
                    okText={intl.formatMessage({ id: 'balance.shi' })}
                    cancelText={intl.formatMessage({ id: 'balance.fou' })}
                    onConfirm={() => fetchDelete(record.reconciliationId)}
                  >
                    <Menu.Item key="2">{intl.formatMessage({ id: 'balance.shanchu' })}</Menu.Item>
                  </Popconfirm>
                )}
              </Menu>
            )}
          >
            <Button type="link">
              {intl.formatMessage({ id: 'balance.gengduo' })}
              <CaretDownOutlined />
            </Button>
          </Dropdown>
        </>
      ),
    },
  ]

  const fetchSubmitBatch = (id: number) => {
    postSettlementBusinessReconciliationSubmitReconciliation({ id }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const fetchDelete = (id: number) => {
    postSettlementBusinessReconciliationDeleteReconciliation({ id }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const handleMenuClick = (e: any, record: any) => {
    if (e.key === '1') {
      history.push(
        `/balance/businessReconciliation/readyAdd/edit?id=${record.reconciliationId}&no=${record.reconciliationNo}`,
      )
    }
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => loadingTableData(params)}
          columns={columns}
          currentRef={ref}
          rowKey="id"
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'reconciliationNo', FORM_FILTER_PATH)
              }}
              schema={{
                type: 'object',
                properties: {
                  mageLayout: {
                    type: 'object',
                    'x-component': 'mega-layout',
                    'x-component-props': {
                      grid: true,
                    },
                    properties: {
                      reconciliationNo: {
                        type: 'string',
                        'x-component': 'Search',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.qingshuruduizhangdanhao' }),
                          align: 'flex-start',
                          allowClear: true,
                        },
                      },
                    },
                  },
                  [FORM_FILTER_PATH]: {
                    type: 'object',
                    'x-component': 'flex-layout',
                    'x-component-props': {
                      rowStyle: {
                        flexWrap: 'nowrap',
                        justifyContent: 'flex-start',
                      },
                      colStyle: {
                        marginRight: 16,
                      },
                    },

                    properties: {
                      reconciliationAbstract: {
                        type: 'string',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.qingshuruduizhangdanzhaiyao' }),
                          allowClear: true,
                        },
                      },
                      payer: {
                        type: 'string',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.qingshurufukuanfang' }),
                          allowClear: true,
                        },
                      },
                      '[createTimeStart,createTimeEnd]': {
                        type: 'string',
                        'x-component': 'dateSelect',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.danjushijianquanbu' }),
                          allowClear: true,
                        },
                      },
                      submit: {
                        'x-component': 'Submit',
                        'x-component-props': {
                          children: intl.formatMessage({ id: 'balance.chaxun' }),
                        },
                      },
                    },
                  },
                },
              }}
              components={{
                Submit,
              }}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default ReadyAdd
