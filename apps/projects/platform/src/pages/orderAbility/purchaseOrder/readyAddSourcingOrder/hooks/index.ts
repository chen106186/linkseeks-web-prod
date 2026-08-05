import { usePageStatus } from '@/hooks/usePageStatus'
import { useEffect, useState } from 'react'
import { Form } from 'antd'
import {
  getTradeAskPurchaseAskPurchaseQuoteDetail,
  postProductMobileCommodityGetCommodityByCommoditySkuIdList,
  getProductSelectGetWarehouse,
  GetProductSelectGetWarehouseResponse,
  getOrderBuyerDetail,
  GetOrderBuyerDetailResponse,
  getLogisticsSelectListMemberShipperAddress,
} from '@apps/apis'
import { ProductItemType } from '../components/orderProducts'
import moment from 'moment'

const useSourcingOrder = () => {
  const { awardBidQuoteId, id } = usePageStatus()
  const [skuList, setSkuList] = useState<ProductItemType[]>()
  const [orderDetail, setOrderDetail] = useState<GetOrderBuyerDetailResponse>()
  const [warehouseOptions, setWarehouseOptions] = useState<GetProductSelectGetWarehouseResponse>([])
  const [form] = Form.useForm()

  // 获取下单仓库
  const fetchWarehouseOptions = async () => {
    const { data } = await getProductSelectGetWarehouse()
    setWarehouseOptions(data)
    return data
  }

  const getQuoteOrderInfo = async (id: string) => {
    const res = await getTradeAskPurchaseAskPurchaseQuoteDetail({ id })
    if (res.code === 1000 && res.data) {
      form.setFieldsValue({
        digest: res.data.name,
        askPurchaseQuoteNo: res.data.quoteNo,
        vendorMemberName: res.data.memberName,
        vendorMemberId: res.data.memberId,
        vendorRoleId: res.data.memberRoleId,
        askPurchaseQuoteId: id,
      })

      if (res.data.askPurchaseQuoteGoodsResponses && res.data.askPurchaseQuoteGoodsResponses.length > 0) {
        const idList = res.data.askPurchaseQuoteGoodsResponses.filter((item) => item.skuId).map((item) => item.skuId)
        if (idList.length === 0) return
        postProductMobileCommodityGetCommodityByCommoditySkuIdList({ idList }, { ctlType: 'none' }).then(
          async (skuRes) => {
            if (skuRes.code === 1000 && skuRes.data && skuRes.data.length > 0) {
              let selfPickupAddress: any = undefined
              if (
                skuRes.data.some((item) => item.logistics?.deliveryType === 2 || item.logistics?.deliveryType === 4)
              ) {
                const { data: deliveryAddress } = await getLogisticsSelectListMemberShipperAddress({
                  memberId: res.data.memberId,
                  roleId: res.data.memberRoleId,
                })
                if (deliveryAddress && deliveryAddress.length > 0) {
                  selfPickupAddress = deliveryAddress[0]
                }
              }

              const products = skuRes.data.map((item) => {
                const commodityItem = res.data.askPurchaseQuoteGoodsResponses.find(
                  (goodsItem) => goodsItem.skuId === item.id,
                )

                return {
                  supplyMemberId: item.upperMemberId,
                  supplyRoleId: item.upperMemberRoleId,
                  supplyMemberName: item.upperMemberRoleName,
                  productId: item.commodityId,
                  skuId: item.id,
                  name: item.name,
                  category: item.customerCategoryName,
                  brand: item.brandName,
                  memberId: item.memberId,
                  memberRoleId: item.memberRoleId,
                  unit: item.unitName,
                  logo: item.mainPic,
                  spec: item.attribute,
                  price: commodityItem?.unitPriceWithTax || 0,
                  priceType: item.priceType,
                  quantity: commodityItem?.num || 0,
                  discount: 1,
                  tax: item.taxRate ? true : false,
                  taxRate: item.taxRate,
                  isCrossBorder: item.isCrossBorder,
                  deliveryType: item.logistics?.deliveryType === 4 ? 1 : item.logistics?.deliveryType || 1,
                  editDeliveryType: item.logistics?.deliveryType === 4 ? true : false,
                  stock: item.stockCount || 0,
                  weight: item.logistics?.weight,
                  logisticsTemplateId: item.logistics?.templateId,
                  shopId: commodityItem?.shopId,
                  shopName: commodityItem?.shopName,
                  address: selfPickupAddress?.fullAddress,
                  receiver: selfPickupAddress?.shipperName,
                  phone: selfPickupAddress?.phone,
                }
              })
              setSkuList(products)
            }
          },
        )
      }
    }
  }

  const normalizeProducts = (detail: GetOrderBuyerDetailResponse) => {
    if (detail.product && detail.product.products.length > 0) {
      return detail.product.products.map((item) => ({
        productId: item.productId,
        skuId: item.skuId,
        name: item.name,
        category: item.category,
        brand: item.brand,
        memberId: detail.vendorMemberId,
        memberRoleId: detail.vendorRoleId,
        unit: item.unit,
        logo: item.logo,
        spec: item.spec,
        price: item.price,
        priceType: item.priceType,
        quantity: item.quantity,
        discount: Number(item.discount) / 100,
        tax: item.taxRate ? true : false,
        taxRate: item.taxRate,
        isCrossBorder: false,
        deliveryType: item.deliverType,
        editDeliveryType: false,
        stock: item.stock,
        weight: item.weight,
        logisticsTemplateId: item.logisticsTemplateId,
        shopId: detail.shopId,
        shopName: detail?.shopName,
      }))
    }
    return []
  }

  useEffect(() => {
    fetchWarehouseOptions()
    if (awardBidQuoteId) {
      getQuoteOrderInfo(awardBidQuoteId)
    }
    // 修改订单
    if (id) {
      getOrderBuyerDetail({ orderId: id }).then(async (res) => {
        if (res.code === 1000 && res.data) {
          setOrderDetail(res.data)
          await getQuoteOrderInfo(String(res.data.quoteId))
          form.setFieldsValue({
            warehouseId: res.data.warehouseId,
            warehouseName: res.data.warehouseName,
            shopId: res.data.shopId,
            shopName: res.data.shopName,
            products: normalizeProducts(res.data),
            deliverDate: moment(res.data.consignee?.deliverDate),
            requirement: res.data.requirement,
            isInvoice: res.data.invoice?.invoiceId ? true : false,
          })
        }
      })
    }
  }, [])

  return {
    form,
    skuList,
    warehouseOptions,
    orderDetail,
    getQuoteOrderInfo,
  }
}

export default useSourcingOrder
