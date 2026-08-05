import { usePageStatus } from '@/hooks/usePageStatus'
import { useEffect, useState } from 'react'
import { Form } from 'antd'
import {
  getProductSelectGetWarehouse,
  GetProductSelectGetWarehouseResponse,
  getOrderCollectiveDetail,
  GetOrderCollectiveDetailResponse,
} from '@apps/apis'
import { ProductItemType } from '../components/orderProducts'
import moment from 'moment'
import { StandardFormTable } from '@apps/components'
import { INQUIRY_SOURCE_TYPE } from '../form'

const useSourcingOrder = () => {
  const { id } = usePageStatus()
  const [skuList, setSkuList] = useState<ProductItemType[]>()
  const [orderDetail, setOrderDetail] = useState<GetOrderCollectiveDetailResponse>()
  const [warehouseOptions, setWarehouseOptions] = useState<GetProductSelectGetWarehouseResponse>([])
  const [sourceType, setSourceType] = useState<number>(INQUIRY_SOURCE_TYPE)
  const [form] = Form.useForm()
  const productsRef = StandardFormTable.useTableRef()

  // 获取下单仓库
  const fetchWarehouseOptions = async () => {
    const { data } = await getProductSelectGetWarehouse()
    setWarehouseOptions(data)
    return data
  }

  const normalizeProducts = (detail: GetOrderCollectiveDetailResponse) => {
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
    // 修改订单
    if (id) {
      getOrderCollectiveDetail({ orderId: id }).then(async (res) => {
        if (res.code === 1000 && res.data) {
          setOrderDetail(res.data)
          form.setFieldsValue({
            quoteId: res.data.quoteId,
            quoteNo: res.data.quoteNo,
            inquiryId: res.data.inquiryId,
            inquiryNo: res.data.inquiryNo,
            vendorMemberName: res.data.vendorMemberName,
            vendorMemberId: res.data.vendorMemberId,
            vendorRoleId: res.data.vendorRoleId,
            digest: res.data.digest,
            warehouseId: res.data.warehouseId,
            warehouseName: res.data.warehouseName,
            shopId: res.data.shopId,
            shopName: res.data.shopName,
            products: normalizeProducts(res.data),
            deliverDate: moment(res.data.consignee?.deliverDate),
            requirement: res.data.requirement,
            isInvoice: res.data.invoice?.invoiceId ? true : false,
            orderMode: res.data.orderMode,
          })
          setSourceType(Number(res.data.orderMode))
          productsRef.current?.reload()
        }
      })
    }
  }, [])

  return {
    form,
    skuList,
    warehouseOptions,
    orderDetail,
    productsRef,
    sourceType,
    setSourceType,
  }
}

export default useSourcingOrder
