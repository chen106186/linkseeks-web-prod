import { action, makeObservable, observable, runInAction } from 'mobx'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import { getLogisticsShipperAddressGet, postLogisticsFreightTemplateCalFreightPrice } from '@apps/apis'
import { getSettlementMobileInvoiceMessageGetDefaultInvoice } from '@apps/apis'
import { RootStoreModel } from '../rootStore/model'
import {
  ConfirmOrderStoreModel,
  AddressType,
  InvoiceType,
  SupplierType,
  productFormatType,
  LogisticType,
  PurchaseOrderType,
  orderMessageType,
} from './model'
/**
 * 从 勾选的购物车列表中筛选商品, 这里暂时写any， 往后跟 购物车一起修改
 * @param data
 * @param checkedKeysList
 */
const getCheckedInPurchaseList = (data: PurchaseOrderType, checkedKeysList: string[]) => {
  const shouldGetAddress: LogisticType = {}
  const shouCalcFreight: LogisticType = {}
  const productCheckedList = checkedKeysList.filter((item) => /\d+-\d+-\d+$/.test(item))
  // 商品
  const commodityChecked = Array.from(
    new Set(productCheckedList.map((_item) => _item.split('-').slice(0, 2).join('-'))),
  )
  const result: PurchaseOrderType = {}
  // 只要进到确认订单，那么这里就已经是同一个工作流，同一供应商
  const [prefixStore] = productCheckedList[0].split('-')
  const _item = `store-${prefixStore}`
  const { products, ...rest } = data[_item]
  const supplier = {
    memberId: rest.memberId,
    memberRoleId: rest.memberRoleId,
    id: rest.storeId,
    name: rest.storeName,
  }
  let deliveryType = DELIVERY_TYPE_ENUM.LOGISTICS
  result[_item] = {
    ...data[_item],
    products: {},
  }
  Object.keys(products).forEach((_row) => {
    const { orderList } = products[_row]
    const parentFlag = commodityChecked.includes(products[_row].dataIndex)
    if (!parentFlag) {
      return
    }
    result[_item].products[_row] = {
      ...data[_item].products[_row],
      orderList: [],
    }

    orderList.forEach((element: any) => {
      const {
        dataIndex,
        commodityUnitPrice: {
          commodity: { logistics },
        },
        count,
      } = element
      const flag = productCheckedList.includes(dataIndex)
      // console.log(flag);
      if (!flag) {
        return
      }
      deliveryType = logistics.deliveryType
      if (logistics.deliveryType === DELIVERY_TYPE_ENUM.SELF_PICKUP) {
        shouldGetAddress[dataIndex] = { ...logistics, count }
      } else if (logistics.deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS) {
        shouCalcFreight[dataIndex] = { ...logistics, count }
      }
      result[_item].products[_row].orderList.push(element)
    })
  })
  return {
    shouldGetAddress,
    confirmOrderList: result,
    supplier,
    shouCalcFreight,
    deliveryType,
  }
}

const getSkuName = (productName: string | undefined, attributeAndValueList: any) => {
  const string = productName
  const attribute = attributeAndValueList
    ?.map((_attribute: any) => `${_attribute.customerAttribute.name}: ${_attribute.customerAttributeValue.value}`)
    .join('/')
  if (attribute === '') {
    return string
  }
  return `${string}/${attribute}`
}

/**
 * 根据商品生成提交订单商品格式
 */
const generateOrderFormat = (
  purchaseOrderList: PurchaseOrderType,
): { orderProductList: productFormatType[]; idList: number[] } => {
  const result: productFormatType[] = []
  const idList: number[] = []
  const keys = Object.keys(purchaseOrderList)
  keys.forEach((_item) => {
    const { products } = purchaseOrderList[_item]
    const productsKey = Object.keys(products)
    productsKey.forEach((_row) => {
      const { orderList } = products[_row]
      orderList.forEach((_record) => {
        const {
          commodityUnitPrice: { id, commodityUnitPriceAndPicId, commodity, attributeAndValueList },
          count,
          showPrice,
        } = _record
        const newObject = {
          // 如果是渠道商城，那么productid 跟channelProductId 互换， 这里直接判断commodityUnitPriceAndPicId是否为null
          productId: id as number,
          channelProductId: commodityUnitPriceAndPicId,
          minOrder: commodity?.minOrder as number,
          imgUrl: commodity?.mainPic,
          productName: getSkuName(commodity?.name, attributeAndValueList),
          category: commodity?.customerCategory?.name as string,
          brand: commodity?.brand?.name as string,
          unit: commodity?.unitName,
          price: showPrice,
          purchaseCount: count,
          deliveryType: commodity?.logistics?.deliveryType,
          isMemberPrice: (commodity?.isMemberPrice as unknown as number) ? 1 : 0,
          memberId: commodity?.memberId,
          memberRoleId: commodity?.memberRoleId,
          logistics: commodity?.logistics,
        }
        result.push(newObject)
        // 直接购买的话直接去除idList
        if (!_record.id?.toString().includes('zx')) {
          idList.push(_record.id)
        }
      })
    })
  })

  return {
    orderProductList: result,
    idList,
  }
}

export default class ConfirmOrderStore implements ConfirmOrderStoreModel {
  private rootStore: RootStoreModel

  currentOrderCheckedKeys: string[] = []
  // 存储自提门店地址
  orderstore: any = {}
  /**
   * 订单金额， 这里不包含运费
   */
  orderAmount: number = 0

  orderInfo: Partial<any> = {}

  deliveryType: number = 0

  addressInfo: AddressType | null = null

  selfPickupInfo: any | null = null

  invoiceInfo: InvoiceType | null = null

  supplierInfo: SupplierType | null = null

  /**
   * 运费
   */
  freightTotal: number = 0

  orderMessage: orderMessageType = {
    vendorMemberId: 0,
    vendorRoleId: 0,
    storeId: 0,
    orderIds: [],
    paymentRequired: false,
    fundMode: 0,
    batchNo: 0,
    payType: 0,
    payChannel: 0,
    payAmount: 0,
    tradeNo: '',
  }

  list: PurchaseOrderType = {} // 这个any 属性 应该跟purchaseOrderStore 一同修改

  paymentInfo: any = null

  // 邀请码
  socialDistributionInvitationCode: string = ''

  constructor(rootStore: RootStoreModel) {
    makeObservable(this, {
      currentOrderCheckedKeys: observable,
      orderAmount: observable,
      addressInfo: observable,
      selfPickupInfo: observable,
      invoiceInfo: observable,
      supplierInfo: observable,
      deliveryType: observable,
      list: observable,
      freightTotal: observable,
      initOrderList: action.bound,
      setInvoiceInfo: action.bound,
      setAddressInfo: action.bound,
      setSelfPickupInfo: action.bound,
      setDeliveryType: action.bound,
      setFreightTotal: action.bound,
      getDefaultInvoice: action.bound,
      paymentInfo: observable,
      setPaymentInfo: action.bound,
      orderInfo: observable,
      setOrderInfo: action.bound,
      clearOrderInfo: action.bound,
      clearAll: action.bound,
      orderMessage: observable,
      setOrderMessage: action.bound,
      orderstore: observable,
      setstoreItem: action.bound,
      socialDistributionInvitationCode: observable,
      setSocialDistributionInvitationCode: action.bound,
    })
    this.rootStore = rootStore
  }

  setAddressInfo(addressData: AddressType | null) {
    this.addressInfo = addressData
    // console.log(addressData);
    const orderAddressInfo = {
      deliveryAddresId: addressData?.id,
      isDefault: addressData?.isDefault,
      fullAddress: addressData?.fullAddress,
      phone: addressData?.phone,
      receiverName: addressData?.receiverName,
    }
    this.setOrderInfo(orderAddressInfo)
  }

  setSelfPickupInfo(data: any | null) {
    this.selfPickupInfo = data
  }

  setDeliveryType(data: number = 0) {
    this.deliveryType = data
  }

  /**
   * 确认订单 商品展示列表
   * @param data  purchaseOrderList 购物车列表
   * @param checkedKeysList 选中的商品的id  已 ${storeid}-${shopid}-${id} 的形式返回， 即 供应商id - 商品id - sku id
   */
  async initOrderList(data: PurchaseOrderType, checkedKeysList: string[], amount: number) {
    let freightTotal = 0
    // console.error(data);
    const { shouldGetAddress, confirmOrderList, supplier, shouCalcFreight, deliveryType } = getCheckedInPurchaseList(
      data,
      checkedKeysList,
    )
    const shouldGetAddressKeys = Object.keys(shouldGetAddress)
    const freightKeys = Object.keys(shouCalcFreight)
    const tempAddressInfo = this.addressInfo
    if (tempAddressInfo !== null && freightKeys.length > 0) {
      // 这里需要过滤一下，计算运费模板
      const logisticsIds = freightKeys
        .map((_item) => {
          const { templateId, weight, count } = shouCalcFreight[_item]
          return {
            templateId: templateId as number,
            weight: weight as number,
            count,
          }
        })
        .filter((_row) => _row.templateId !== null)
      if (logisticsIds.length > 0) {
        const freight = await postLogisticsFreightTemplateCalFreightPrice({
          orderProductList: logisticsIds,
          receiverAddressId: tempAddressInfo.id,
        })
        freightTotal = freight.code === 1000 ? freight.data : 0
      }
    }
    if (shouldGetAddressKeys.length === 0) {
      const { orderProductList, idList } = generateOrderFormat(confirmOrderList)
      // console.error(confirmOrderList);
      runInAction(() => {
        this.currentOrderCheckedKeys = checkedKeysList
        this.list = confirmOrderList
        this.supplierInfo = supplier
        this.freightTotal = freightTotal
        this.deliveryType = deliveryType
        this.paymentInfo = null
        this.invoiceInfo = null
        this.orderAmount = amount
        this.setOrderInfo({
          idList,
          orderProductRequests: orderProductList,
          deliveryType: this.deliveryType,
          supplyMembersId: supplier.memberId,
          supplyMembersRoleId: supplier.memberRoleId,
          supplyMembersName: supplier.name,
        })
      })
      return
    }
    const temp: any = {}
    shouldGetAddressKeys.forEach((_item) => {
      const [store, commodity] = _item.split('-')
      temp[`${store}-${commodity}`] = shouldGetAddress[_item]
    })
    const shouldGetAddressKeysRequestMap = Object.keys(temp).map((_row) =>
      getLogisticsShipperAddressGet({ id: temp[_row].sendAddressId.toString() }),
    )
    // 购物车需要判断一下是否是自提，如果是那么获取一下地址， 这里针对于商品
    const res = await Promise.all(shouldGetAddressKeysRequestMap)
    Object.keys(temp).forEach((_row, key) => {
      const [storeID, shopId] = _row.split('-')
      const { products } = confirmOrderList[`store-${storeID}`]
      const targetShop = products[`commodity-${shopId}`]
      if (targetShop) {
        products[`commodity-${shopId}`] = {
          ...targetShop,
          logisticsDetail: res[key].code === 1000 ? res[key].data : null,
        }
      }
    })
    const { orderProductList, idList } = generateOrderFormat(confirmOrderList)
    runInAction(() => {
      this.list = { ...confirmOrderList }
      this.currentOrderCheckedKeys = checkedKeysList
      this.orderAmount = amount
      this.supplierInfo = supplier
      this.freightTotal = freightTotal
      this.deliveryType = deliveryType
      this.paymentInfo = null
      this.invoiceInfo = null
      // if (tempAddressInfo) {
      //   this.setAddressInfo(tempAddressInfo)
      // }
      this.setOrderInfo({
        orderProductRequests: orderProductList,
        deliveryType,
        idList,
        supplyMembersId: supplier.memberId,
        supplyMembersRoleId: supplier.memberRoleId,
        supplyMembersName: supplier.name,
      })
    })
  }

  /**
   * 获取默认的发票信息
   */
  async getDefaultInvoice(memberId: number, roleId: number) {
    const { data, code } = await getSettlementMobileInvoiceMessageGetDefaultInvoice({
      memberId: memberId.toString(),
      roleId: roleId.toString(),
    })
    if (code === 1000) {
      runInAction(() => {
        this.invoiceInfo = data
      })
    }
  }

  setInvoiceInfo(invoiceData: InvoiceType) {
    this.invoiceInfo = invoiceData
    this.setOrderInfo({
      needTheInvoice: invoiceData !== null ? 1 : 0,
      theInvoiceId: invoiceData.id,
    })
  }

  setPaymentInfo(paymentInfo: any) {
    this.paymentInfo = paymentInfo
  }

  setOrderInfo(orderInfo: Partial<any>) {
    this.orderInfo = { ...this.orderInfo, ...orderInfo }
  }
  /**
   * 设置自提门店地址
   */
  setstoreItem(data: any) {
    // console.log(data, '这个是点击传入的')
    this.orderstore = data
  }

  /**
   * 设置运费
   */
  setFreightTotal() {
    this.freightTotal = 1000
  }
  /**
   * 设置订单数据
   */
  setOrderMessage(data: orderMessageType) {
    this.orderMessage = data
  }

  /**
   * 设置邀请码
   */
  setSocialDistributionInvitationCode(code: string) {
    this.socialDistributionInvitationCode = code || ''
  }

  clearOrderInfo() {
    this.orderInfo = {}
  }

  /**
   * 提交完成后清空数据
   */
  clearAll() {
    this.orderInfo = {}
    this.deliveryType = 0
    this.addressInfo = null
    this.selfPickupInfo = null
    this.invoiceInfo = null
    this.supplierInfo = null
    this.freightTotal = 0
    this.list = {}
    this.paymentInfo = null
    this.socialDistributionInvitationCode = ''
  }
}
