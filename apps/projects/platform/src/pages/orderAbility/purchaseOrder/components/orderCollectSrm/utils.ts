import { OrderMaterialsConfirmValue } from './components/orderMaterialsDrawer'
import { PostOrderMaterialData } from './interface'

/**
 * 订单物料数据 转 新增SRM订单商品数据
 * @param dataSource 订单物料数据
 * @returns 新增SRM订单商品数据
 */
export const convertOrderMaterialData = (dataSource: OrderMaterialsConfirmValue[0]): PostOrderMaterialData => ({
  productId: dataSource.id,
  productNo: dataSource.materielNo,
  name: dataSource.materielName,
  category: dataSource.category,
  brand: dataSource.brand,
  spec: dataSource.type,
  unit: dataSource.unit,
  tax: dataSource.isHasTax === 1,
  taxRate: dataSource.taxRate,
  deliveryType: undefined,
  price: dataSource.price,
  stock: dataSource.supplierInventory,
  quantity: dataSource.requisitionList?.reduce((pre, now) => (now as any).orderQuantity + pre, 0) || 0,
  requisitions:
    dataSource.requisitionList?.map(({ detailId, ...rest }) => ({
      requisitionId: detailId,
      requisitionProductId: (rest as any).requisitionProductId,
      orderQuantity: (rest as any).orderQuantity,
    })) || [],
  quotedSkuId: dataSource.associatedDataId,
  quotedName: dataSource.associatedGoods,
  quotedSpec: dataSource.associatedType,
  quotedCategory: dataSource.associatedCategory,
  quotedBrand: dataSource.associatedBrand,
  key: dataSource.key,
})

/**
 * SRM订单详情商品数据 转 订单物料数据，用于编辑时初始订单物料抽屉数据
 * @param dataSource SRM订单详情商品数据
 * @returns 订单物料数据
 */
export const convertOrderMaterialDataSource = (dataSource: PostOrderMaterialData[]): OrderMaterialsConfirmValue => {
  const ret: OrderMaterialsConfirmValue = []
  dataSource.forEach((item) => {
    ret.push({
      id: item.productId,
      materielNo: item.productNo,
      materielName: item.name,
      category: item.category,
      brand: item.brand,
      type: item.spec,
      unit: item.unit,
      isHasTax: item.tax ? 1 : 0,
      taxRate: item.taxRate,
      price: item.price,
      supplierInventory: item.stock,
      requisitionList:
        item.requisitions?.map(({ requisitionId, orderQuantity }) => ({
          detailId: requisitionId,
          orderQuantity: orderQuantity,
        })) || undefined,
      associatedDataId: item.quotedSkuId,
      associatedGoods: item.quotedName,
      associatedType: item.quotedSpec,
      associatedCategory: item.quotedCategory,
      associatedBrand: item.quotedBrand,
    } as unknown as OrderMaterialsConfirmValue[0])
  })
  return ret
}
