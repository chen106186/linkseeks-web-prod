import { HandelFormFieldsKeyValue } from '@/utils/form'
import { FormInstance, message } from 'antd'
import {
  getOrderDeliveryOrderDetail,
  getOrderDeliveryOrderDetailProductPage,
  postOrderDeliveryOrderSrmCreate,
  postOrderDeliveryOrderUpdate,
  postOrderDeliveryOrderB2bCreate,
  postOrderReceiveOrderCreate,
  getOrderDeliveryNoticeOrderCreateDeliveryOrder,
  postOrderReceiveOrderUpdate,
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
      const params = this.handleBeforeRequestParamas(values, this.getTableData())
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
        fullAddress:
          data?.executorVO?.provinceName ??
          '' + data?.executorVO?.cityName ??
          '' + data?.executorVO?.districtName ??
          '' + data?.executorVO?.streetName ??
          '',
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
      const formField = this.formatField(data)
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
    // 下单仓库 关联物料相关逻辑
    if (this.#form.getFieldValue('warehousingOrderProductDetailVOS')) {
      const warehousingOrderProductDetailVOS = this.#form.getFieldValue('warehousingOrderProductDetailVOS')
      if (warehousingOrderProductDetailVOS?.length > 0) {
        for (const key in warehousingOrderProductDetailVOS) {
          if (
            warehousingOrderProductDetailVOS[key]['inboundWarehouseId'] &&
            !warehousingOrderProductDetailVOS[key]['goodsId']
          ) {
            message.error('请选择关联物料')
            return
          }
        }
      }
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
    const b = this.getTableData().some((v) => Number(v.ConsigneeNum) < v.DeliveryNum)
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
    const b = this.getTableData()
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
        const _values: any = HandelFormFieldsKeyValue(values)
        console.log(values)

        _values.deliveryStartTime = _values.deliveryRangeTime[0]
        _values.deliveryEndTime = _values.deliveryRangeTime[1]

        _values.deliveryVO.consignee = _values?.deliveryVO?.shipperName

        _values.buyerRoleId = _values.member.buyerRoleId
        _values.buyerMemberId = _values.member.buyerMemberId
        _values.buyerMemberName = _values.member.buyerMemberName

        _values.receiveVO.consignee = _values.receiveVO.shipperName ?? _values.receiveVO.consignee

        _values.logisticsCompanyId = _values?.logisticsCompanyInt?.value ?? ''
        _values.logisticsCompany = _values?.logisticsCompanyInt?.label ?? ''
        _values.sendTime = moment(_values.sendTime).format('YYYY-MM-DD HH:mm:ss')

        const params = this.handleBeforeRequestParamas(_values, {
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
  validateFormFields() {
    return this.getForm()
      .validateFields()
      .then((values) => {
        console.log(values)
        const _values: any = HandelFormFieldsKeyValue(values)
        console.log(values)

        _values.deliveryStartTime = _values.deliveryRangeTime[0]
        _values.deliveryEndTime = _values.deliveryRangeTime[1]

        _values.deliveryVO.consignee = _values?.deliveryVO?.shipperName

        _values.buyerRoleId = _values.member.buyerRoleId
        _values.buyerMemberId = _values.member.buyerMemberId
        _values.buyerMemberName = _values.member.buyerMemberName

        _values.receiveVO.consignee = _values.receiveVO.shipperName ?? _values.receiveVO.consignee

        _values.logisticsCompanyId = _values?.logisticsCompanyInt?.value ?? ''
        _values.logisticsCompany = _values?.logisticsCompanyInt?.label ?? ''
        _values.sendTime = moment(_values.sendTime).format('YYYY-MM-DD HH:mm:ss')

        const params = this.handleBeforeRequestParamas(_values, {
          products: this.getTableData().map((v) => {
            return {
              ...v,
              deliveryCount: v.deliveryCount ? v.deliveryCount : v.purchaseCount,
              createTime: moment(v.createTime).format('YYYY-MM-DD HH:mm:ss'),
              outOfStockOrderProductDetailVO: {
                goodsId: v?.goodsId,
                skuId: v?.skuId,
                name: v?.productName,
                category: v?.category,
                brand: v?.brand,
                unit: v?.unit,
                spec: v?.spec,
                outOfStockId: values?.outOfStockId,
                warehouseRole: values?.warehouseRole,
                orderNo: v?.orderNo,
                received: v.deliveryCount ? v.deliveryCount : v.leftCount,
              },
            }
          }),
        })
        console.log(params)
        return this.getSubmitRequest()(params)
      })
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
        const _values: any = HandelFormFieldsKeyValue(values)
        _values.receiveTime = _values.receiveTime + ' 08:00:00'
        _values.goodsReceipt = this.getGoodsReceipt()
        _values.url = _values.url
        const params = this.handleBeforeRequestParamas(_values)
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
    const formField = {
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

      const formField = {
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
