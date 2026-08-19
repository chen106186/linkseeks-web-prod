import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { Modal } from 'antd'
import { formatTimeString } from '@/utils'
import Voucher from '../components/Voucher'
import UploadVoucherModal from '../components/UploadVoucherModal'
import useIsExistsBrokerage from '../hooks/useIsExistsBrokerage'
import {
  getSettlementPlatformSettlementGetPayablePayProve,
  getSettlementPlatformSettlementPagePayableSettlement,
  postSettlementPlatformSettlementCommunicationPay,
  postSettlementPlatformSettlementPay,
} from '@apps/apis'
import { postSettlementJobPlatformManualSettlement } from '@apps/apis'
import useHandleSettlementList from './useHandleSettlementList'
import ViewUniversalPay from '../components/ViewUniversalPay'
import OtherPayModal from '../components/OtherPayModal'
import { usePageStatus } from '@/hooks/usePageStatus'

const SettlementList: React.FC = () => {
  const { itemInfo, columns, handleClose, modals } = useHandleSettlementList()
  const { filterColumns } = useIsExistsBrokerage()
  const [files, setFiles] = useState<any>([])
  const ref = useRef({} as ActionType)
  const [confirmUniversalPayLoading, setConfirmUniversalPayLoading] = useState<boolean>(false)
  const urlParams = usePageStatus()

  const universalPayInfo1 = useMemo(
    () => ({
      name: itemInfo?.settlementName || '',
      amount: itemInfo?.amount || 0,
      statusName: itemInfo?.statusName || '',
      payWayName: '通联支付',
      settlementDate: itemInfo?.settlementDate || '',
    }),
    [itemInfo],
  )

  const universalPayInfoData = useMemo(() => {
    return {
      name: itemInfo?.settlementName || '',
      amount: itemInfo?.amount || 0,
      payMethods: '通联支付',
    }
  }, [itemInfo])

  const fetchListData = async (params) => {
    const payload = {
      ...params,
      status: typeof params.status == 'undefined' ? urlParams.status || 0 : params.status,
    }
    if (payload.startDate) {
      payload.startDate = formatTimeString(payload.startDate, 'YYYY-MM-DD')
    }
    if (payload.endTime) {
      payload.endTime = formatTimeString(payload.startDate, 'YYYY-MM-DD HH:mm:ss')
    }
    const res = await getSettlementPlatformSettlementPagePayableSettlement(payload)
    return res.data
  }
  /**
   *
   * @param params 手动结算
   */
  const handleManualsettlement = async (id: number) => {
    const { code } = await postSettlementJobPlatformManualSettlement({ id: id })
    if (code === 1000) {
      handleClose('manualSettlement')
      ref.current.reload()
    }
  }

  const fetchVouchers = useCallback(async (id: number) => {
    const { code, data } = await getSettlementPlatformSettlementGetPayablePayProve({ id: id.toString() })
    if (code === 1000) {
      setFiles(data)
    }
  }, [])

  useEffect(() => {
    if (itemInfo !== null && modals['manualSettlement']) {
      handleManualsettlement(itemInfo.id)
      return
    }
    if (itemInfo !== null && modals.viewPay) {
      fetchVouchers(itemInfo.id)
    }
  }, [itemInfo])

  /**
   * 上传凭证
   * @param params
   */
  const handleUploadVoucher = (params: any) => {
    postSettlementPlatformSettlementPay({ id: params.id, proveList: params.fileList }).then((data) => {
      if (data.code === 1000) {
        ref.current.reload()
        params.onCancel()
      }
    })
  }

  /**
   * @通联支付确认付款
   */
  const handleUniversalPay = async () => {
    console.log(itemInfo)
    try {
      setConfirmUniversalPayLoading(true)
      const { code } = await postSettlementPlatformSettlementCommunicationPay({ id: itemInfo?.id! })

      if (code === 1000) {
        handleClose('universalPay')
        ref.current.reload()
      }
    } finally {
      setConfirmUniversalPayLoading(false)
    }
  }

  const frozenColumn = useMemo(() => filterColumns(columns, ['brokerage']), [filterColumns, columns])

  const initialValue = useMemo(() => {
    return urlParams.status ? { status: +urlParams.status } : {}
  }, [urlParams])

  return (
    <PageHeaderWrapper backDom={false}>
      <StandardFormTable
        columns={frozenColumn}
        autoScrollX
        request={(params) => fetchListData(params)}
        rowKey="id"
        actionRef={ref}
        initalValue={initialValue}
      />
      <UploadVoucherModal
        visible={modals.uploadPayVoucher}
        id={itemInfo?.id}
        roleId={itemInfo?.roleId}
        settlementId={itemInfo?.memberId}
        handleUpload={handleUploadVoucher}
        onCancel={() => handleClose('uploadPayVoucher')}
      />
      <Modal
        width={548}
        title="查看付款凭证"
        onCancel={() => handleClose('viewPay')}
        visible={modals.viewPay}
        footer={null}
      >
        <Voucher files={files} />
      </Modal>
      <ViewUniversalPay
        visible={modals['viewUniversalPay']}
        balanceInfo={universalPayInfo1}
        onClose={() => handleClose('viewUniversalPay')}
        onOk={() => handleClose('viewUniversalPay')}
      />
      <OtherPayModal
        visible={modals.universalPay}
        onClose={() => handleClose('universalPay')}
        onConfirm={handleUniversalPay}
        balanceInfo={universalPayInfoData}
        confirmLoading={confirmUniversalPayLoading}
      />
    </PageHeaderWrapper>
  )
}

export default SettlementList
