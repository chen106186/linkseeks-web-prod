import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { Modal, message } from 'antd'
import { formatTimeString } from '@/utils'
import {
  getSettlementPlatformScoreSettlementGetPayablePayProve,
  getSettlementPlatformScoreSettlementPagePayableSettlement,
  postSettlementPlatformScoreSettlementAllInPay,
  postSettlementPlatformScoreSettlementPay,
} from '@apps/apis'
import { postReportSettlementScoreManualSettlement } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import OtherPayModal from '../components/OtherPayModal'
import UploadVoucherModal from '../components/UploadVoucherModal'
import Voucher from '../components/Voucher'
import ViewUniversalPay from '../components/ViewUniversalPay'
import useHandleSettlementList from './useHandleSettlementList'

const SettlementList: React.FC = () => {
  const [files, setFiles] = useState<any>([])
  const ref = useRef({} as ActionType)
  const [confirmUniversalPayLoading, setConfirmUniversalPayLoading] = useState<boolean>(false)
  const { itemInfo, columns, handleClose, modals } = useHandleSettlementList()
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
    if (payload.startTime) {
      payload.startTime = formatTimeString(payload.startTime, 'YYYY-MM-DD')
    }
    if (payload.endTime) {
      payload.endTime = formatTimeString(payload.endTime, 'YYYY-MM-DD')
    }
    payload.status = payload.status || 0
    const res = await getSettlementPlatformScoreSettlementPagePayableSettlement(payload)
    return res.data
  }

  /**
   * @通联支付确认付款
   */
  const handleUniversalPay = async () => {
    try {
      setConfirmUniversalPayLoading(true)
      const { code } = await postSettlementPlatformScoreSettlementAllInPay({ id: itemInfo?.id! })

      if (code === 1000) {
        handleClose('universalPay')
        ref.current.reload()
      }
    } finally {
      setConfirmUniversalPayLoading(false)
    }
  }

  /**
   *
   * @param params 手动结算
   */
  const handleManualsettlement = (id) => {
    postReportSettlementScoreManualSettlement({ id: id }).then(({ data, code }) => {
      if (code === 1000) {
        ref.current.reload()
      }
    })
  }

  const fetchVouchers = useCallback(async (id: number) => {
    const { code, data } = await getSettlementPlatformScoreSettlementGetPayablePayProve({ id: id.toString() })
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
    postSettlementPlatformScoreSettlementPay({ id: params.id, proveList: params.fileList }).then((data) => {
      if (data.code === 1000) {
        ref.current.reload()
        params.onCancel()
      } else {
        message.destroy()
        message.error(data.message)
      }
    })
  }

  const initialValue = useMemo(() => {
    return urlParams.status ? { status: +urlParams.status } : {}
  }, [urlParams])

  return (
    <PageHeaderWrapper backDom={false}>
      <StandardFormTable
        columns={columns}
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
