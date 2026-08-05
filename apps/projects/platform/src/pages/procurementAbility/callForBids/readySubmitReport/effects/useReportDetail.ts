import React from 'react'
import { useCallback, useState, useEffect } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { message } from 'antd'
import { processLogResponses } from '@/pages/procurement/constants'
import {
  getPurchaseExpertExtractReportGetEvaluationTenderReport,
  getPurchaseInviteTenderGetInviteTenderProcess,
  getPurchaseInviteTenderInCheckRecordGetInviteTenderInCheckRecord,
  getPurchaseTenderOutCheckRecordGetInviteTenderOutCheckRecord,
} from '@apps/apis'

interface DetailHookProps {}

export const useReportDetail = (options: DetailHookProps) => {
  // 详情数据
  const [formData, setFormData] = useState<any>(null)
  // 流转记录数据（内/外）
  const [interiorProcurementOrderLogResponses, setInteriorProcurementOrderLogResponses] = useState<any>(null)
  const [externalProcurementOrderLogResponses, setExternalProcurementOrderLogResponses] = useState<any>(null)
  // 流程状态数据（内/外）
  const [interiorWorkflowFlowRecordLogResponses, setInteriorWorkflowFlowRecordLogResponses] = useState<any>(null)
  const [externalWorkflowFlowRecordLogResponses, setExternalWorkflowFlowRecordLogResponses] = useState<any>(null)

  // 提交报告的表单数据
  const [fileList, setFileList] = useState<any>([])
  const [recommandList, setRecommandList] = useState<any>()
  const [childTableData, setChildrenTableData] = useState<any>([])

  // 线下评标数据
  const [offlineData, setOfflineData] = useState<any>([])
  const [offlineColumn, setOfflineColumn] = useState<any>([])

  const { id, action = null } = usePageStatus()

  useEffect(() => {
    reloadFormData()
  }, [])

  const reloadFormData = useCallback(async () => {
    if (id) {
      const {
        code,
        data,
        message: msg,
      } = await getPurchaseExpertExtractReportGetEvaluationTenderReport({ inviteTenderId: id }, { ctlType: 'none' })
      if (code === 1000) {
        setFormData(data)
      } else {
        message.error(msg)
      }

      const searchId = data.id

      // 流转记录（内/外）
      // 招投标
      const inCheckRecordFn = getPurchaseInviteTenderInCheckRecordGetInviteTenderInCheckRecord

      const inReocrdRes = await inCheckRecordFn({ inviteTenderId: searchId })
      if (inReocrdRes.code === 1000) {
        setInteriorProcurementOrderLogResponses(inReocrdRes.data)
      }

      const outCheckRecordFn = getPurchaseTenderOutCheckRecordGetInviteTenderOutCheckRecord
      const outRecordRes = await outCheckRecordFn({ inviteTenderId: searchId })
      if (outRecordRes.code === 1000) {
        setExternalProcurementOrderLogResponses(outRecordRes.data)
      }

      // 流程状态（内/外）
      // 招投标
      const processRes = await getPurchaseInviteTenderGetInviteTenderProcess({ inviteTenderId: searchId })
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
    ctl: {
      setData: setFormData,
    },
    reloadFormData,
    // 提交报告的表单数据
    submitData: {
      fileList,
      recommandList,
      childTableData,
      offlineData,
      offlineColumn,
    },
    submitCtl: {
      setFileList,
      setRecommandList,
      setChildrenTableData,
      setOfflineData,
      setOfflineColumn,
    },
  }

  return {
    formContext,
    id,
    action,
  }
}
