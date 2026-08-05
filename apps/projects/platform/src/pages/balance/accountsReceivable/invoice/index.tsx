import React, { useRef, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Button, DatePicker, Space, Badge, Drawer, message } from 'antd'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { schema } from './schema'
// import InvoiceCreate from '../../components/InvoiceCreate'
// import StatusTag from '../../components/StatusTag';
import StatusTag, { STATUS_TYPE } from '@/components/StatusTag'
import { fetchOptions } from '../../common'
import useSetSearchValueInTable from '@/hooks/useSetSearchValueInTable'
import { numFormat, priceFormat } from '@/utils/numberFomat'
import {
  getSettlementCommonGetPayStatus,
  getSettlementCommonGetReceiptInvoiceStatus,
  getSettlementMemberSettlementGetInvoiceProveDetail,
  GetSettlementMemberSettlementGetInvoiceProveDetailResponse,
  getSettlementMemberSettlementGetReturnInvoiceProveDetail,
  GetSettlementMemberSettlementGetReturnInvoiceProveDetailResponse,
  getSettlementMemberSettlementPageReceiptInvoice,
  GetSettlementMemberSettlementPageReceiptInvoiceResponseDetail,
  postSettlementMemberSettlementInvoiceByReturn,
  postSettlementMemberSettlementInvoiceProve,
  postSettlementMemberSettlementGenerateBatchInvoiceProve,
  postSettlementMemberSettlementBatchInvoiceProve,
} from '@apps/apis'
// import { ColumnType } from 'antd/lib/table';
import InvoiceDrawerInfo from '../../components/InvoiceCreate/invoiceDrawerInfo'
import { AuthButton } from '@apps/components'
import { history } from '@linkseeks/router-manager'
const RangePicker = DatePicker.RangePicker
const formActions = createFormActions()

const SettlementList: React.FC = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const [visible, setVisible] = useState(false)
  const [activeData, setActiveData] = useState<GetSettlementMemberSettlementPageReceiptInvoiceResponseDetail>(null)
  const { searchData, formatInitialValue } = useSetSearchValueInTable()
  const [invoiceInfo, setInvoiceInfo] = useState<any>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  /**
   * 获取开票管理列表
   * @param params
   */
  const fetchListData = async (params) => {
    const searchParams = {
      ...params,
      invoiceStatus: params?.invoiceStatus || 2,
      payStatus: params?.payStatus || 2,
      ...searchData,
    }
    const { data } = await getSettlementMemberSettlementPageReceiptInvoice(searchParams)
    return data
  }

  /**
   * 搜索
   */
  const handleSearch = (values) => {
    const format = 'YYYY-MM-DD'
    const payStartTime = values.payStartTime?.format(format)
    const payEndTime = values.payEndTime ? values.payEndTime.endOf('day').format('YYYY-MM-DD HH:mm:ss') : ''
    const orderStartTime = values.orderStartTime?.format(format)
    const orderEndTime = values.orderEndTime ? values.orderEndTime.endOf('day').format('YYYY-MM-DD HH:mm:ss') : ''
    ref.current.reload({ ...values, payStartTime, payEndTime, orderStartTime, orderEndTime })
  }

  const handleShow = async (record: GetSettlementMemberSettlementPageReceiptInvoiceResponseDetail) => {
    // (document.body.parentNode as HTMLBodyElement).style.overflowY = "hidden";
    setActiveData(record)
    const hide = message.loading(intl.formatMessage({ id: 'balance.zhengzaijiazaizhong' }), 0)
    /** 退货类型 */
    const service =
      record.settlementOrderType === 5
        ? getSettlementMemberSettlementGetReturnInvoiceProveDetail
        : getSettlementMemberSettlementGetInvoiceProveDetail

    const { code, data, message: msg } = await service({ id: record.id.toString() })
    hide()
    if (code !== 1000) {
      message.error(msg)
      return
    }
    if (record.settlementOrderType === 5) {
      if ((data as GetSettlementMemberSettlementGetReturnInvoiceProveDetailResponse).length === 0) {
        message.error(intl.formatMessage({ id: 'balance.wufapiaoxinxi' }))
        return
      }
      setVisible(true)
      setInvoiceInfo(data)
      return
    }
    setVisible(true)
    setInvoiceInfo([data as GetSettlementMemberSettlementGetInvoiceProveDetailResponse])
  }

  const handleOnCancel = () => {
    // (document.body.parentNode as HTMLBodyElement).style.overflowY = "auto";
    setVisible(false)
    setActiveData(null)
  }

  const handleForm = async (value) => {
    const keys = Object.keys(value)
    if (keys.length === 0) {
      message.error({
        content: intl.formatMessage({ id: 'balance.qingtianjiafapiaoxinxi' }),
      })
      return
    }
    let res = {}
    keys.forEach((item) => {
      const array = value[item]
      res[item] = array
    })
    /** 批量开票 */
    if (invoiceInfo?.[0]?.receiptInvoiceIds?.length > 0) {
      const _postData = { ...invoiceInfo[0], proveList: res[`list-0`] }
      setSubmitLoading(true)
      postSettlementMemberSettlementBatchInvoiceProve(_postData)
        .then((res) => {
          if (res.code === 1000) {
            setSelectedRows([])
            setSelectedRowKeys([])
            formActions.submit()
            setVisible(false)
            setSubmitLoading(false)
          }
        })
        .catch(() => {
          setSubmitLoading(false)
        })
      return
    }
    /** 退货类型 */
    if (activeData.settlementOrderType === 5) {
      const postDataList = {
        receiptInvoiceId: activeData.id,
        addList: invoiceInfo.map((_item, key) => {
          const { kindName, typeName, ...rest } = _item

          return {
            ...rest,
            proveList: res[`list-${key}`],
          }
        }),
      }
      setSubmitLoading(true)
      const { data, code, message: msg } = await postSettlementMemberSettlementInvoiceByReturn(postDataList)
      setSubmitLoading(false)
      if (code !== 1000) {
        // message.error(intl.formatMessage({ id: `responseCode.${code}` }));
        return
      }
      formActions.submit()
      setVisible(false)
      return
    }
    /** 普通发票开具 */
    const { kindName, typeName, ...rest } = invoiceInfo[0]
    const defaultPostData = {
      receiptInvoiceId: activeData.id,
      ...rest,
      proveList: res[`list-0`],
    }
    setSubmitLoading(true)
    const { data, code, message: msg } = await postSettlementMemberSettlementInvoiceProve(defaultPostData)
    setSubmitLoading(false)
    if (code === 1000) {
      formActions.submit()
      setVisible(false)
    }
  }

  const _handleOrderNo = (record) => {
    switch (record.settlementOrderType) {
      // 生产单
      case 1:
        history.open(`/balance/accountsPayable/settlementList/productNoticeSettlementDetail?id=${record.dataId}`)
        break
      // 物流单
      case 2:
        history.open(`/balance/accountsPayable/settlementList/logisticsDetail?id=${record.dataId}`)
        break
      // 订单
      case 3:
      case 4:
        history.open(`/orderAbility/saleOrder/orderList/detail?orderNo=${record.orderNo}`)
        break
      // 退货
      case 5:
        history.open(`/afterAbility/returnManage/returnQuery/detail?id=${record.dataId}`)
        break
      // 请款单
      case 6:
      case 7:
        history.open(
          `/balance/businessRequestFundsCollaboration/search/detail?id=${record.dataId}&no=${record.orderNo}`,
        )
        break
      // case 7:
      //   history.open(`/balance/businessReconciliation/search/preview?id=${record.dataId}&no=${record.orderNo}`)
      //   break;
      default:
        break
    }
  }

  const columns = [
    {
      title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.orderNo' }),
      dataIndex: 'orderNo',
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
      title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.orderAbstract' }),
      dataIndex: 'orderAbstract',
    },
    {
      title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.settlementOrderTypeName' }),
      dataIndex: 'settlementOrderTypeName',
    },
    {
      title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.orderTime' }),
      dataIndex: 'orderTime',
    },
    {
      title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.orderTypeName' }),
      dataIndex: 'orderTypeName',
    },
    {
      title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.tax' }),
      dataIndex: 'tax',
      render: (text, record) => {
        return record.isHasTax
          ? `${record.isHasTaxName}/${priceFormat(record.taxRate * 100)}%`
          : intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.tax.none' })
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.orderAmount' }),
      dataIndex: 'orderAmount',
      render: (text, record) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.batch' }),
      dataIndex: 'batch',
      render: (text, record) =>
        record.batch
          ? intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.batch.1', data: record.batch })
          : '',
    },
    {
      title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.payNode' }),
      dataIndex: 'payNode',
    },
    {
      title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.payAmount' }),
      dataIndex: 'payAmount',
      render: (text) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    { title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.payTime' }), dataIndex: 'payTime' },
    {
      title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.invoiceStatus' }),
      dataIndex: 'invoiceStatus',
      filters: [
        { text: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.invoiceStatus.0' }), value: 0 },
        { text: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.invoiceStatus.1' }), value: 1 },
      ],
      onFilter: (value: number, record: any) => record.invoiceStatus == value,
      render: (text, record) => {
        return (
          <div>
            <StatusTag title={record.invoiceStatusName} type={record.invoiceStatus === 0 ? 'warning' : 'success'} />
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.status' }),
      dataIndex: 'status',
      filters: [
        {
          text: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.status.1' }),
          value: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.status.1' }),
        },
        {
          text: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.status.2' }),
          value: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.status.2' }),
        },
      ],
      onFilter: (value: number, record: any) => record.payStatusName == value,
      render: (text, record) => {
        const color =
          record.payStatusName == intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.status.2' })
            ? 'green'
            : '#C0C4CC'
        return <Badge color={color} text={record.payStatusName} />
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.operation' }),
      render: (text, record) => {
        return (
          <a onClick={() => handleShow(record)}>
            {record.invoiceStatus == 1
              ? intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.operation.1' })
              : intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.operation.2' })}
          </a>
        )
      },
    },
  ]

  const handleSelectChange = (record, selected, selectedRow, nativeEvent) => {
    let childArr = [...selectedRowKeys]
    let childRowArr = [...selectedRows]
    if (selected) {
      childArr.push(record.id)
      childRowArr.push(record)
    } else {
      childArr.splice(
        childArr.findIndex((item) => item === record.id),
        1,
      )
      childRowArr.splice(
        childRowArr.findIndex((item) => item.id === record.id),
        1,
      )
    }
    setSelectedRowKeys(childArr)
    setSelectedRows(childRowArr)
  }

  const handleSelectAll = (selected, selectedRow, changeRows) => {
    let childArr = [...selectedRowKeys]
    let childRowArr = [...selectedRows]
    if (selected) {
      childArr = Array.from(new Set([...childArr, ...changeRows.map((item) => item.id)]))
      childRowArr = Array.from(new Set([...childRowArr, ...changeRows]))
    } else {
      childArr = childArr.filter((item) => !changeRows.some((e) => e.id === item))
      childRowArr = childRowArr.filter((item) => !changeRows.some((e) => e.id === item.id))
    }
    setSelectedRowKeys(childArr)
    setSelectedRows(childRowArr)
  }

  const _handleBatchInvoiceProve = () => {
    if (selectedRowKeys.length <= 0) {
      message.error(intl.formatMessage({ id: 'balance.accountsReceivable.invoice.message.1' }))
      return false
    }
    let _flag = true
    for (let i = 0; i < selectedRows.length; i++) {
      const _child = selectedRows[i]
      if (_child.taxRate !== selectedRows[0].taxRate) {
        _flag = false
        break
      }
    }
    if (!_flag) {
      message.error(intl.formatMessage({ id: 'balance.accountsReceivable.invoice.message.2' }))
      return false
    }
    postSettlementMemberSettlementGenerateBatchInvoiceProve({ receiptInvoiceIds: selectedRowKeys }).then((res) => {
      if (res.code === 1000) {
        setVisible(true)
        setActiveData(selectedRows[0])
        setInvoiceInfo([res.data as GetSettlementMemberSettlementGetInvoiceProveDetailResponse])
      }
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onSelect: handleSelectChange,
            onSelectAll: handleSelectAll,
          }}
          columns={columns as any}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              components={{
                RangePicker,
                exportBtn: () => (
                  <Space>
                    <Button onClick={_handleBatchInvoiceProve}>
                      {intl.formatMessage({ id: 'balance.accountsReceivable.invoice.exportBtn.2' })}
                    </Button>
                    {/* <Button>{intl.formatMessage({ id: 'balance.accountsReceivable.invoice.exportBtn' })}</Button> */}
                  </Space>
                ),
              }}
              actions={formActions}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'megaLayout.topLayout.orderNo', FORM_FILTER_PATH)
                useAsyncSelect('invoiceStatus', fetchOptions(getSettlementCommonGetReceiptInvoiceStatus))
                // 单据类型
                useAsyncSelect('payStatus', fetchOptions(getSettlementCommonGetPayStatus))
              }}
              schema={schema}
              onSubmit={handleSearch}
              onReset={() => {
                formActions.setFieldValue('payStartTime', null)
                formActions.setFieldValue('payEndTime', null)
                formActions.setFieldValue('orderStartTime', null)
                formActions.setFieldValue('orderEndTime', null)
              }}
              {...formatInitialValue}
            />
          }
        />
      </Card>
      <InvoiceDrawerInfo
        mode={activeData?.invoiceStatus === 0 ? 'edit' : 'view'}
        visible={visible}
        invoiceInfoData={invoiceInfo}
        onCancel={handleOnCancel}
        onSubmit={handleForm}
        onSubmitLoading={submitLoading}
      />
    </PageHeaderWrapper>
  )
}

export default SettlementList
