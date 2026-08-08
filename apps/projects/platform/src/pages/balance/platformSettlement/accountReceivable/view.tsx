import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { Card, DatePicker, Modal, Space, Button } from 'antd'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { schema } from './schema'
import StatusTag, { STATUS_TYPE } from '@/components/StatusTag'
import { payStatus } from '../../common'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { fetchOptions } from '../../common'
import useIsExistBrokerage from '../../hooks/useIsExistsBrokerage'
import ConfirmAccount from '../../components/ConfirmAccount'
import Voucher from '../../components/Voucher'
import { TO_BE_RECONCILED, TO_BE_COLLECTED, COMPLETED } from '../../common/constants'
import useFetchColumns from '../../hooks/useFetchColumns'
import { STATUS_TEXT } from '@/constants/balance'
import { numFormat, priceFormat } from '@/utils/numberFomat'
import useSetSearchValueInTable from '@/hooks/useSetSearchValueInTable'
import {
  getSettlementCommonGetSettlementStatus,
  getSettlementPlatformSettlementGetReceivablePayProve,
  getSettlementPlatformSettlementPageReceivableSettlement,
  GetSettlementPlatformSettlementPageReceivableSettlementRequest,
  postSettlementPlatformSettlementConfirmAccountComplete,
  postSettlementPlatformSettlementConfirmPayProve,
} from '@apps/apis'
import useConfirmReconciliation from './hooks/useConfirmReconciliation'
import useViewPayInfo from './hooks/useViewPayInfo'
import useConfirmPayInfo from './hooks/useConfirmPayInfo'
import ViewUniversalPay from '../../components/ViewUniversalPay'

const formActions = createFormActions()
const { RangePicker } = DatePicker

// 平台代收账款结算 - 收款方查看凭证 能力中心
const PLATFORM_BENEFICIARY = 3

/** 保留三位小数，然后丢弃最后一位小数，因为 priceFormat 保留两位小数会直接进位*/
const fomatNumber = (number) => {
  const string = priceFormat(number, 3)
  return string.substring(0, string.length - 1)
}

const AccountReceivable = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { reconciliationInfo, reconciliationModalVisible, handleReconciliationOpen, handleReconciliationClose } =
    useConfirmReconciliation()
  const { files, viewVisible, viewVisible1, payInfo, viewModalonCancel, handleViewPayModal, viewModalonCancel1 } =
    useViewPayInfo()
  const { confirmPayInfo, payFiles, handleConfirmCompletePaymentStatus, confirmPayOnCancel, confirmPayVisible } =
    useConfirmPayInfo()
  // const [files, setFiles] = useState([]);
  const { searchData, formatInitialValue, clear } = useSetSearchValueInTable()

  const columns = [
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.columns.settlementNo' }),
      dataIndex: 'settlementNo',
      width: 190,
      render: (text, record) => {
        return (
          <EyeAuthButton url={`/balance/platformSettlement/accountReceivable/detail?id=${record.id}`}>
            {record.settlementNo}
          </EyeAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.columns.settlementDate' }),
      dataIndex: 'settlementDate',
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.columns.settlementWayName' }),
      dataIndex: 'settlementWayName',
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.columns.settlementName', defaultMessage: '结算方' }),
      dataIndex: 'settlementName',
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.columns.totalCount' }),
      dataIndex: 'totalCount',
      render: (text) => numFormat(text),
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.columns.collectAmount' }),
      dataIndex: 'collectAmount',
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${fomatNumber(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.columns.brokerage' }),
      dataIndex: 'brokerage',
    },
    {
      title: '团购佣金',
      dataIndex: 'communityGroupBuyingAmount',
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${fomatNumber(text)}`,
    },
    {
      title: '分销佣金',
      dataIndex: 'socialDistributionAmount',
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${fomatNumber(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.columns.amount' }),
      dataIndex: 'amount',
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${fomatNumber(text)}`,
    },
    {
      title: intl.formatMessage({
        id: 'balance.platformSettlement.columns.estimatedPaymentDate',
        defaultMessage: '实际付款时间',
      }),
      dataIndex: 'estimatedPaymentDate',
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.columns.payTime', defaultMessage: '预计付款时间' }),
      dataIndex: 'payTime',
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.columns.payWayName' }),
      dataIndex: 'payWayName',
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.columns.status' }),
      dataIndex: 'status',
      filters: payStatus,
      onFilter: (value: number, record: any) => record.status == value,
      render: (text, record) => {
        return <StatusTag type={STATUS_TYPE[record.status] as 'success'} title={record.statusName} />
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.columns.operation' }),
      render: (text, record) => {
        // 待收账款结算
        if (record.status === TO_BE_RECONCILED) {
          return (
            <a
              onClick={() =>
                handleReconciliationOpen({
                  id: record.id,
                  payName: intl.formatMessage({
                    id: 'balance.platformSettlement.accountReceivable.columns.operation.button.1.payName',
                  }),
                  settlementDate: record.settlementDate,
                })
              }
            >
              {intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.columns.operation.button.1' })}
            </a>
          )
        }
        if (record.status === TO_BE_COLLECTED) {
          return (
            <a onClick={() => handleConfirmCompletePaymentStatus(record)}>
              {intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.columns.operation.button.2' })}
            </a>
          )
        }
        if (record.status === COMPLETED) {
          return (
            <a onClick={() => handleViewPayModal(record)}>
              {intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.columns.operation.button.3' })}
            </a>
          )
        }
      },
    },
  ]

  const { retColumn } = useIsExistBrokerage(columns, ['brokerage'])

  const fetchListData = async (params: GetSettlementPlatformSettlementPageReceivableSettlementRequest) => {
    const searchParams = {
      ...searchData,
      ...params,
    }
    const postData = {
      ...searchParams,
      status: searchParams.status || '0',
    }
    const { data } = await getSettlementPlatformSettlementPageReceivableSettlement(postData)
    return data
  }
  /**
   * 确认对账
   * @param  {cancel: function, id: number} cancel 为关闭回调函数
   */
  const handleConfirm = async (params: { id: number }) => {
    const { code } = await postSettlementPlatformSettlementConfirmAccountComplete({ settlementId: params.id })
    if (code === 1000) {
      // reconciliationOnCancel();
      handleReconciliationClose()
      formActions.submit()
    }
  }

  /**
   * 确认付款凭证
   */
  const handleConfirmPayStatus = async (params: { status: 0 | 1; id: number }) => {
    const { code } = await postSettlementPlatformSettlementConfirmPayProve({ id: params.id, status: params.status })
    if (code) {
      confirmPayOnCancel()
      formActions.submit()
    }
  }

  /**
   * 搜索
   */
  const handleSearch = (values: any) => {
    const format = 'YYYY-MM-DD'
    const startTime = values.startTime?.format(format)
    const endTime = values.endTime ? values.endTime.endOf('days').format('YYYY-MM-DD HH:mm:ss') : ''
    ref.current.reload({ ...values, startTime, endTime })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            scroll: {
              x: 1600,
            },
          }}
          columns={retColumn}
          currentRef={ref}
          // rowSelection={rowSelection}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              expressionScope={{}}
              components={{ RangePicker }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'megaLayout.settlementNo', FORM_FILTER_PATH)
                useAsyncSelect(['status'], fetchOptions(getSettlementCommonGetSettlementStatus))
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
        title={intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.modal.1.title' })}
        visible={reconciliationModalVisible}
        onCancel={handleReconciliationClose}
        onOk={() => handleConfirm({ id: reconciliationInfo?.id })}
      >
        <ConfirmAccount settlementDate={reconciliationInfo?.settlementDate} payName={reconciliationInfo?.payName} />
      </Modal>
      <Modal
        width={548}
        title={intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.modal.3.title' })}
        onCancel={confirmPayOnCancel}
        visible={confirmPayVisible}
        footer={
          <Space>
            <Button onClick={confirmPayOnCancel}>
              {intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.modal.3.button.1' })}
            </Button>
            <Button danger onClick={() => handleConfirmPayStatus({ status: 0, id: confirmPayInfo.id })}>
              {intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.modal.3.button.2' })}
            </Button>
            <Button type={'primary'} onClick={() => handleConfirmPayStatus({ status: 1, id: confirmPayInfo.id })}>
              {intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.modal.3.button.3' })}
            </Button>
          </Space>
        }
      >
        <Voucher files={payFiles} />
      </Modal>

      {/* 通联支付付款凭证 */}
      <ViewUniversalPay
        visible={viewVisible && payInfo.payWay === 2}
        balanceInfo={confirmPayInfo}
        onOk={viewModalonCancel}
        onClose={viewModalonCancel}
      />

      <ViewUniversalPay
        visible={viewVisible1 && payInfo.payWay === 2}
        balanceInfo={payInfo}
        onOk={viewModalonCancel1}
        onClose={viewModalonCancel1}
      />

      <Modal
        width={548}
        title={intl.formatMessage({ id: 'balance.zhakanfukuanpingzheng' })}
        onCancel={viewModalonCancel}
        visible={viewVisible && payInfo.payWay === 1}
        footer={null}
      >
        <Voucher files={files} />
      </Modal>
    </PageHeaderWrapper>
  )
}

export default AccountReceivable
