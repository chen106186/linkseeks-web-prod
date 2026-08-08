/**
 * 加工
 */

/**
 * 加工企业内部状态
 */

/**
 * 加工企业内部状态 detail -> processInnerStatus  字段
 * 待新增加工发货单
 */
export const PENDING_ADD_PROCESS_DELIVERY = 22;

/**
 * 加工企业内部状态 detail -> processInnerStatus  字段
 * 待审核加工发货单
 */
export const PENDING_VERIFY_PROCESS_DELIVERY = 23;

/**
 * 加工企业内部状态 detail -> processInnerStatus  字段
 * 待新增物流单
 */
export const ADD_LOGISTICS = 24

/**
 * 加工企业内部状态 detail -> processInnerStatus  字段
 * 编辑物流单
 */
export const EDIT_LOGISTICS = -8

/**
 * @特殊
 * datail 当 outerTaskType 为 29的时候是手工发发货
 */
export const isManualDelivery = 29;

/**
 * supplier
 * 待新增加工入库单
 */
export const TO_BE_ADD_STORAGE = 22;
/**
 * supplier
 * 待审核加工入库单
 */
export const TO_BE_EXAM_STORAGE = 23
/**
 * supplierInnerStatus
 */
export const SUPPLIER_INNER_STATUS = {
  1: '待提交审核',
  2: '待审核（一级）',
  3: '待审核（二级）',
  4: '待提交',
  5: '已提交',
  11: '审核不通过（一级）',
  12: '审核不通过（二级）',
  21: '已完成',
  [TO_BE_ADD_STORAGE]: '待新增加工入库单',
  [TO_BE_EXAM_STORAGE]: '待审核加工入库单',
  24: '待确认收货',
  25: '已确认收货',
  26: '已终止'
}

/**
 * 加工企业内部状态 processINnerstatus
 */

export const PROCESS_INNER_STATUS = {
  1: '待提交审核',
  2: '待审核（一级）',
  3: '待审核（二级）',
  4: '待确认',
  5: '已确认（接受）',
  11: '提交审核不通过',
  12: '审核不通过（一级）',
  13: '审核不同通过(二级)',
  21: '已完成',
  [PENDING_ADD_PROCESS_DELIVERY]: "待新增加工发货单",
  [PENDING_VERIFY_PROCESS_DELIVERY]: "待审核加工发货单",
  24: '待新增物流单',
  25: '待确认物流单',
  26: '待确认发货',
  27: '已确认发货',
  28: '待确认回单',
  29: '已确认（不接受）',
  30: '不接受物流单',
  31: '已中止'
}

/**
 * 总的内部状态
 * status
 */

export const STATUS = {
  1: '待提交审核',
  2: '待审核（一级）',
  3: '待审核（二级）',
  4: '待提交',
  5: '待提交审核',
  6: '待审核（一级）',
  7: '待审核（二级）',
  8: '待确认',
  9: '接受申请通知单',
  10: '待新增加工发货单',
  11: '待审核加工发货单',
  12: '待新增物流单',
  13: '待确认物流单',
  14: '待确认发货',
  15: '待新增加工入库单',
  16: '待审核加工入库单',
  17: '待确认发货',
  18: '待确认回单',
  19: '完成',
  21: '审核不通过（一级）',
  22: '审核不通过（二级）',
  23: '提交审核不通过',
  24: '审核不通过（一级）',
  25: '审核不通过（二级）',
  26: '不接受申请通知单',
  27: '不接受物流单',
  28: '中止',
}

/**
 * outerStatus
 */
export const COMPLETE = 9

export const OUTER_STATUS = {
  1: '待提交',
  2: '待确认',
  3: '待新增加工发货单',
  4: '待新增物流单',
  5: '代发货',
  6: '待新增加工入库单',
  7: '待收货',
  8: '待确认回单',
  [COMPLETE]: '已完成',
  21: '不接受',
  22: '已中止'
}
