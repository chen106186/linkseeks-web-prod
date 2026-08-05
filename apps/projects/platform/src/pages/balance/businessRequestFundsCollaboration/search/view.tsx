import React, { useRef } from 'react'
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
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import {
  getSettlementBusinessApplyAmountTeamworkVendorApplyAmountList,
  getSettlementBusinessApplyAmountItemApplyAmountStatus,
} from '@apps/apis'
import { createFormActions } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { Link } from '@linkseeks/router-core'
import { fetchOptions } from '../../common'

const intl = getIntl()

const { Text } = Typography

// 请款单查询

const formActions = createFormActions()

const Search: React.FC = () => {
  const ref = useRef<any>({})
  const loadingTableData = async (params) => {
    const _params = { ...params }
    if (params.createTimeStart) {
      _params.createTimeStart = formatTimeString(Number(params.createTimeStart), 'YYYY-MM-DD')
    }
    if (params.createTimeEnd) {
      _params.createTimeEnd = formatTimeString(Number(params.createTimeEnd), 'YYYY-MM-DD')
    }
    const { data } = await getSettlementBusinessApplyAmountTeamworkVendorApplyAmountList(_params)
    return data
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.qingkuandanhao' }),
      key: 'applyNo',
      dataIndex: 'applyNo',
      render: (text: any, record: any) =>
        AuthUrl('detail') ? (
          <Link to={`/balance/businessRequestFundsCollaboration/search/detail?id=${record.id}&no=${text}`}>{text}</Link>
        ) : (
          <Button type="link" style={{ padding: 0 }}>
            {text}
          </Button>
        ),
    },
    {
      title: intl.formatMessage({ id: 'balance.danjuzhaiyao' }),
      key: 'applyAbstract',
      dataIndex: 'applyAbstract',
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
    },
    {
      title: intl.formatMessage({ id: 'balance.qingkuanfang' }),
      key: 'payer',
      dataIndex: 'payer',
    },
    {
      title: intl.formatMessage({ id: 'balance.shoukuanfang' }),
      key: 'payee',
      dataIndex: 'payee',
    },
    {
      title: intl.formatMessage({ id: 'balance.qingkuanjine' }),
      key: 'applyAmount',
      dataIndex: 'applyAmount',
      render: (text: any, record: any) => `${intl.formatMessage({ id: 'common.money' })}${priceFormat(text)}`,
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'balance.yujifukuanriqi' }),
      key: 'expectPayTime',
      dataIndex: 'expectPayTime',
      render: (text: any, record: any) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
      width: 180,
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
      render: (text: any, record: any) => <StatusTag type="default" title={text} />,
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
                useStateFilterSearchLinkageEffect($, actions, 'applyNo', FORM_FILTER_PATH)
                useAsyncSelect('status', fetchOptions(getSettlementBusinessApplyAmountItemApplyAmountStatus))
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
                      applyNo: {
                        type: 'string',
                        'x-component': 'Search',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.qingshuruqingkuandanhao' }),
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
                      applyAbstract: {
                        type: 'string',
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'balance.qingshuruqingkuandanzhaiyao' }),
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
              }}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Search
