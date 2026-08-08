/**
 * 开票查询（SRM）
 */
import React, { useRef } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Button, DatePicker, Space, Badge, Drawer, message } from 'antd'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { schema } from './schema'
import StatusTag from '../components/StatusTag'
import { fetchInvoiceOptions } from '../../common'
import { priceFormat } from '@/utils/numberFomat'
import {
  getSettlementMemberSettlementAccountStatementInvoiceListStatus,
  getSettlementMemberSettlementAccountStatementInvoiceList,
  postSettlementMemberSettlementAccountStatementTobeExport,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import './index.less'
import moment from 'moment'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { downFileByBuffer } from '@/utils/index'

const intl = getIntl()
const RangePicker = DatePicker.RangePicker
const formActions = createFormActions()

const InvoiceInquire: React.FC = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { reconciliationNo } = usePageStatus()
  const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'
  const [selectRow, selectRowFns] = useRowSelectionTable({ customKey: 'id' })

  /**
   * @param params
   */
  const fetchListData = async (params) => {
    const searchParams = {
      ...params,
      orderByCode: 2,
    }

    if (reconciliationNo) {
      searchParams.reconciliationNo = reconciliationNo
    }
    const { data } = await getSettlementMemberSettlementAccountStatementInvoiceList(searchParams)
    return data
  }

  /**
   * 搜索
   */
  const handleSearch = (values) => {
    ref.current.reload({
      ...values,
      invoiceStartDate: values?.invoiceStartDate ? values?.invoiceStartDate.format(DATE_FORMAT) : undefined,
      invoiceEndDate: values?.invoiceEndDate ? values?.invoiceEndDate.format(DATE_FORMAT) : undefined,
    })
  }

  const _handleOrderNo = (record) => {
    history.push(
      `/balance/businessReconciliation/search/detail?id=${record.reconciliationId}&no=${record.reconciliationNo}`,
    )
  }
  /* 导出 */
  const handleExport = () => {
    const { selectedRowKeys = [], setSelectedRowKeys, setSelectRow } = selectRowFns
    if (selectedRowKeys.length > 5000) {
      message.warning(intl.formatMessage({ id: 'balance.export.quantity.limit' }))
      return
    }
    postSettlementMemberSettlementAccountStatementTobeExport(
      { ids: selectedRowKeys },
      { responseType: 'blob', getResponse: true },
    ).then((res: any) => {
      const { data, response } = res
      if (response.status == 200) {
        const suffixName = response.headers.get('content-disposition').split('.')[1]
        const fileName = `${moment().format('YYYYMMDD')}发票.${suffixName}`
        downFileByBuffer(data, fileName)
        ref.current.reloadCurrent()
        setSelectedRowKeys([])
        setSelectRow([])
      }
    })
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
    },
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.payer',
      }),
      dataIndex: 'payer',
    },
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.code',
      }),
      dataIndex: 'code',
    },
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.number',
      }),
      dataIndex: 'number',
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            history.push(`/balance/invoice/manage/detail?reconciliationId=${record.reconciliationId}&id=${record.id}`)
          }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.invoiceDate',
      }),
      dataIndex: 'invoiceDate',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.invoiceAmount',
      }),
      dataIndex: 'invoiceAmount',
      render: (text) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.examineStatus',
      }),
      dataIndex: 'examineStatus',
      filters: [
        {
          text: intl.formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.examineStatus.0',
          }),
          value: 0,
        },
        {
          text: intl.formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.examineStatus.1',
          }),
          value: 1,
        },
        {
          text: intl.formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.examineStatus.2',
          }),
          value: 2,
        },
        {
          text: intl.formatMessage({
            id: 'balance.accountsReceivable.invoice.columns.examineStatus.3',
          }),
          value: 3,
        },
      ],
      onFilter: (value: number, record: any) => record.examineStatus == value,
      render: (text, record) => {
        return (
          <StatusTag
            title={record.examineStatusName}
            status={record.examineStatus}
            colorMap={{
              0: '#ACAFB3',
              1: '#4787F0',
              2: '#00A98F',
              3: '#E34D59',
            }}
          />
        )
      },
    },
  ]

  const controllerBtns = (
    <Space>
      <AuthButton type="custom" code="export">
        <Button disabled={!selectRow.selectedRowKeys?.length} onClick={handleExport}>
          {intl.formatMessage({ id: 'balance.batch.export.btn' })}
        </Button>
      </AuthButton>
    </Space>
  )

  return (
    <PageHeaderWrapper>
      <Card className="white_bg_card">
        <StandardTable
          tableProps={{
            rowKey: 'id',
            scroll: {
              x: 1200,
            },
          }}
          rowSelection={selectRow}
          columns={columns as any}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              components={{
                RangePicker,
                controllerBtns: () => controllerBtns,
              }}
              initialValues={{}}
              actions={formActions}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'megaLayout.reconciliationNo', FORM_FILTER_PATH)
                useAsyncSelect(
                  'examineStatus',
                  fetchInvoiceOptions(getSettlementMemberSettlementAccountStatementInvoiceListStatus),
                )
              }}
              schema={schema}
              onSubmit={handleSearch}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default InvoiceInquire
