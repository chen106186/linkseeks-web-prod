import { useCallback, useState, useEffect } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { message } from 'antd'
import { getPurchaseRequisitionDetail, getPurchaseRequisitionTransferPurchaseDetail } from '@apps/apis'
import { useQuery } from '@linkseeks/router-core'
/**
 * 采购能力 请购单context的effect
 */

interface BillDetailHookProps {
  /** 类型预留字段 默认 requestBill | transformBill请购单转单 */
  type: 'requestBill' | 'transformBill'
}

// 请购单详情
export const useBillDetail = (options: BillDetailHookProps) => {
  // 详情数据
  const [formData, setFormData] = useState<any>(null)

  const { id } = usePageStatus()
  const { requisitionNo } = useQuery()
  const { type = 'requestBill' } = options

  useEffect(() => {
    reloadFormData()
  }, [])

  // 根据type类型 调用不同的详情接口
  const getDetailsApi = (type) => {
    let api = null

    switch (type) {
      case 'requestBill':
        api = getPurchaseRequisitionDetail
        break
      case 'transformBill':
        api = getPurchaseRequisitionTransferPurchaseDetail
        break
      default:
        api = getPurchaseRequisitionDetail
    }
    return api
  }

  const reloadFormData = useCallback(() => {
    if (id || requisitionNo) {
      const fn = getDetailsApi(type)
      // @ts-ignore
      fn(id ? { id } : { requisitionNo }, { ctlType: 'none' }).then((res) => {
        const { code, data, message: msg } = res
        if (code === 1000) {
          setFormData(data)
        } else {
          message.error(msg)
        }
      })
    }
  }, [id])

  /** 采购请购单详情 通用锚点组件描述 */
  const anchorTitleList = [
    { title: '流转进度', id: 'transferProcess', componentName: 'TransferProcess' },
    { title: '基本信息', id: 'baseicInfo', type: 'basicInfo' },
    { title: '送货/交期信息', id: 'BillDelivery', type: 'BillDelivery', componentName: 'BillDelivery' },
    { title: '请购物料', id: 'billMaterial', componentName: 'BillMaterial' },
    { title: '附件', id: 'BilEnclosure', componentName: 'BilEnclosure' },
    { title: '流转记录', id: 'transferRecord', componentName: 'TransformRecord' },
  ]

  // 需共享的状态
  const formContext = {
    data: formData,
    ctl: {
      setData: setFormData,
    },
    reloadFormData,
  }

  return {
    formContext,
    id,
    anchorTitleList,
  }
}
