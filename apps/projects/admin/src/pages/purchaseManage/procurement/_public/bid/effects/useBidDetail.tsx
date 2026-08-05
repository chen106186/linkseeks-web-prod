import { useCallback, useState, useEffect } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { message } from 'antd'
import { processLogResponses } from '@/pages/purchaseManage/procurement/constants'
import {
  getPurchaseInviteTenderGetInviteTenderProcess,
  getPurchaseInviteTenderInCheckRecordGetInviteTenderInCheckRecord,
  getPurchaseInviteTenderPlatformGetInviteTender,
  getPurchaseInviteTenderPlatformGetSubmitTender,
  getPurchaseSubmitTenderGetSubmitTenderProcess,
  getPurchaseSubmitTenderInCheckRecordGetSubmitTenderInCheckRecord,
  getPurchaseTenderOutCheckRecordGetInviteTenderOutCheckRecord,
  getPurchaseTenderOutCheckRecordGetSubmitTenderOutCheckRecord,
} from '@apps/apis'

interface OrderDetailHookProps {
  /** 招标-招标详情，投标-投标详情，招标-投标详情，投标-招标详情 */
  type: 'callForBid' | 'tender' | 'callForBidInTender' | 'tenderInCallForBid'
}

// 招标详情, 支持（招标-招标、投标-投标、招标-投标、投标-招标）两种模式
export const useBidDetail = (options: OrderDetailHookProps) => {
  // 详情数据
  const [formData, setFormData] = useState<any>(null)
  // 流转记录数据（内/外）
  const [interiorProcurementOrderLogResponses, setInteriorProcurementOrderLogResponses] = useState<any>(null)
  const [externalProcurementOrderLogResponses, setExternalProcurementOrderLogResponses] = useState<any>(null)
  // 流程状态数据（内/外）
  const [interiorWorkflowFlowRecordLogResponses, setInteriorWorkflowFlowRecordLogResponses] = useState<any>(null)
  const [externalWorkflowFlowRecordLogResponses, setExternalWorkflowFlowRecordLogResponses] = useState<any>(null)

  // 地址
  const [address, setAddress] = useState<string>('')

  // 内容元素距顶部距离数组
  const [offsetTopList, setOffsetTopList] = useState<number[]>([])

  const { id } = usePageStatus()
  const { type } = options

  useEffect(() => {
    reloadFormData()
  }, [])

  const switchApi = (type) => {
    let _api: any = null
    switch (type) {
      case 'callForBid':
        _api = getPurchaseInviteTenderPlatformGetInviteTender
        break
      case 'tender':
        _api = getPurchaseInviteTenderPlatformGetSubmitTender
        break
      default:
        _api = null
    }
    return _api
  }

  const reloadFormData = useCallback(async () => {
    if (id) {
      const fn = switchApi(type)
      let params: any = {}
      // params[switchParamField(type)] = id
      params['id'] = id

      const { code, data, message: msg } = await fn(params, { ctlType: 'none' })
      if (code === 1000) {
        setFormData(data)
        if (data?.deliverAddress) {
          setAddress(data.deliverAddress)
        }
      } else {
        message.error(msg)
      }

      // 有投标模式的情况下提取招标id
      const searchId = type.indexOf('ender') !== -1 ? data.inviteTender.id : id

      // * 内部专用
      let inCheckRecordFn: any

      // * 外部专用 特殊处理
      let specialParams: any = {}
      let outCheckRecordFn: any
      if (type === 'callForBid' || type === 'tenderInCallForBid') {
        specialParams['inviteTenderId'] = type === 'callForBid' ? id : data.inviteTender.id
        outCheckRecordFn = getPurchaseTenderOutCheckRecordGetInviteTenderOutCheckRecord

        inCheckRecordFn = getPurchaseInviteTenderInCheckRecordGetInviteTenderInCheckRecord
      } else if (type === 'tender' || type === 'callForBidInTender') {
        specialParams['submitTenderId'] = data.id
        outCheckRecordFn = getPurchaseTenderOutCheckRecordGetSubmitTenderOutCheckRecord

        inCheckRecordFn = getPurchaseSubmitTenderInCheckRecordGetSubmitTenderInCheckRecord
      }

      const outRecordRes = await outCheckRecordFn(specialParams)
      if (outRecordRes.code === 1000) {
        setExternalProcurementOrderLogResponses(outRecordRes.data)
      }

      const inReocrdRes = await inCheckRecordFn(specialParams)
      if (inReocrdRes.code === 1000) {
        setInteriorProcurementOrderLogResponses(inReocrdRes.data)
      }

      // 流程状态（内/外）
      // 招投标 投标里面的投标流程单独调接口
      const processRes =
        type === 'tender'
          ? await getPurchaseSubmitTenderGetSubmitTenderProcess({ submitTenderId: id })
          : await getPurchaseInviteTenderGetInviteTenderProcess({ inviteTenderId: searchId })
      if (processRes.code === 1000 && processRes.data) {
        const { interiorLogs, externalLogs } = processLogResponses(processRes.data)
        setInteriorWorkflowFlowRecordLogResponses(interiorLogs)
        setExternalWorkflowFlowRecordLogResponses(externalLogs)
      }
    }
  }, [id])

  // 需共享的状态
  const formContext = {
    data: formData,
    interiorProcurementOrderLogResponses,
    externalProcurementOrderLogResponses,
    interiorWorkflowFlowRecordLogResponses,
    externalWorkflowFlowRecordLogResponses,
    address,
    offsetTopList,
    ctl: {
      setData: setFormData,
      setOffsetTopList,
    },
    reloadFormData,
    apiType: type,
  }

  return {
    formContext,
    id,
  }
}
