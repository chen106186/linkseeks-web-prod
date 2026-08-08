import React, { useRef } from 'react'
import { useCallback, useState, useEffect } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { Link, useQuery } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { formatTimeString } from '@/utils'
import { OrderKindType } from '@/constants/order'
import {
  getOrderBuyerDetail,
  getOrderBuyerValidatePayDetail,
  getOrderBuyerValidatePayType,
  getOrderBuyerValidateReceiveDetail,
  getOrderVendorDetail,
  getOrderVendorValidateDeliveryDetail,
  getOrderVendorValidatePayConfirmDetail,
  getOrderCommonSettleOrderDetail,
} from '@apps/apis'
import { Badge, message, Tag } from 'antd'
import { OUTER_STATUS_TYPE, INTERNAL_STATUS_TYPE } from '@/constants/stateColor'

interface OrderDetailHookProps {
  /** 采购、销售、待收货、待确认发货、待支付、待确认支付 */
  type:
    | 'purchaseOrder'
    | 'saleOrder'
    | 'p_readyReceiveOrder'
    | 's_readyConfirmDelevedOrder'
    | 'p_readyPayOrder'
    | 's_readyPayResult'
}
const intl = getIntl()
// 订单详情, 支持两种订单模式
export const useOrderDetail = (options: OrderDetailHookProps) => {
  // 订单详情内容
  const [formData, setFormData] = useState<any>(null)
  // 当前的支付信息id 默认第一个
  const [currentPayInfoId, setCurrentPayInfoId] = useState<any>(null)

  // 支付信息列表
  const [payList, setPaylist] = useState<any[]>([])
  const { id } = usePageStatus()
  const { orderNo } = useQuery()
  const { type } = options

  const getQuoteDetailLink = (record: any) => {
    if (record?.orderMode === OrderKindType.COLLECTIVE_ORDER) {
      return `/procurementAbility/confirmOffer/quote?id=${record?.quoteId}&number=${record?.quoteNo}&turn=1`
    }
    return type[0] === 's'
      ? record?.orderKind === OrderKindType.REQUISITION_ORDER
        ? ''
        : `/dealAbility/inquiryOffer/offerSearch/offer?id=${record?.quoteId}`
      : record?.orderKind === OrderKindType.REQUISITION_ORDER
      ? `/procurementAbility/purchaseRequisition/purchaseRequisitionList/preview?id=${record?.quoteId}`
      : `/dealAbility/confirmOffer/offerSearch/offer?id=${record?.quoteId}`
  }

  const dataRef = useRef<any>([
    {
      title: intl.formatMessage({ id: 'transaction_components.dingdanhao' }),
      name: 'orderNo',
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.orderCollect.schema.quoteNo' }),
      name: 'quoteNo',
      span: 8,
      render: (text, record) => <Link to={getQuoteDetailLink(record)}>{text}</Link>,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.orderCollect.schema.contractLabel' }),
      name: 'contract',
      span: 8,
      render: (text, record) => record?.contract?.contractNo,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.dingdanzhaiyao' }),
      name: 'digest',
      span: 8,
    },
    {
      title:
        type[0] === 's'
          ? intl.formatMessage({ id: 'purchaseOrder.orderCollect.schema.buyerMemberMajorId' })
          : intl.formatMessage({ id: 'purchaseOrder.orderCollect.schema.vendorMemberName' }),
      name: type[0] === 's' ? 'buyerMemberName' : 'vendorMemberName',
      span: 8,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.orderCollect.schema.orderMode' }),
      name: 'orderModeName',
      span: 8,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.orderCollect.schema.type' }),
      name: 'orderTypeName',
      span: 8,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.xiadanshijian' }),
      name: 'createTime',
      span: 8,
      render: (text) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.waibuzhuangtai' }),
      name: 'outerStatusName',
      span: 8,
      render: (text, record) => <Tag color={OUTER_STATUS_TYPE(record?.outerStatus) || 'default'}>{text}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.neibuzhuangtai' }),
      name: 'innerStatusName',
      span: 8,
      render: (text, record) => <Badge status={INTERNAL_STATUS_TYPE(record?.innerStatus)} text={text} />,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.laiyuanshangcheng' }),
      name: 'shopName',
      span: 8,
    },
    { title: intl.formatMessage({ id: 'order.warehouseHouse' }), name: 'warehouseName', span: 8 },
  ])

  const reloadPayList = (orderId) => {
    getOrderBuyerValidatePayType({ orderId }).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setPaylist(data)
      }
    })
  }

  const getPayments = (data) => {
    if (type === 'p_readyPayOrder') {
      reloadPayList(id)
    }
    if (data.payments.length > 0) {
      // 过滤出未支付的 第一个
      const payObj = data.payments.filter((item) => item.showPayment)[0]
      setCurrentPayInfoId(payObj?.paymentId ? payObj.paymentId : data.payments[0].paymentId)
    }
  }

  // 根据type类型 调用不同的详情接口
  const getDetailsApi = (_type: string) => {
    let api = null
    switch (_type) {
      case 'purchaseOrder':
        api = getOrderBuyerDetail
        break
      case 'saleOrder':
        api = orderNo ? getOrderCommonSettleOrderDetail : getOrderVendorDetail
        break
      case 'p_readyReceiveOrder':
        api = getOrderBuyerValidateReceiveDetail
        break
      case 's_readyConfirmDelevedOrder':
        api = getOrderVendorValidateDeliveryDetail
        break
      case 'p_readyPayOrder':
        api = getOrderBuyerValidatePayDetail
        break
      case 's_readyPayResult':
        api = getOrderVendorValidatePayConfirmDetail
      default:
        api = getOrderBuyerDetail
    }
    return api
  }

  const reloadFormData = useCallback(() => {
    const fn = getDetailsApi(type)
    if (id || orderNo) {
      // @ts-ignore
      fn(id ? { orderId: id } : { orderNo }, { ctlType: 'none' }).then((res) => {
        const { code, data } = res
        if (code !== 1000) {
          message.error(res.message)
          return
        }
        setFormData(data)
        // 待支付订单获取所有支付方式
        getPayments(data)
      })
    }
  }, [id])

  useEffect(() => {
    reloadFormData()
  }, [])

  // 需共享的状态
  const formContext = {
    data: formData,
    currentPayInfoId,
    payList,
    ctl: {
      setData: setFormData,
      setPayId: setCurrentPayInfoId,
    },
    reloadFormData,
  }

  return {
    formContext,
    id,
    detailList: dataRef.current,
  }
}
