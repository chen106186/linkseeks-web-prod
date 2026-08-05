/**
 * 发票协同-发票查询(SRM)
 */
import React, { useRef, useState } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Button, DatePicker, Modal, Space, message } from 'antd'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { refuseSchema, schema } from './schema'
import StatusTag from '../components/StatusTag'
import { fetchInvoiceOptions } from '../../common'
import useSetSearchValueInTable from '@/hooks/useSetSearchValueInTable'
import { priceFormat } from '@/utils/numberFomat'
import {
  getSettlementMemberSettlementAccountStatementCoordinationInvoiceListStatus,
  getSettlementMemberSettlementAccountStatementCoordinationInvoiceList,
  postSettlementMemberSettlementAccountStatementCoordinationInvoiceConfirm,
  postSettlementMemberSettlementAccountStatementCoordinationInvoiceReturn,
  postSettlementMemberSettlementAccountStatementCoordinationExport,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import './index.less'
import moment from 'moment'
import TableOperation from '@/components/TableOperation'
import ModalForm from '@/components/ModalForm'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { downFileByBuffer } from '@/utils/index'

const intl = getIntl()
const RangePicker = DatePicker.RangePicker
const formActions = createFormActions()
const refuseActions = createFormActions()

const InvoiceJoint: React.FC = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { searchData, formatInitialValue } = useSetSearchValueInTable()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const refuseModalRef = useRef<any>({})
  const [selectRow, selectRowFns] = useRowSelectionTable({ customKey: 'id' })
  /**
   * @param params
   */
  const fetchListData = async (params) => {
    const searchParams = {
      ...params,
      ...searchData,
      orderByCode: 2,
    }
    const { data } = await getSettlementMemberSettlementAccountStatementCoordinationInvoiceList(searchParams)
    return data
  }

  /**
   * 搜索
   */
  const handleSearch = (values) => {
    const DATE_FORMAT = 'YYYY-MM-DD'
    ref.current.reload({
      ...values,
      startTime: values?.startTime ? values?.startTime.format(DATE_FORMAT) : undefined,
      endTime: values?.endTime ? values?.endTime.format(DATE_FORMAT) : undefined,
    })
  }

  const handleConfirm = (record) => {
    Modal.confirm({
      content: '是否确认发票？',
      centered: true,
      onOk: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await postSettlementMemberSettlementAccountStatementCoordinationInvoiceConfirm({
              id: record.id,
            })
            if (res.code === 1000) {
              ref.current && ref.current.reloadCurrent()
              resolve(true)
            } else {
              reject()
            }
          } catch (error) {
            reject()
          }
        })
      },
    })
  }

  const handleRefuseModal = (record) => {
    refuseModalRef.current?.setVisible(true)
    refuseActions.clearErrors()
    refuseActions.setFieldValue('reconciliationId', record.reconciliationId)
    refuseActions.setFieldValue('invoiceId', record.id)
  }

  const handleRefuse = async () => {
    refuseActions.submit().then(async ({ values }) => {
      const params = {
        reconciliationId: values.reconciliationId,
        invoiceId: values.invoiceId,
        returnTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        returnSource: values.returnSource,
      }
      setConfirmLoading(true)
      try {
        const res = await postSettlementMemberSettlementAccountStatementCoordinationInvoiceReturn(params)
        if (res.code === 1000) {
          refuseModalRef.current?.setVisible(false)
          ref.current && ref.current.reloadCurrent()
        }
        setConfirmLoading(false)
      } catch (error) {
        setConfirmLoading(false)
      }
    })
  }

  const renderOptionButton = (record) => {
    // 按钮权限code和操作字符映射
    const btnAuthOfOperationTextMap = {
      [intl.formatMessage({ id: 'balance.invoice.joint.buttonGroup.1', defaultMessage: '确认' })]: 'confirm',
      [intl.formatMessage({ id: 'balance.invoice.joint.buttonGroup.2', defaultMessage: '退回' })]: 'return',
    }

    const buttonGroup = {
      [intl.formatMessage({ id: 'balance.invoice.joint.buttonGroup.1', defaultMessage: '确认' })]:
        record.examineStatus === 1,
      [intl.formatMessage({ id: 'balance.invoice.joint.buttonGroup.2', defaultMessage: '退回' })]:
        record.examineStatus === 1,
    }

    const operationHandler = {
      [intl.formatMessage({ id: 'balance.invoice.joint.buttonGroup.1', defaultMessage: '确认' })]: () =>
        handleConfirm(record),
      [intl.formatMessage({ id: 'balance.invoice.joint.buttonGroup.2', defaultMessage: '退回' })]: () =>
        handleRefuseModal(record),
    }

    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        // menuCode="commodityAbility"
        buttonPermissionsMap={btnAuthOfOperationTextMap}
      />
    )
  }

  const _handleOrderNo = (record) => {
    history.push(
      `/balance/businessReconciliationCollaboration/search/preview?id=${record.reconciliationId}&no=${record.reconciliationNo}`,
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
            history.push(
              `/balance/invoiceJoint/joint/detail?reconciliationId=${record.reconciliationId}&id=${record.id}`,
            )
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
        id: 'balance.accountsReceivable.invoice.columns.invoiceTitle',
      }),
      dataIndex: 'invoiceTitle',
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
    {
      title: intl.formatMessage({
        id: 'balance.accountsReceivable.invoice.columns.operation',
      }),
      fixed: 'right',
      width: 120,
      render: (_, record) => renderOptionButton(record),
    },
  ]

  /* 导出 */
  const handleExport = () => {
    const { selectedRowKeys = [], setSelectedRowKeys, setSelectRow } = selectRowFns
    if (selectedRowKeys.length > 5000) {
      message.warning(intl.formatMessage({ id: 'balance.export.quantity.limit' }))
      return
    }
    postSettlementMemberSettlementAccountStatementCoordinationExport(
      { ids: selectedRowKeys },
      { responseType: 'blob', getResponse: true },
    ).then((res: any) => {
      const { response } = res
      if (response.status == 200) {
        const suffixName = response.headers.get('content-disposition').split('.')[1]
        const fileName = `${moment().format('YYYYMMDD')}发票.${suffixName}`
        downFileByBuffer(response.data, fileName)
        ref.current.reloadCurrent()
        setSelectedRowKeys([])
        setSelectRow([])
      }
    })
  }

  const controllerBtns = (
    <Space>
      <AuthButton type="custom" code="export">
        <Button disabled={!selectRow.selectedRowKeys.length} onClick={handleExport}>
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
              actions={formActions}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'megaLayout.reconciliationNo', FORM_FILTER_PATH)
                useAsyncSelect(
                  'examineStatus',
                  fetchInvoiceOptions(getSettlementMemberSettlementAccountStatementCoordinationInvoiceListStatus),
                )
              }}
              schema={schema}
              onSubmit={handleSearch}
              onReset={() => {
                formActions.setFieldValue('startTime', null)
                formActions.setFieldValue('endTime', null)
              }}
              {...formatInitialValue}
            />
          }
        />
      </Card>
      <ModalForm
        modalTitle="退回原因"
        width={450}
        currentRef={refuseModalRef}
        actions={refuseActions}
        modalProps={{
          centered: true,
          confirmLoading,
        }}
        previewPlaceholder=" "
        schema={refuseSchema}
        initialValues={{}}
        confirm={handleRefuse}
        cancel={() => {
          refuseActions.reset()
          refuseModalRef.current?.setVisible(false)
        }}
      />
    </PageHeaderWrapper>
  )
}

export default InvoiceJoint
