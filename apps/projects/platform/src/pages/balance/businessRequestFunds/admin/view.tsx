import React, { useRef, useState } from 'react'
import { Card, Typography, Space, Button, Popconfirm, Dropdown, Menu } from 'antd'
import { PlusOutlined, CaretDownOutlined } from '@ant-design/icons'
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
import {
  getSettlementBusinessApplyAmountToAddApplyAmountList,
  postSettlementBusinessApplyAmountSubmitApplyAmount,
  postSettlementBusinessApplyAmountDelete,
} from '@apps/apis'
import { createFormActions } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
const intl = getIntl()

const { Text } = Typography

// 请款单查询

const formActions = createFormActions()

const Admin: React.FC = () => {
  const ref = useRef<any>({})
  const loadingTableData = async (params) => {
    const _params = { ...params }
    if (params.createTimeStart) {
      _params.createTimeStart = formatTimeString(Number(params.createTimeStart), 'YYYY-MM-DD')
    }
    if (params.createTimeEnd) {
      _params.createTimeEnd = formatTimeString(Number(params.createTimeEnd), 'YYYY-MM-DD')
    }
    const { data } = await getSettlementBusinessApplyAmountToAddApplyAmountList(_params)
    return data
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.qingkuandanhao' }),
      key: 'applyNo',
      dataIndex: 'applyNo',
      width: 150,
      render: (text: any, record: any) =>
        AuthUrl('detail') ? <Link to={`admin/detail?id=${record.id}&no=${record.applyNo}`}>{text}</Link> : text,
    },
    {
      title: intl.formatMessage({ id: 'balance.danjuzhaiyao' }),
      key: 'applyAbstract',
      dataIndex: 'applyAbstract',
      width: 300,
      render: (text: any, record: any) => (
        <Space direction="vertical" style={{ width: 300 }}>
          <Text type="secondary">{text}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'balance.qingkuanleixing' }),
      key: 'applyTypeName',
      dataIndex: 'applyTypeName',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.shoukuanfang' }),
      key: 'payee',
      dataIndex: 'payee',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.qingkuanjine' }),
      key: 'applyAmount',
      dataIndex: 'applyAmount',
      render: (text: any, record: any) => `${intl.formatMessage({ id: 'common.money' })}${priceFormat(text)}`,
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.yujifukuanriqi' }),
      key: 'expectPayTime',
      dataIndex: 'expectPayTime',
      render: (text: any, record: any) => formatTimeString(text, 'YYYY-MM-DD'),
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.danjushijian' }),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any, record: any) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.waibuzhuangtai' }),
      key: 'statusName',
      dataIndex: 'statusName',
      width: 150,
      render: (text: any, record: any) => <StatusTag type="default" title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'balance.caozuo' }),
      dataIndex: 'operate',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (_: any, record: any) => (
        <>
          {record?.hasSubmit && (
            <AuthButton type="custom" code="confirm">
              <Popconfirm
                title={intl.formatMessage({ id: 'balance.quedingyaotijiaoma' })}
                okText={intl.formatMessage({ id: 'balance.shi' })}
                cancelText={intl.formatMessage({ id: 'balance.fou' })}
                onConfirm={() => fetchSubmitBatch(record.id)}
              >
                <Button type="link">{intl.formatMessage({ id: 'balance.tijiao' })}</Button>
              </Popconfirm>
            </AuthButton>
          )}
          <Dropdown
            overlay={() => (
              <Menu onClick={(e) => handleMenuClick(e, record)}>
                {AuthUrl('edit') && <Menu.Item key="1">{intl.formatMessage({ id: 'balance.bianji' })}</Menu.Item>}
                {AuthUrl('del') && record.hasSubmit && (
                  <Popconfirm
                    title={intl.formatMessage({ id: 'balance.querenyaoshanchuma' })}
                    okText={intl.formatMessage({ id: 'balance.shi' })}
                    cancelText={intl.formatMessage({ id: 'balance.fou' })}
                    onConfirm={() => fetchDelete(record.id)}
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

  const fetchSubmitBatch = (id: string) => {
    postSettlementBusinessApplyAmountSubmitApplyAmount({ id }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const fetchDelete = (id: number) => {
    postSettlementBusinessApplyAmountDelete({ id }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const handleMenuClick = (e: any, record: any) => {
    if (e.key === '1') {
      if (record.applyType === 1) {
        history.push(`/balance/businessRequestFunds/admin/fundsEdit?id=${record.id}&no=${record.applyNo}`)
        // history.push(`/balance/businessRequestFunds/admin/add?id=${record.id}&no=${record.applyNo}`)
      } else {
        // history.push(`/balance/businessRequestFunds/admin/add?id=${record.id}&no=${record.applyNo}`)
        history.push(`/balance/businessRequestFunds/admin/edit?id=${record.id}&no=${record.applyNo}`)
      }
    }
  }

  const handleAdd = () => {
    history.push(`/balance/businessRequestFunds/admin/add`)
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
                useStateFilterSearchLinkageEffect($, actions, 'applyNo', FORM_FILTER_PATH)
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
                      ctl: {
                        type: 'object',
                        'x-component': 'controllerBtns',
                      },
                      applyNo: {
                        type: 'string',
                        'x-component': 'Search',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.qingshuruqingkuandanhao' }),
                          align: 'flex-end',
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
                        justifyContent: 'flex-end',
                      },
                      colStyle: {
                        marginRight: 0,
                        marginLeft: 16,
                      },
                    },
                    properties: {
                      applyAbstract: {
                        type: 'string',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.qingshuruqingkuandanzhaiyao' }),
                          allowClear: true,
                        },
                      },
                      payee: {
                        type: 'string',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.businessRequestFunds.admin.schema.payee' }),
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
                      '[expectPayTimeStart,expectPayTimeEnd]': {
                        type: 'string',
                        'x-component': 'daterange',
                        'x-component-props': {
                          placeholder: [
                            intl.formatMessage({ id: 'balance.yujifukuankaishishijian' }),
                            intl.formatMessage({ id: 'balance.yujifukuanjieshushijian' }),
                          ],
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
                controllerBtns: () => (
                  <Space>
                    <AuthButton type="custom" code="add">
                      <Button type="primary" size="middle" icon={<PlusOutlined />} onClick={handleAdd}>
                        {intl.formatMessage({ id: 'balance.businessRequestFunds.admin.handleAdd' })}
                      </Button>
                    </AuthButton>
                  </Space>
                ),
              }}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Admin
