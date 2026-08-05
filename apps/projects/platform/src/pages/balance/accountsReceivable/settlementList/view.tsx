import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { Card, DatePicker, Modal, Space, Button, Row, Col, message } from 'antd'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
// import StandardTable  from './StandardTable';
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { schema } from './schema'
import { fetchOptions } from '../../common'
import Voucher from '../../components/Voucher'
import ConfirmAccount from '../../components/ConfirmAccount'
import useSetSearchValueInTable from '@/hooks/useSetSearchValueInTable'
import moment, { Moment } from 'moment'
import {
  getSettlementCommonGetSettlementOrderType,
  getSettlementCommonGetSettlementStatus,
  getSettlementMemberSettlementGetReceivablePayProve,
  getSettlementMemberSettlementPageReceivableSettlement,
  postSettlementMemberSettlementConfirmAccountComplete,
  postSettlementMemberSettlementConfirmPayProve,
  postSettlementMemberSettlementVendorReceivableSettlementExport,
  postSettlementMemberSettlementBatchConfirmPayProve,
  postSettlementMemberSettlementBatchConfirmAccountComplete,
  getSettlementCommonGetExportFlag,
} from '@apps/apis'
import useHandleSettlementList from './hooks/useHandleSettlementList'
import ViewUniversalPay from '../../components/ViewUniversalPay'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { downFileByBuffer } from '@/utils/index'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { AuthButton } from '@apps/components'

const { RangePicker } = DatePicker

const formActions = createFormActions()

type requestDataType = {
  status: number
  orderType: string | number
  startTime?: Moment
  endTime?: Moment
  prePayStartTime: Moment
  prePayEndTime: Moment
  payStartTime?: Moment
  payEndTime?: Moment
  settlementName: string
  payName: string
  settlementNo: number
  current: number
  pageSize: number
}

const SettlementList = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { searchData, formatInitialValue, clear } = useSetSearchValueInTable()
  const [files, setFiles] = useState<any>([])
  const { columns, modals, itemInfo, handleClose, handleOpen } = useHandleSettlementList()
  const [selectRow, selectRowFns] = useRowSelectionTable({ customKey: 'id' })
  const universalPayInfo = useMemo(
    () => ({
      name: itemInfo.settlementName,
      amount: itemInfo.amount,
      statusName: itemInfo.statusName,
      payWayName: intl.formatMessage({ id: 'balance.tonglianzhifu' }),
      settlementDate: itemInfo.settlementDate,
    }),
    [itemInfo],
  )

  const fetchListData = async (params: requestDataType) => {
    const searchParams = {
      ...searchData,
      ...params,
    }
    const postData = {
      ...searchParams,
      status: searchParams.status || '0',
      orderType: searchParams.orderType || '0',
    }
    const { data } = await getSettlementMemberSettlementPageReceivableSettlement(postData as any)
    return data
  }

  /**
   * 确认对账完成
   */
  const handleConfirm = async (params: { id: number }) => {
    const { code, data } = await postSettlementMemberSettlementConfirmAccountComplete({ settlementId: params.id })
    if (code === 1000) {
      // reconciliationOnCancel();
      handleClose('confirmReconciliation')
      formActions.submit()
    }
  }

  /**
   * 确认付款凭证
   */
  const handleConfirmPayStatus = async (params: { status: 0 | 1; id: number }) => {
    const { code } = await postSettlementMemberSettlementConfirmPayProve({ id: params.id, status: params.status })
    if (code) {
      // confirmPayOnCancel();
      handleClose('confirmPay')
      formActions.submit()
    }
  }
  const fetchVouchers = useCallback(async (id: number) => {
    const { code, data } = await getSettlementMemberSettlementGetReceivablePayProve({ id: id.toString() })
    if (code === 1000) {
      setFiles(data)
    }
  }, [])

  useEffect(() => {
    if (itemInfo !== null && (itemInfo.status === 4 || itemInfo.status === 3)) {
      fetchVouchers(itemInfo.id)
    }
  }, [itemInfo])

  /**
   * 搜索
   */
  const handleSearch = (values: requestDataType) => {
    const format = 'YYYY-MM-DD'
    const { payStartTime, payEndTime, prePayStartTime, prePayEndTime, ...rest } = values
    const startTime = values.startTime?.format(format)
    const endTime = values.endTime ? values.endTime.endOf('day').format('YYYY-MM-DD HH:mm:ss') : ''
    const withPayStartTime = payStartTime
      ? { payStartTime: payStartTime.unix() + '000', payEndTime: payEndTime.unix() + '999' }
      : {}
    const withPrePayEndTime = prePayStartTime
      ? { prePayStartTime: prePayStartTime.unix() + '000', prePayEndTime: prePayEndTime.unix() + '999' }
      : {}
    ref.current.reload({ ...rest, startTime, endTime, ...withPayStartTime, ...withPrePayEndTime })
  }
  /* 批量确认对账 */
  const handleConfirmReconciliation = () => {
    const { selectedRowKeys = [], selectRow = [], setSelectedRowKeys, setSelectRow } = selectRowFns
    const flag = selectRow.every((item) => item.status == 1)
    if (!flag) {
      message.warning(intl.formatMessage({ id: 'balance.batch.confirm.reconciliation.limit' }))
      return
    }
    Modal.confirm({
      title: intl.formatMessage({ id: 'balance.confirm.tips' }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({ id: 'balance.batch.confirm.reconciliation.content' }),
      okText: intl.formatMessage({ id: 'balance.confirm.ok' }),
      cancelText: intl.formatMessage({ id: 'balance.confirm.cancel' }),
      onOk() {
        postSettlementMemberSettlementBatchConfirmAccountComplete({ settlementIds: selectedRowKeys }).then((res) => {
          if (res.code === 1000) {
            ref.current.reloadCurrent()
            setSelectedRowKeys([])
            setSelectRow([])
          }
        })
      },
      onCancel() {},
    })
  }

  /* 批量确认收款 */
  const handleConfirmReceipt = () => {
    const { selectedRowKeys = [], selectRow = [], setSelectedRowKeys, setSelectRow } = selectRowFns
    const flag = selectRow.every((item) => item.status == 3)
    if (!flag) {
      message.warning(intl.formatMessage({ id: 'balance.batch.confirm.receipt.limit' }))
      return
    }
    Modal.confirm({
      title: intl.formatMessage({ id: 'balance.confirm.tips' }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({ id: 'balance.batch.confirm.receipt.content' }),
      okText: intl.formatMessage({ id: 'balance.confirm.ok' }),
      cancelText: intl.formatMessage({ id: 'balance.confirm.cancel' }),
      onOk() {
        postSettlementMemberSettlementBatchConfirmPayProve({ ids: selectedRowKeys }).then((res) => {
          if (res.code === 1000) {
            ref.current.reloadCurrent()
            setSelectedRowKeys([])
            setSelectRow([])
          }
        })
      },
      onCancel() {},
    })
  }

  /* 导出 */
  const handleExport = () => {
    const { selectedRowKeys = [], selectRow = [], setSelectedRowKeys, setSelectRow } = selectRowFns
    if (selectedRowKeys.length > 5000) {
      message.warning(intl.formatMessage({ id: 'balance.export.quantity.limit' }))
      return
    }
    const orderType = selectRow[0].orderType
    const flag = selectRow.some((item) => item.orderType !== orderType)
    if (flag) {
      message.warning(intl.formatMessage({ id: 'balance.export.orderType.limit' }))
      return
    }
    postSettlementMemberSettlementVendorReceivableSettlementExport(
      { ids: selectedRowKeys },
      { responseType: 'blob', getResponse: true },
    ).then((res: any) => {
      const { response } = res
      if (response.status == 200) {
        const suffixName = response.headers.get('content-disposition').split('.')[1]
        const fileName = `${moment().format('YYYYMMDD')}账单.${suffixName}`
        downFileByBuffer(response.data, fileName)
        ref.current.reloadCurrent()
        setSelectedRowKeys([])
        setSelectRow([])
      }
    })
  }

  const controllerBtns = (
    <Row>
      <Col span={6}>
        <Space direction="horizontal" size={16}>
          <AuthButton type="custom" code="reconciliation">
            <Button disabled={!selectRow.selectedRowKeys.length} onClick={handleConfirmReconciliation}>
              {intl.formatMessage({ id: 'balance.batch.reconciliation.btn' })}
            </Button>
          </AuthButton>
          <AuthButton type="custom" code="collection">
            <Button disabled={!selectRow.selectedRowKeys.length} onClick={handleConfirmReceipt}>
              {intl.formatMessage({ id: 'balance.batch.receive.payment.btn' })}
            </Button>
          </AuthButton>
          <AuthButton type="custom" code="export">
            <Button disabled={!selectRow.selectedRowKeys.length} onClick={handleExport}>
              {intl.formatMessage({ id: 'balance.batch.export.btn' })}
            </Button>
          </AuthButton>
        </Space>
      </Col>
    </Row>
  )
  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            scroll: {
              x: 1800,
            },
          }}
          rowSelection={selectRow}
          keepAlive={false}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              components={{ RangePicker, controllerBtns: () => controllerBtns }}
              actions={formActions}
              expressionScope={{}}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'megaLayout.payName', FORM_FILTER_PATH)
                useAsyncSelect('status', fetchOptions(getSettlementCommonGetSettlementStatus))
                // 单据类型
                useAsyncSelect('orderType', fetchOptions(getSettlementCommonGetSettlementOrderType))
                // 导出
                useAsyncSelect('exportFlag', fetchOptions(getSettlementCommonGetExportFlag))
              }}
              schema={schema}
              onSubmit={handleSearch}
              onReset={() => {
                clear()
              }}
              {...formatInitialValue}
            />
          }
        />
      </Card>
      <Modal
        width={400}
        title={intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.modal.1.title' })}
        visible={modals['confirmReconciliation']}
        onCancel={() => handleClose('confirmReconciliation')}
        onOk={() => handleConfirm({ id: itemInfo?.id })}
      >
        <ConfirmAccount settlementDate={itemInfo?.settlementDate} payName={itemInfo?.payName} />
      </Modal>
      <Modal
        width={548}
        title={intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.modal.2.title' })}
        onCancel={() => handleClose('viewPay')}
        visible={modals['viewPay']}
        footer={null}
      >
        <Voucher files={files} />
      </Modal>
      <Modal
        width={548}
        title={intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.modal.3.title' })}
        onCancel={() => handleClose('confirmPay')}
        visible={modals['confirmPay']}
        footer={
          <Space>
            <Button onClick={() => handleClose('confirmPay')}>
              {intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.modal.3.button.1' })}
            </Button>
            <Button danger onClick={() => handleConfirmPayStatus({ status: 0, id: itemInfo.id })}>
              {intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.modal.3.button.2' })}
            </Button>
            <Button type={'primary'} onClick={() => handleConfirmPayStatus({ status: 1, id: itemInfo.id })}>
              {intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.modal.3.button.3' })}
            </Button>
          </Space>
        }
      >
        <Voucher files={files} />
      </Modal>
      <ViewUniversalPay
        visible={modals['viewUniversalPay']}
        balanceInfo={universalPayInfo}
        onClose={() => handleClose('viewUniversalPay')}
        onOk={() => handleClose('viewUniversalPay')}
      />
    </PageHeaderWrapper>
  )
}

export default SettlementList
