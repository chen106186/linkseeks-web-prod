export const OPREATION_MAP = {
  pause: 1, //中止
  cancel: 2, //取消
  audit1: 3, //审核一级
  audit2: 4, //审核二级
}

/** 修改请购单 初始值转换 */
export const procurmentRenderInit = (initValue: any) => {
  return {
    vendorMemberId: initValue.vendorMemberId,
    vendorMemberName: initValue.vendorMemberName,
    vendorRoleId: initValue.vendorRoleId,
    products: initValue.product.products,
    requisitionNo: initValue.requisitionNo,
    innerStatusName: initValue.innerStatusName,
    createTime: initValue.createTime,
    department: initValue.department,
    departmentId: initValue.departmentId,
    requisitionId: initValue.requisitionId,
    deliverTime: initValue.deliverTime,
    creator: initValue.creator,
    purpose: initValue.purpose,
    digest: initValue.digest,
    advanceDeliveryDate: initValue.advanceDeliveryDate,
    deliveryMethod: initValue.deliveryMethod,
    deliveryType: initValue.deliveryType,
    requisitioner: initValue.requisitioner,
    requisitionerId: initValue.requisitionerId,
    deliveryAddressId: initValue.deliveryAddressId,
    deliveryAddress: initValue.deliveryAddress,
    attachments: initValue.attachments,
  }
}
