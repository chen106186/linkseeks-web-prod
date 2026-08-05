import { useCallback, useState, useEffect } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { message } from 'antd'
import { processLogResponses } from '@/pages/procurement/constants'
import {
  getPurchaseInviteTenderGetInviteTender,
  getPurchaseInviteTenderGetInviteTenderProcess,
  getPurchaseInviteTenderGetSubmitTender,
  getPurchaseInviteTenderInCheckRecordGetInviteTenderInCheckRecord,
  getPurchaseSubmitTenderGetInviteTender,
  getPurchaseSubmitTenderGetSubmitTender,
  getPurchaseSubmitTenderGetSubmitTenderProcess,
  getPurchaseSubmitTenderInCheckRecordGetSubmitTenderInCheckRecord,
  getPurchaseTenderOutCheckRecordGetInviteTenderOutCheckRecord,
  getPurchaseTenderOutCheckRecordGetSubmitTenderOutCheckRecord,
} from '@apps/apis'

interface OrderDetailHookProps {
  /** 招标-招标详情，投标-投标详情，招标-投标详情，投标-招标详情，custom自定义 配合requestApi字段 */
  type: 'callForBid' | 'tender' | 'callForBidInTender' | 'tenderInCallForBid' | 'custom'
  /** custom模式下 传入获取详情的api */
  requestApi?: any
  /** custom模式下 传入获取调用requestApi的params字段 */
  customDetailField?: string
  // /** custom模式下 传入获取调用获取流程流转记录接口的params字段 */
  // customSearchRecordField?: string,
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
  const [address, setAddress] = useState<string>(null)

  // 内容元素距顶部距离数组
  const [offsetTopList, setOffsetTopList] = useState<number[]>([])

  const { id } = usePageStatus()
  const {
    type,
    requestApi = null,
    customDetailField = null,
    // customSearchRecordField = null
  } = options

  useEffect(() => {
    reloadFormData()
  }, [])

  const switchApi = (type) => {
    let _api = null
    switch (type) {
      case 'callForBid':
        _api = getPurchaseInviteTenderGetInviteTender
        break
      case 'tender':
        _api = getPurchaseSubmitTenderGetSubmitTender
        break
      case 'callForBidInTender':
        _api = getPurchaseInviteTenderGetSubmitTender
        break
      case 'tenderInCallForBid':
        _api = getPurchaseSubmitTenderGetInviteTender
        break
      default:
        _api = requestApi
    }
    return _api
  }

  const switchParamField = (type) => {
    let field = null
    switch (type) {
      case 'callForBid':
        field = 'inviteTenderId'
        break
      case 'tender':
        field = 'submitTenderId'
        break
      case 'callForBidInTender':
        field = 'submitTenderId'
        break
      case 'tenderInCallForBid':
        field = 'inviteTenderId'
        break
      default:
        field = customDetailField
    }
    return field
  }

  const reloadFormData = useCallback(async () => {
    if (id) {
      const fn = switchApi(type)
      let params: any = {}
      params[switchParamField(type)] = id

      const { code, data, message: msg } = await fn(params, { ctlType: 'none' })
      if (code === 1000) {
        setFormData(data)
        if (data?.deliverAddress) {
          // getLogisticsReceiverAddressGet({id: data.deliverAddress}).then(_res => {
          //   const { data: _data } = _res
          //   const { provinceName, cityName, districtName, address } = _data
          //   if(code === 1000) {
          //     setAddress(`${provinceName}/${cityName}/${districtName}/${address}`)
          //   }
          // })
          setAddress(data.deliverAddress)
        }
      } else {
        message.error(msg)
      }

      // 有投标模式的情况下提取招标id
      const searchId = type.indexOf('ender') !== -1 ? data.inviteTender.id : id

      // 流转记录（内/外）
      // 招投标
      // const inCheckRecordFn = !type.indexOf('c')
      // ?
      // getPurchaseInviteTenderInCheckRecordGetInviteTenderInCheckRecord
      // :
      // getPurchaseSubmitTenderInCheckRecordGetSubmitTenderInCheckRecord

      // const inReocrdRes = await inCheckRecordFn({ inviteTenderId: searchId })
      // if (inReocrdRes.code === 1000) {
      //   setInteriorProcurementOrderLogResponses(inReocrdRes.data)
      // }
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
