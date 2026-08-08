import React, { useRef, useState } from 'react'
import { Card, Typography, Space, Button } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import { authService } from '@apps/services'
import {
  getSettlementBusinessReconciliationVendorReconciliationList,
  getSettlementBusinessReconciliationItemReconciliationStatus,
  getSettlementBusinessReconciliationVendorReconciliationExport,
} from '@apps/apis'
import { createFormActions } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { Link } from '@linkseeks/router-core'
import { fetchOptions } from '../../common'
import { exportFile } from '@apps/utils'

const intl = getIntl()

const { Text } = Typography

// 对账单查询

const formActions = createFormActions()

const Search: React.FC = () => {
  const ref = useRef<any>({})
  const [exportParam, setExportParam] = useState<any>({})
  const { token } = authService.getAuth() || {}
  const loadingTableData = async (params) => {
    const _params = { ...params }
    if (params.createTimeStart) {
      _params.createTimeStart = formatTimeString(Number(params.createTimeStart), 'YYYY-MM-DD')
    }
    if (params.createTimeEnd) {
      _params.createTimeEnd = formatTimeString(Number(params.createTimeEnd), 'YYYY-MM-DD')
    }
    setExportParam(_params)
    const { data } = await getSettlementBusinessReconciliationVendorReconciliationList(_params)
    return data
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.duizhangdanhao' }),
      key: 'reconciliationNo',
      dataIndex: 'reconciliationNo',
      render: (text: any, record: any) =>
        AuthUrl('detail') ? (
          <Link to={`/balance/businessReconciliation/search/detail?id=${record.reconciliationId}&no=${text}`}>
            {text}
          </Link>
        ) : (
          <Button type="link" style={{ padding: 0 }}>
            {text}
          </Button>
        ),
    },
    {
      title: intl.formatMessage({ id: 'balance.danjuzhaiyao' }),
      key: 'reconciliationAbstract',
      dataIndex: 'reconciliationAbstract',
      render: (text: any) => (
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
  ]

  const _exportFunc = () => {
    const p = { ...exportParam }
    let exportParams = ''
    Object.keys(p).forEach((item) => {
      if (p[item]) {
        exportParams += `&${item}=${p[item]}`
      }
    })

    exportFile(getSettlementBusinessReconciliationVendorReconciliationExport, exportParams)
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
                useAsyncSelect('status', fetchOptions(getSettlementBusinessReconciliationItemReconciliationStatus))
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
                      reconciliationNo: {
                        type: 'string',
                        'x-component': 'Search',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.qingshuruduizhangdanhao' }),
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
                      },
                      colStyle: {
                        marginLeft: 20,
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
                      status: {
                        type: 'string',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.qingxuanzezhuangtai' }),
                          allowClear: true,
                        },
                        enum: [],
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
                controllerBtns: () => (
                  <Space>
                    <AuthButton type="custom" code="export">
                      <Button size="middle" onClick={_exportFunc}>
                        {intl.formatMessage({ id: 'balance.daochu' })}
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

export default Search
