/**
 * 开票管理（SRM）
 */
import React, { useRef, useState } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Button, DatePicker, Space, message, Modal } from 'antd'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { schema } from './schema'
import { priceFormat } from '@/utils/numberFomat'
import StatusTag from '../components/StatusTag'
import {
  getSettlementMemberSettlementAccountStatementInvoiceList,
  postSettlementMemberSettlementAccountStatementSubmit,
  postSettlementMemberSettlementAccountStatementDelete,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import './index.less'
import { PlusCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import TableOperation from '@/components/TableOperation'

const intl = getIntl()
const RangePicker = DatePicker.RangePicker
const formActions = createFormActions()

const InvoiceManage: React.FC = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const [pageLoading, setPageLoading] = useState<boolean>(false)

  /**
   * @param params
   */
  const fetchListData = async (params) => {
    setPageLoading(true)
    const searchParams = {
      ...params,
      orderByCode: 1,
    }
    const { data } = await getSettlementMemberSettlementAccountStatementInvoiceList(searchParams)
    setPageLoading(false)
    return data
  }

  /**
   * 搜索
   */
  const handleSearch = (values) => {
    ref.current.reload({
      ...values,
      invoiceStartDate: values?.invoiceStartDate ? values?.invoiceStartDate.format('YYYY-MM-DD HH:mm:ss') : undefined,
      invoiceEndDate: values?.invoiceEndDate ? values?.invoiceEndDate.format('YYYY-MM-DD HH:mm:ss') : undefined,
    })
  }

  /** 提交开票数据 */
  const handleSubmit = async (record) => {
    const res = await postSettlementMemberSettlementAccountStatementSubmit({ id: record.id })
    if (res.code === 1000) {
      ref.current && ref.current.reloadCurrent()
    }
  }

  /** 删除发票 */
  const handleDelete = async (record) => {
    Modal.confirm({
      content: '是否确认删除发票？',
      centered: true,
      onOk: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await postSettlementMemberSettlementAccountStatementDelete({ invoiceId: record.id })
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

  /** 跳转到编辑页面 */
  const handleEdit = (record) => {
    history.push(`/balance/invoice/manage/edit?reconciliationId=${record.reconciliationId}&id=${record.id}`)
  }

  const renderOptionButton = (record) => {
    // 按钮权限code和操作字符映射
    const btnAuthOfOperationTextMap = {
      [intl.formatMessage({ id: 'balance.invoice.manage.buttonGroup.1', defaultMessage: '提交' })]: 'submit',
      [intl.formatMessage({ id: 'balance.invoice.manage.buttonGroup.2', defaultMessage: '编辑' })]: 'edit',
      [intl.formatMessage({ id: 'balance.invoice.manage.buttonGroup.3', defaultMessage: '删除' })]: 'delete',
    }

    const buttonGroup = {
      [intl.formatMessage({ id: 'balance.invoice.manage.buttonGroup.1', defaultMessage: '提交' })]:
        record.examineStatus === 0,
      [intl.formatMessage({ id: 'balance.invoice.manage.buttonGroup.2', defaultMessage: '编辑' })]: [0, 3].includes(
        record.examineStatus,
      ),
      [intl.formatMessage({ id: 'balance.invoice.manage.buttonGroup.3', defaultMessage: '删除' })]: [0, 3].includes(
        record.examineStatus,
      ),
    }

    const operationHandler = {
      [intl.formatMessage({ id: 'balance.invoice.manage.buttonGroup.1', defaultMessage: '提交' })]: () =>
        handleSubmit(record),
      [intl.formatMessage({ id: 'balance.invoice.manage.buttonGroup.2', defaultMessage: '编辑' })]: () =>
        handleEdit(record),
      [intl.formatMessage({ id: 'balance.invoice.manage.buttonGroup.3', defaultMessage: '删除' })]: () =>
        handleDelete(record),
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
      `/balance/businessReconciliation/search/detail?id=${record.reconciliationId}&no=${record.reconciliationNo}`,
    )
  }

  const columns = [
    {
      title: intl.formatMessage({
        id: 'balance.common.columns.productNoticecolumns.orderNo',
      }),
      dataIndex: 'reconciliationNo',
      width: 150,
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
      width: 160,
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
      render: (invoiceDate) => moment(invoiceDate).format('YYYY-MM-DD'),
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
      render: (_, record) => {
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

  const clickAdd = () => {
    history.push('/balance/invoice/manage/add')
  }

  const controllerBtns = (
    <Space>
      <AuthButton type="add" code="invoice.srm.add">
        <Button icon={<PlusCircleOutlined />} type="primary" onClick={clickAdd}>
          {intl.formatMessage({
            id: 'purchaseRequisition.xinjian',
            defaultMessage: '新建',
          })}
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
          loading={pageLoading}
          columns={columns as any}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              components={{
                RangePicker,
              }}
              expressionScope={{
                controllerBtns,
              }}
              actions={formActions}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'megaLayout.reconciliationNo', FORM_FILTER_PATH)
              }}
              schema={schema}
              onSubmit={handleSearch}
              initialValues={{}}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default InvoiceManage
