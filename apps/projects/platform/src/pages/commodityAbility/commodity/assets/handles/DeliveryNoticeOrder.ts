import { isDev } from '@/constants'
import { getOrderDeliveryOrderDetailProductPage, getOrderDeliveryPlanOrderProductPage } from '@apps/apis'
import { FormInstance } from 'antd'
import DeliveryGoodTableSelectMock from '../mock/DeliveryGoodTableSelectMock'

class DeliveryNoticeOrder {
  getOrderDeliveryPlanProduct() {
    return getOrderDeliveryOrderDetailProductPage().then((res) => {
      return res.data
    })
  }

  getOrderDeliveryPlanOrderProductPage(form: FormInstance, current: number = 1, orderType = 1) {
    let fields = form.getFieldsValue()

    let payload: any = {
      memberId: fields.member?.buyerMemberId,
      roleId: fields.member?.buyerRoleId,
      roleType: fields.member?.roleType,
      orderType: orderType,
      current: current,
      pageSize: 999,
    }
    // return Promise.resolve({data:DeliveryGoodTableSelectMock});
    return getOrderDeliveryPlanOrderProductPage(payload).then((res) => {
      return res.data
    })
  }
}

class DeliveryNoticeOrderFactory {
  #instance

  static getInstance() {
    return new DeliveryNoticeOrder()
  }
}

export default DeliveryNoticeOrderFactory
