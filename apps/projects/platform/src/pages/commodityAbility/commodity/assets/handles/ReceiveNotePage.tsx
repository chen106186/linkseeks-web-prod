import {
  getOrderDeliveryOrderDetail,
  getOrderDeliveryOrderDetailProductPage,
  getOrderDeliveryOrderReceivePage,
  getOrderReceiveOrderDeliveryPage,
  getOrderReceiveOrderDetail,
  getOrderReceiveOrderDetailProductPage,
  GetOrderReceiveOrderDetailProductPageResponse,
  getOrderReceiveOrderPage,
  postOrderReceiveOrderUpdate,
} from '@apps/apis'

// /order/receive/order/detail
class ReceiveNoteBase {
  getDetailById(id: string) {
    return getOrderReceiveOrderDetail({ id }).then((res) => res.data)
  }

  getDetailProduct({ id, current }) {
    return getOrderReceiveOrderDetailProductPage({
      id,
      current,
      ...{ pageSize: '10' },
    }).then((res) => res.data)
  }
}
// 收货单送货单管理
class ReceiveNoteManage extends ReceiveNoteBase {
  getDetailById(id: string) {
    return getOrderReceiveOrderDetail({ id }).then((res) => res.data)
  }

  getQuery(payload?: any) {
    return getOrderReceiveOrderPage(payload).then((res) => {
      return res.data
    })
  }

  getUploader(payload: any) {
    return postOrderReceiveOrderUpdate(payload).then((res) => {
      return res.data
    })
  }
}

class ReceiveNoteQuery extends ReceiveNoteBase {
  getDetailById(id: string): any {
    return getOrderDeliveryOrderDetail({ id }).then((res) => res.data)
  }

  getQuery(payload?: any) {
    return getOrderReceiveOrderDeliveryPage(payload).then((res) => {
      return res.data
    })
  }

  getDetailProduct({ id, current }: { id: any; current: any }): Promise<any> {
    return getOrderDeliveryOrderDetailProductPage({ id, current, pageSize: '10' }).then((res) => {
      return res.data
    })
  }
}

export default class ReceiveNoteFacotry {
  static getInstance(type: 'Manage' | 'Query' = 'Manage') {
    switch (type) {
      case 'Manage':
        return new ReceiveNoteManage()
      default:
        return new ReceiveNoteQuery()
    }
  }
}
