import { getWebIntl } from '@apps/locales'
import { getIntl } from '@linkseeks/i18n'

const translate = getWebIntl()
/** 修改请购单 初始值转换 */
export const procurmentRenderInit = (initValue: any) => {
  return {
    vendorMemberId: initValue.vendorMemberId,
    vendorMemberName: initValue.vendorMemberName,
    vendorRoleId: initValue.vendorRoleId,
    product: initValue.product,
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
    requisitioner: initValue.requisitioner,
    requisitionerId: initValue.requisitionerId,
    deliveryAddressId: initValue.receiverAddressResponse,
    deliveryAddress: initValue.deliveryAddress,
    warehouseId: initValue.warehouseId,
    warehouseName: initValue.warehouseName,
  }
}

/** 修改请购单 回显物料字段转换 */
export const procurementRenderField = (data) => {
  const _orderProductRequests = data.product.products
  return _orderProductRequests.map((item) => {
    return {
      ...item,
      id: item.productId,
      code: item.productNo,
      type: item.spec,
      memberId: data.vendorMemberId,
      memberRoleId: data.vendorRoleId,
    }
  })
}

/** 采购合同下单 字段转换 */
export const procurementProcessField = (value) => {
  value.products = value.products.map((item) => {
    return {
      ...item,
      productId: item.id,
      productNo: item.code,
      spec: item.type,
    }
  })
  return value
}

//  会员列
export const memberColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.huiyuanID', defaultMessage: '会员ID' }),
    dataIndex: 'memberId',
    align: 'center',
    key: 'memberId',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.huiyuanmingcheng', defaultMessage: '会员名称' }),
    dataIndex: 'name',
    align: 'center',
    key: 'name',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.gongsileixing', defaultMessage: '公司类型' }),
    dataIndex: 'memberTypeName',
    align: 'center',
    key: 'memberTypeName',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.gongsijuese', defaultMessage: '公司角色' }),
    dataIndex: 'roleName',
    align: 'center',
    key: 'roleName',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.gongsidengji', defaultMessage: '公司等级' }),
    dataIndex: 'levelTag',
    align: 'center',
    key: 'levelTag',
  },
]

//组织机构部门列
export const departmentColumns: any[] = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    className: 'commonHide',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.jigoudaima', defaultMessage: '机构代码' }),
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.jigoumingcheng', defaultMessage: '机构名称' }),
    dataIndex: 'title',
    key: 'title',
  },
]

// 合同下单 物料列表
export const materialInfoColumns: any[] = [
  // {
  //   title: 'ID',
  //   dataIndex: 'id',
  //   align: 'center',
  //   key: 'id',
  //   className: 'commonHide'
  // },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.wuliaobianhao', defaultMessage: '物料编号' }),
    dataIndex: 'code',
    align: 'left',
    key: 'code',
    width: 128,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.wuliaomingcheng', defaultMessage: '物料名称' }),
    dataIndex: 'name',
    align: 'left',
    key: 'name',
    width: 256,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.guigexinghao', defaultMessage: '规格型号' }),
    dataIndex: 'type',
    align: 'left',
    key: 'type',
    width: 128,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.wuliaozu', defaultMessage: '物料组' }),
    dataIndex: 'goodsGroup',
    align: 'left',
    key: 'goodsGroup',
    width: 96,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.pinlei', defaultMessage: '品类' }),
    dataIndex: 'category',
    align: 'center',
    key: 'category',
    width: 96,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.pinpai', defaultMessage: '品牌' }),
    dataIndex: 'brand',
    align: 'left',
    key: 'brand',
    width: 96,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.danwei', defaultMessage: '单位' }),
    dataIndex: 'unit',
    align: 'left',
    key: 'unit',
    width: 96,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.shengchangchangjia', defaultMessage: '生产厂家' }),
    dataIndex: 'manuFacturer',
    align: 'left',
    key: 'manuFacturer',
    width: 96,
    render: (text, record) => {
      return <span>{record.manuFacturer}</span>
    },
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.changdi', defaultMessage: '产地' }),
    dataIndex: 'placeOrigin',
    align: 'left',
    key: 'placeOrigin',
    width: 96,
  },

  {
    title: `${translate('web.resource.payment.shenqingtiaozhengedu')}(${translate('web.common.currencySymbol')})`,
    dataIndex: 'price',
    align: 'left',
    key: 'price',
    formItem: 'input',
    editable: true,
    width: 128,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.shuliang', defaultMessage: '数量' }),
    dataIndex: 'quantity',
    align: 'left',
    key: 'quantity',
    formItem: 'input',
    editable: true,
    width: 128,
  },
  {
    title: `${translate('web.resource.order.yugujine')}(${translate('web.common.currencySymbol')})`,
    dataIndex: 'amount',
    align: 'left',
    key: 'amount',
    width: 128,
    // render: (t, r) => t ? `${Number(t).toFixed(2)}` : null
  },
  {
    title: translate('web.resource.order.guanliandanju'),
    dataIndex: 'remark',
    align: 'left',
    key: 'remark',
    width: 128,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.beizu', defaultMessage: '备注' }),
    dataIndex: 'remark',
    align: 'left',
    key: 'remark',
    formItem: 'inputText',
    editable: true,
    width: 128,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.caozuo', defaultMessage: '操作' }),
    dataIndex: 'ctl',
    align: 'center',
    key: 'ctl',
    width: 128,
    fixed: 'right',
  },
]

export const RequisitiColumns: any[] = [
  {
    title: translate('web.resource.logistics.xingming'),
    dataIndex: 'name',
    align: 'center',
    key: 'name',
  },
  {
    title: translate('web.common.shoujihao'),
    dataIndex: 'phone',
    align: 'center',
    key: 'phone',
  },
  {
    title: translate('web.resource.member.suoshujigou'),
    dataIndex: 'orgName',
    align: 'center',
    key: 'orgName',
  },
  {
    title: translate('web.resource.member.zhiwei'),
    dataIndex: 'jobTitle',
    align: 'center',
    key: 'jobTitle',
  },
]
