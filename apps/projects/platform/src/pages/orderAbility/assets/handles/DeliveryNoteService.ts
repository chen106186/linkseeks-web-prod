import {
  getOrderDeliveryOrderDetail,
  getOrderDeliveryOrderDetailProductPage,
  getOrderDeliveryOrderSrmPage,
  getOrderDeliveryOrderB2bPage,
  getOrderDeliveryOrderReceivePage,
  getOrderReceiveOrderDetail,
  GetOrderReceiveOrderDetailResponse,
  getOrderReceiveOrderDetailProductPage,
  GetOrderDeliveryOrderDetailProductPageResponse,
} from '@apps/apis'
import moment from 'moment'

/**
 * 送货单服务基类
 */
class NoteSrmService {
  #deliveryType = new Map([
    [1, '物流'],
    [2, '自提'],
    [3, '无需配送'],
  ])

  getQuery(params: any) {
    return getOrderDeliveryOrderSrmPage(params).then((res) => {
      return res.data
    })
  }

  getDetailInfoById(id: string) {
    return getOrderDeliveryOrderDetail({
      id,
    }).then((res) => {
      return res.data
    })
  }

  formatAddress(data) {
    return {
      ...data,
      shipperName: data?.consignee,
      fullAddress: data?.provinceName ?? '' + data?.cityName ?? '' + data?.districtName ?? '' + data?.streetName ?? '',
    }
  }

  formatField(data) {
    let formField = {
      digest: data?.digest,
      remark: data?.remark,
      member: {
        buyerMemberId: data?.buyerMemberId,
        buyerMemberName: data?.buyerMemberName,
        buyerRoleId: data?.buyerRoleId,
        roleType: 2,
        name: data?.buyerMemberName,
      },
      deliveryTime: data?.deliveryTime ? moment(data?.deliveryTime) : moment().startOf('day'),
      deliveryRangeTime: [moment().startOf('day'), moment().endOf('day')],
      deliveryVO: {
        ...data?.deliverVO,
        shipperName: data?.deliverVO?.consignee,
        fullAddress:
          data?.deliverVO?.provinceName ??
          '' + data?.deliverVO?.cityName ??
          '' + data?.deliverVO?.districtName ??
          '' + data?.deliverVO?.streetName ??
          '',
      },
      receiveVO: {
        ...data?.receiverBO,
        receiverName: data?.receiverBO?.consignee,
        fullAddress: `${data?.receiverBO?.provinceName ?? ''}${data?.receiverBO?.cityName ?? ''}${
          data?.receiverBO?.districtName ?? ''
        }${data?.receiverBO?.streetName ?? ''}`,
      },
      executorVO: {
        ...data?.executorVO,
        fullAddress:
          data?.executorVO?.provinceName ??
          '' + data?.executorVO?.cityName ??
          '' + data?.executorVO?.districtName ??
          '' + data?.executorVO?.streetName ??
          '',
      },
      executorVOConsignee: data?.executorVO?.consignee,
      executorVOPhone: data?.executorVO?.phone,
      sendTime: data?.sendTime ? moment(data?.sendTime) : moment().startOf('day'),
      executorVOCarNumbers: data?.executorVO?.carNumbers,
      receiverBOPhone: data?.receiverBO?.phone,
      logisticsNo: data?.logisticsNo,
      logisticsCompanyInt: {
        label: data?.logisticsCompany,
        value: data?.logisticsCompanyId,
      },
      deliveryType: data?.deliveryType,
      outerHistoryList: data?.outerHistoryList,
      deliveryNo: data?.deliveryNo,
    }
    console.log(formField)

    return formField
  }

  getDetailInfoProductById(id: string, current: string = '1', pageSize: string = '10') {
    return getOrderDeliveryOrderDetailProductPage({
      id,
      current,
      pageSize,
    }).then((res) => res.data)
  }

  getDeliveryType(type?: number) {
    /**
     * 默认是物流
     */
    if (!this.#deliveryType.has(type)) {
      return this.#deliveryType.get(1)
    }
    return this.#deliveryType.get(type)
  }
}

class NoteB2bService extends NoteSrmService {
  getQuery(params: any) {
    return getOrderDeliveryOrderB2bPage(params).then((res) => {
      return res.data
    })
  }
}

/**
 * 送货单 收货单详情 服务
 */
class NoteReceiveService extends NoteSrmService {
  getDetailInfoById(id: string): Promise<any> {
    return getOrderReceiveOrderDetail({
      id,
    }).then((res) => {
      return res.data
    })
  }

  getQuery(params: any): Promise<any> {
    return getOrderDeliveryOrderReceivePage(params).then((res) => {
      return res.data
    })
  }

  getDetailInfoProductById(id: string, current?: string, pageSize?: string): any {
    // return /order/receive/order/detail/product/page
    return getOrderReceiveOrderDetailProductPage({
      id,
      current,
      pageSize,
    }).then((res) => res.data)
  }
}

export default class NoteFactoryService {
  static getInstance(noteType: 'srm' | 'b2b' | 'receive' = 'srm') {
    if (noteType === 'srm') {
      return new NoteSrmService()
    }

    if (noteType === 'b2b') {
      return new NoteB2bService()
    }

    if (noteType === 'receive') {
      return new NoteReceiveService()
    }
  }
}
