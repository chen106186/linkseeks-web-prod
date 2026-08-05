/**
 * 待开票（SRM）
 */
import React, { useRef } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { usePrompt } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Button, DatePicker } from 'antd'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { schema } from './schema'
import StatusTag from '@/components/StatusTag'
import { fetchInvoiceOptions } from '../../common'
import useSetSearchValueInTable from '@/hooks/useSetSearchValueInTable'
import { priceFormat } from '@/utils/numberFomat'
import {
  getSettlementMemberSettlementAccountStatementTobeInvoiceListStatus,
  getSettlementMemberSettlementPageInvoicingProcessList,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import './index.less'
import moment from 'moment'

const intl = getIntl()
const RangePicker = DatePicker.RangePicker
const formActions = createFormActions()

const SettlementList: React.FC = () => {
  const intl = useIntl()
  const ref = useRef<any>({})

  /**
   * @param params
   */
  const fetchListData = async (params) => {
    const searchParams = {
      ...params,
    }
    const { data } = await getSettlementMemberSettlementPageInvoicingProcessList(searchParams)
    return data
  }

  /**
   * 搜索
   */
  const handleSearch = (values) => {
    ref.current.reload({
      ...values,
      createTimeStart: values?.createTimeStart ? values?.createTimeStart.format('YYYY-MM-DD') : undefined,
      createTimeEnd: values?.createTimeEnd ? values?.createTimeEnd.format('YYYY-MM-DD') : undefined,
    })
  }

  const _handleOrderNo = (record) => {
    history.push(
      `/balance/businessReconciliation/search/preview?id=${record.reconciliationId}&no=${record.reconciliationNo}`,
    )
  }

  const columns = [
    {
      title: intl.formatMessage({
        id: 'balance.common.columns.productNoticecolumns.orderNo',
      }),
      dataIndex: 'reconciliationNo',
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            _handleOrderNo(record)
          }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.orderAbstract',
      }),
      dataIndex: 'reconciliationAbstract',
    },
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.settlementOrderTypeName',
      }),
      dataIndex: 'reconciliationTypeName',
    },
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.orderTime',
      }),
      dataIndex: 'createTime',
      render: (createTime) => moment(createTime).format('YYYY-MM-DD'),
    },
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.tax',
      }),
      dataIndex: 'tax',
      render: (_, record) => {
        return record.isTaxRate === 1
          ? `${intl.formatMessage({
              id: 'balance.accountsReceivable.invoice.columns.tax.yes',
            })}/${priceFormat(record.taxRate * 100)}%`
          : intl.formatMessage({
              id: 'balance.accountsReceivable.invoice.columns.tax.none',
            })
      },
    },
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.orderAmount',
      }),
      dataIndex: 'reconciliationMoneyAmount',
      render: (text, record) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.invoiceStatus',
      }),
      dataIndex: 'invoiceStatus',
      filters: [
        {
          text: intl.formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.invoiceStatus.0',
          }),
          value: 0,
        },
        {
          text: intl.formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.invoiceStatus.1',
          }),
          value: 1,
        },
        {
          text: intl.formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.invoiceStatus.2',
          }),
          value: 2,
        },
      ],
      onFilter: (value: number, record: any) => record.invoiceStatus == value,
      render: (_, record) => {
        return (
          <div>
            <StatusTag
              title={record.invoiceStatusName}
              type={{ 0: 'warning', 1: 'success', 2: 'active' }[record.invoiceStatus]}
            />
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.operation',
      }),
      fixed: 'right',
      width: 120,
      render: (text, record) => [
        record.invoiceStatus !== 1 && (
          <Link
            to={`/balance/invoice/manage/add?reconciliationId=${record.reconciliationId}`}
            style={{ marginRight: 8 }}
          >
            {intl.formatMessage({
              id: 'balance.accountsReceivable.invoice.columns.operation.2',
            })}
          </Link>
        ),
        record.invoiceStatus !== 0 && (
          <Link to={`/balance/invoice/inquire?reconciliationNo=${record.reconciliationNo}`}>
            {intl.formatMessage({
              id: 'balance.accountsReceivable.invoice.columns.operation.1',
            })}
          </Link>
        ),
      ],
    },
  ]

  return (
    <PageHeaderWrapper>
      <Card className="white_bg_card">
        <StandardTable
          tableProps={{
            rowKey: 'reconciliationId',
            scroll: {
              x: 1200,
            },
          }}
          columns={columns as any}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              components={{
                RangePicker,
              }}
              actions={formActions}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'megaLayout.reconciliationNo', FORM_FILTER_PATH)
                useAsyncSelect(
                  'invoiceStatus',
                  fetchInvoiceOptions(getSettlementMemberSettlementAccountStatementTobeInvoiceListStatus),
                )
              }}
              schema={schema}
              onSubmit={handleSearch}
              initialValues={{}}
              onReset={() => {
                formActions.setFieldValue('createTimeStart', null)
                formActions.setFieldValue('createTimeEnd', null)
              }}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default SettlementList
