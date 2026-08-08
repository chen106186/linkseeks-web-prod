import React, { useRef } from 'react'
import { Card, Typography, Space, Button } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import { getSettlementBusinessReconciliationTeamworkTobeApplyamountList } from '@apps/apis'
import { createFormActions } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { Link } from '@linkseeks/router-core'
const intl = getIntl()
const { Text } = Typography

// 待请款

const formActions = createFormActions()

const ReadyPay: React.FC = () => {
  const ref = useRef<any>({})
  const loadingTableData = async (params) => {
    const _params = { ...params }
    if (!params.reconciliationNo) {
      delete _params.reconciliationNo
    }
    if (params.createTimeStart) {
      _params.createTimeStart = formatTimeString(Number(params.createTimeStart), 'YYYY-MM-DD')
    }
    if (params.createTimeEnd) {
      _params.createTimeEnd = formatTimeString(Number(params.createTimeEnd), 'YYYY-MM-DD')
    }
    const { data } = await getSettlementBusinessReconciliationTeamworkTobeApplyamountList(_params)
    return data
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.duizhangdanhao' }),
      key: 'reconciliationNo',
      dataIndex: 'reconciliationNo',
      render: (text: any, record: any) =>
        AuthUrl('detail') ? (
          <Link
            to={`/balance/businessReconciliationCollaboration/readyPay/detail?id=${record.reconciliationId}&no=${text}`}
          >
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
      render: (text: any, record: any) => (
        <Space direction="vertical" style={{ width: 300 }}>
          <Text type="secondary">{text}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'balance.shoukuanfang' }),
      key: 'payee',
      dataIndex: 'payee',
    },
    {
      title: intl.formatMessage({ id: 'balance.duizhangzongjinehanshui' }),
      key: 'reconciliationMoneyAmount',
      dataIndex: 'reconciliationMoneyAmount',
      render: (text: any, record: any) => `${intl.formatMessage({ id: 'common.money' })}${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.danjushijian' }),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any, record: any) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'balance.waibuzhuangtai' }),
      key: 'statusName',
      dataIndex: 'statusName',
      render: (text: any, record: any) => <StatusTag type="primary" title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'balance.caozuo' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (text: any, record: any) =>
        AuthUrl('qingkuan') && (
          <Link
            to={`/balance/businessReconciliationCollaboration/readyPay/detail?id=${record.reconciliationId}&no=${record.reconciliationNo}`}
          >
            {intl.formatMessage({ id: 'balance.qingkuan' })}
          </Link>
        ),
    },
  ]

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
                      payee: {
                        type: 'string',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.qingshurushoukuanfang' }),
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

export default ReadyPay
