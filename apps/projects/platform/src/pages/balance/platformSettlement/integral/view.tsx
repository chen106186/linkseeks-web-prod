import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { Card, DatePicker, Modal, Space, Button } from 'antd'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { schema } from './schema/index'
import { fetchOptions } from '../../common'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import Voucher from '../../components/Voucher'
import ConfirmAccount from '../../components/ConfirmAccount'
import useSetSearchValueInTable from '@/hooks/useSetSearchValueInTable'
import {
  getSettlementCommonGetSettlementStatus,
  getSettlementPlatformScoreSettlementGetReceivablePayProve,
  getSettlementPlatformScoreSettlementPageReceivableSettlement,
  GetSettlementPlatformScoreSettlementPageReceivableSettlementRequest,
  postSettlementPlatformScoreSettlementConfirmAccountComplete,
  postSettlementPlatformScoreSettlementConfirmPayProve,
} from '@apps/apis'
import useHandleSettlementList from './hooks/useHandleSettlementList'
import ViewUniversalPay from '../../components/ViewUniversalPay'

const formActions = createFormActions()
const Integral: React.FC = () => {
  const intl = useIntl()
  const { columns, handleOpen, handleClose, itemInfo, modals } = useHandleSettlementList()
  const ref = useRef<any>({})
  const [files, setFiles] = useState([])
  const { searchData, formatInitialValue, clear } = useSetSearchValueInTable()
  const universalPayInfo = useMemo(
    () => ({
      name: itemInfo?.settlementName,
      amount: itemInfo?.amount,
      statusName: itemInfo?.statusName,
      payWayName: '平台',
      settlementDate: itemInfo?.settlementDate,
    }),
    [itemInfo],
  )

  /**
   * TODO 需要换成优惠券结算
   * 确认对账
   */
  const fetchListData = async (params: GetSettlementPlatformScoreSettlementPageReceivableSettlementRequest) => {
    const searchParams = {
      ...searchData,
      ...params,
    }
    const postData = {
      ...searchParams,
      status: searchParams.status || '0',
    }
    // /settle/accounts/platform/score/settlement/pageReceivableSettlement
    const { data } = await getSettlementPlatformScoreSettlementPageReceivableSettlement(postData)
    return data
  }

  /**
   * 确认对账
   */
  const handleConfirm = async (params: { id: number }) => {
    const { code } = await postSettlementPlatformScoreSettlementConfirmAccountComplete({ settlementId: params.id })
    if (code === 1000) {
      // reconciliationOnCancel();
      handleClose('reconciledComfirm')
      formActions.submit()
    }
  }

  /**
   * 确认付款凭证
   */
  const handleConfirmPayStatus = async (params: { status: 0 | 1; id: number }) => {
    const { code } = await postSettlementPlatformScoreSettlementConfirmPayProve({
      id: params.id,
      status: params.status,
    })
    if (code) {
      // confirmPayOnCancel();
      handleClose('confirmCompletePaymentStatus')
      formActions.submit()
    }
  }

  /**
   */
  const fetchVouchers = useCallback(async (id: number) => {
    const { code, data } = await getSettlementPlatformScoreSettlementGetReceivablePayProve({ id: id.toString() })
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
  const handleSearch = (values: any) => {
    const format = 'YYYY-MM-DD'
    const startTime = values.startTime?.format(format)
    const endTime = values.endTime ? values.endTime.format(format) + ' 23:59:59' : ''
    ref.current.reload({ ...values, startTime, endTime })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              components={{ RangePicker: DatePicker.RangePicker }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'megaLayout.settlementNo', FORM_FILTER_PATH)
                useAsyncSelect(['status'], fetchOptions(getSettlementCommonGetSettlementStatus))
              }}
              schema={schema}
              onSubmit={handleSearch}
              onReset={() => {
                clear()
                // formActions.setFieldValue('startTime', null);
                // formActions.setFieldValue('endTime', null);
              }}
              {...formatInitialValue}
            />
          }
        />
      </Card>
      <Modal
        width={400}
        title={intl.formatMessage({ id: 'balance.platformSettlement.integral.modal.1.title' })}
        visible={modals.reconciledComfirm}
        onCancel={() => handleClose('reconciledComfirm')}
        onOk={() => handleConfirm({ id: itemInfo?.id })}
      >
        <ConfirmAccount settlementDate={itemInfo?.settlementDate} payName={'平台'} />
      </Modal>
      <Modal
        width={548}
        title={intl.formatMessage({ id: 'balance.platformSettlement.integral.modal.2.title' })}
        onCancel={() => handleClose('viewPay')}
        visible={modals.viewPay}
        footer={null}
      >
        <Voucher files={files} />
      </Modal>
      <Modal
        width={548}
        title={intl.formatMessage({ id: 'balance.platformSettlement.integral.modal.3.title' })}
        onCancel={() => handleClose('confirmCompletePaymentStatus')}
        visible={modals.confirmCompletePaymentStatus}
        footer={
          <Space>
            <Button onClick={() => handleClose('confirmCompletePaymentStatus')}>
              {intl.formatMessage({ id: 'balance.platformSettlement.integral.modal.3.button.1' })}
            </Button>
            <Button danger onClick={() => handleConfirmPayStatus({ status: 0, id: itemInfo.id })}>
              {intl.formatMessage({ id: 'balance.platformSettlement.integral.modal.3.button.2' })}
            </Button>
            <Button type={'primary'} onClick={() => handleConfirmPayStatus({ status: 1, id: itemInfo.id })}>
              {intl.formatMessage({ id: 'balance.platformSettlement.integral.modal.3.button.3' })}
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

export default Integral
