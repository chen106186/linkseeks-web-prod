import { HandelFormFieldsKeyValue } from '@/utils/form'
import { FormInstance, message } from 'antd'
import {
  getOrderDeliveryOrderDetail,
  getOrderDeliveryOrderDetailProductPage,
  postOrderDeliveryOrderSrmCreate,
  postOrderDeliveryOrderUpdate,
  postOrderDeliveryOrderB2bCreate,
  postOrderReceiveOrderCreate,
  getOrderDeliveryNoticeOrderDetail,
  getOrderDeliveryNoticeOrderCreateDeliveryOrder,
  postOrderReceiveOrderUpdate,
  getOrderReceiveOrderDetail,
  getOrderReceiveOrderDetailProductPage,
} from '@apps/apis'
import moment from 'moment'
import { Deliverylimit } from '../../constants'
import { isNull } from 'lodash'
import { RoleTypeEnum } from '../../constants/RoleTypeEnum'

export class HandleFormSubmit {
  #form: FormInstance
  #tableData: any[]

  constructor(form?: FormInstance) {
    if (form) {
      this.#form = form
    }
  }

  getTableData() {
    if (this.#tableData === undefined) return []
    return this.#tableData.map((v) => {
      return {
        ...v,
        deliveryCount: Number(v.deliveryCount),
        receiveCount: Number(v.receiveCount),
      }
    })
  }

  getGoodsReceipt() {
    return this.#form.getFieldValue('deliveryNo')
  }
  getForm() {
    return this.#form
  }

  setForm(form: FormInstance) {
    this.#form = form
  }

  getSubmitRequest(): (vals: any) => Promise<any> {
    return () => Promise.resolve('')
  }

  setTableData(tableData) {
    this.#tableData = tableData
  }

  handleBeforeFields(): boolean {
    return false
  }

  handleBeforeRequestParamas(...args): any {
    let result = {}
    for (const arg of args) {
      result = { ...result, ...arg }
    }
    return result
  }

  validateFormFields() {
    return this.#form.validateFields().then((values) => {
      var params = this.handleBeforeRequestParamas(values, this.getTableData())
      return this.getSubmitRequest()(params)
    })
  }

  formatField(data) {
    let formField = {
      digest: data?.digest,
      remark: data?.remark,
      sourceNo: data?.sourceNo,
      member: {
        buyerMemberId: data?.buyerMemberId,
        buyerMemberName: data?.buyerMemberName,
        buyerRoleId: data?.buyerRoleId,
        roleType: 2,
        name: data?.buyerMemberName,
      },
      deliveryTime: data?.deliveryTime ? moment(data?.deliveryTime) : moment().startOf('day'),
      deliveryRangeTime: [moment().startOf('day'), moment().endOf('day')],
      receiveVO: {
        ...data?.receiveVO,
        receiverName: data?.receiveVO?.consignee,
        fullAddress: `${data?.receiveVO?.provinceName ?? ''}${data?.receiveVO?.cityName ?? ''}${
          data?.receiveVO?.districtName ?? ''
        }${data?.receiveVO?.streetName ?? ''}`,
      },
      executorVO: {
        ...data?.executorVO,
        fullAddress: `${data?.executorVO?.provinceName ?? ''}${data?.executorVO?.cityName ?? ''}${
          data?.executorVO?.districtName ?? ''
        }${data?.executorVO?.streetName ?? ''}`,
      },
      'executorVO.consignee': data?.executorVO?.consignee,
      'executorVO.phone': data?.executorVO?.phone,
      sendTime: data?.sendTime ? moment(data?.sendTime) : moment().startOf('day'),
      'executorVO.carNumbers': data?.executorVO?.carNumbers,
      'receiveVO.phone': data?.receiveVO?.phone,
      'receiveVO.consignee': data?.receiveVO?.consignee,
      logisticsNo: data?.logisticsNo,
      logisticsCompanyInt: {
        label: data?.logisticsCompany,
        value: data?.logisticsCompanyId,
      },
      deliveryType: data?.deliveryType,
      outerHistoryList: data?.outerHistoryList,
      deliveryNo: data?.deliveryNo,
    }

    if (data?.deliveryVO) {
      formField = Object.assign(formField, {
        deliveryVO: {
          ...data?.deliverVO,
          shipperName: data?.deliverVO?.consignee ?? '',
          fullAddress: `${data?.deliverVO?.provinceName ?? ''}${data?.deliverVO?.cityName ?? ''}${
            data?.deliverVO?.districtName ?? ''
          }${data?.deliverVO?.streetName ?? ''}`,
        },
      })
    }

    return formField
  }

  getDetailById(id: string) {
    ///order/delivery/order/detail
    return getOrderDeliveryOrderDetail({ id }).then((res) => {
      const data = res.data
      let formField = this.formatField(data)
      return formField
    })
  }

  getOrderDeliveryOrderDetailProductPage(payload?: any) {
    return getOrderDeliveryOrderDetailProductPage(payload).then((res) => {
      return res.data
    })
  }

  submit(): Promise<any> {
    if (!this.getTableData()) {
      message.error('请选择送货物料')
      return
    }
    if (this.handleBeforeFields()) return Promise.reject('error')
    return this.validateFormFields()
  }
}

/**
 * 新增后送货单 Service
 */
export class ReceivingNoteAddService extends HandleFormSubmit {
  handleBeforeFields(): boolean {
    let b = this.getTableData().some((v) => Number(v.ConsigneeNum) < v.DeliveryNum)
    if (b) {
      message.error(Deliverylimit)
    }
    return b
  }

  handleBeforeRequestParamas(...args: any[]) {
    let result: any = {}
    result = args[0]

    result.table = args[1].map((v) => {
      return {
        MaterialNo: v.MaterialNo,
        ConsigneeNum: Number(v.ConsigneeNum),
      }
    })

    return result
  }

  getSubmitRequest(): (vals: any) => Promise<any> {
    return (vals: any) => Promise.resolve(vals)
  }
}

/**
 * 新增SRM送货单
 */
export class DeliveryNoteAddService extends HandleFormSubmit {
  handleBeforeFields(): boolean {
    let b = this.getTableData()
      .map((v) => {
        return {
          ...v,
          deliveryCount: v.deliveryCount ? v.deliveryCount : v.purchaseCount,
        }
      })
      .some((v) => {
        return Number(v.deliveryCount) > Number(v.purchaseCount)
      })
    if (b) {
      message.error(Deliverylimit)
    }
    return b
  }

  getSubmitRequest() {
    return postOrderDeliveryOrderSrmCreate
  }

  validateFormFields() {
    return this.getForm()
      .validateFields()
      .then((values) => {
        values = HandelFormFieldsKeyValue(values)
        console.log(values)

        values.deliveryStartTime = values.deliveryRangeTime[0]
        values.deliveryEndTime = values.deliveryRangeTime[1]

        values.deliveryVO.consignee = values?.deliveryVO?.shipperName

        values.buyerRoleId = values.member.buyerRoleId
        values.buyerMemberId = values.member.buyerMemberId
        values.buyerMemberName = values.member.buyerMemberName

        values.receiveVO.consignee = values.receiveVO.shipperName ?? values.receiveVO.consignee

        values.logisticsCompanyId = values?.logisticsCompanyInt?.value ?? ''
        values.logisticsCompany = values?.logisticsCompanyInt?.label ?? ''
        values.sendTime = moment(values.sendTime).format('YYYY-MM-DD HH:mm:ss')

        var params = this.handleBeforeRequestParamas(values, {
          products: this.getTableData().map((v) => {
            return {
              ...v,
              deliveryCount: v.deliveryCount ? v.deliveryCount : v.purchaseCount,
              createTime: moment(v.createTime).format('YYYY-MM-DD HH:mm:ss'),
            }
          }),
        })
        console.log(params)
        return this.getSubmitRequest()(params)
      })
  }
}

export class DeliveryNoteUploadService extends DeliveryNoteAddService {
  handleBeforeFields(): boolean {
    return false
  }

  getSubmitRequest(): any {
    return postOrderDeliveryOrderUpdate
  }
}

//新增送货单B2B
export class ReceivingNoteB2BAddService extends DeliveryNoteAddService {
  getSubmitRequest() {
    return postOrderDeliveryOrderB2bCreate
  }
}

export class DeliveryNoteB2bUploadService extends DeliveryNoteUploadService {}

export class ReceiveOrderCreate extends DeliveryNoteAddService {
  handleBeforeFields(): boolean {
    return false
  }

  handleBeforeRequestParamas(...arg) {
    return {
      ...arg[0],
      products: this.getTableData().map((v) => {
        return {
          deliveryOrderProductId: v.id,
          receiveCount: Number(v.receiveCount ? v.receiveCount : v.deliveryCount),
        }
      }),
    }
  }

  validateFormFields(): Promise<any> {
    return this.getForm()
      .validateFields()
      .then((values) => {
        values = HandelFormFieldsKeyValue(values)
        values.receiveTime = values.receiveTime + ' 08:00:00'
        values.goodsReceipt = this.getGoodsReceipt()
        values.url = values.url
        var params = this.handleBeforeRequestParamas(values)
        return this.getSubmitRequest()(params)
      })
  }

  getSubmitRequest(): (vals: any) => Promise<any> {
    return postOrderReceiveOrderCreate
  }

  getDetailById(id: string): any {
    return getOrderDeliveryOrderDetail({ id }).then((res) => {
      const data = res.data
      return data
    })
  }

  formatField(data): any {
    let formField = {
      digest: data.digest,
      remark: data.remark,
      member: {
        buyerMemberId: data.buyerMemberName,
        buyerMemberName: data.buyerMemberName,
        buyerRoleId: data.vendorMemberId,
        roleType: 2,
        name: data.buyerMemberName,
      },
      deliveryTime: data.deliveryTime ? moment(data.deliveryTime) : moment().startOf('day'),
      deliveryRangeTime: [moment().startOf('day'), moment().endOf('day')],
      deliveryVO: {
        ...data.deliverVO,
        shipperName: data.deliverVO?.consignee,
        fullAddress: FormatFullAddress(data.deliverVO),
      },
      receiveVO: {
        ...data.receiveVO,
        receiverName: data.receiveVO?.consignee,
        fullAddress: FormatFullAddress(data.receiveVO),
      },
      'executorVO.phone': data.executorVO.phone,
      sendTime: moment(data.sendTime),
      receiveTime: moment(data.receiveTime),
      'executorVO.carNumbers': data.executorVO.carNumbers,
      'receiveVO.phone': data.receiveVO.phone,
      logisticsNo: data.logisticsNo,
      logisticsCompanyInt: {
        label: data.logisticsCompany,
        value: data.logisticsCompanyId,
      },
      deliveryType: data?.deliveryType,
      outerHistoryList: data.outerHistoryList,
      deliveryNo: data.deliveryNo,
    }
    console.log(formField)

    return formField
  }

  getOrderDeliveryOrderDetailProductPage(id): Promise<any> {
    return getOrderDeliveryOrderDetailProductPage({ id, current: '1', pageSize: '10' }).then((res) => {
      return res.data
    })
  }
}

export class ReceiveOrderUpdate extends ReceiveOrderCreate {
  getSubmitRequest(): (vals: any) => Promise<any> {
    ///order/receive/order/update
    return postOrderReceiveOrderUpdate
  }

  getOrderDeliveryOrderDetailProductPage(id): Promise<any> {
    return getOrderReceiveOrderDetailProductPage({ id, current: '1', pageSize: '10' }).then((res) => {
      return res.data
    })
  }
}
export class DeliveryNoticeOrderAddService extends DeliveryNoteAddService {
  #formService: HandleFormSubmit

  getDetailById(id: string): any {
    return getOrderDeliveryNoticeOrderCreateDeliveryOrder({ id }).then((res) => {
      const data: any = res.data

      if (isNull(data)) return false

      let formField = {
        digest: data.digest,
        member: {
          buyerMemberId: data.buyerMemberId,
          buyerMemberName: data.buyerMemberName,
          buyerRoleId: data.buyerRoleId,
          roleType: 2,
          name: data.buyerMemberName,
        },
        deliveryTime: moment(data.deliveryTime),
        deliveryRangeTime: [
          moment('1990-10-10 ' + data.deliveryStartTime),
          moment('1990-10-10 ' + data.deliveryEndTime),
        ],
        receiveVO: {
          ...data.receiveVO,
          receiverName: data.receiveVO.consignee,
          fullAddress:
            (data.receiveVO.provinceName ?? '') +
            (data.receiveVO.cityName ?? '') +
            (data.receiveVO.districtName ?? '') +
            (data.receiveVO.streetName ?? '') +
            (data.receiveVO.address ?? ''),
        },
        'receiveVO.phone': data.receiveVO.phone,
        products: data.products,
        orderType: data.orderType,
        sourceNo: data.sourceNo,
      }
      return formField
    })
  }

  setFormService(type: string | number) {
    if (type == RoleTypeEnum.SRM) {
      this.#formService = new DeliveryNoteAddService(this.getForm())
    }

    if (type == RoleTypeEnum.B2B) {
      this.#formService = new ReceivingNoteB2BAddService(this.getForm())
    }
  }

  getForomService() {
    return this.#formService
  }
}

function ValueNotToStringBlank(value) {
  return isNull(value) ? '' : value
}

export function FormatFullAddress(addr) {
  return (
    ValueNotToStringBlank(addr?.provinceName) +
    ValueNotToStringBlank(addr?.cityName) +
    ValueNotToStringBlank(addr?.districtName) +
    ValueNotToStringBlank(addr?.streetName)
  )
}
