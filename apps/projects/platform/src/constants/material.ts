/**
 * 物料内部状态枚举
 */

/** 已冻结 */

export const FROZEN = 0;

/** 待新增物料 */

export const PENDING_ADD_MATERIAL = 1;

/** 待审核物料（一级） */

export const PENDING_EXAM_I = 2;

/** 一级审核不通过 */
export const EXAM_I_FAIL = 3;


/** 待审核物料（二级） */
export const PENDING_EXAM_II = 4;

/** 待审核物料（二级）不通过 */
export const EXAM_II_FAIL = 5;

/**
 * 6: {status: 51, name: "待提交审核"}
7: {status: 52, name: "待审核物料（一级）"}
8: {status: 53, name: "一级审核不通过"}
9: {status: 54, name: "待审核物料（二级）"}
10: {status: 55, name: "二级审核不通过"}
11: {status: 99, name: "已确认"}
*/

/** 待提交审核 */
export const PENDING_SUBMIT_EXAM = 51;

/** 待审核变更一级 */
export const PENDING_EXAM_CHANGE_I = 52

/** 待审核变更一级 */
export const PENDING_EXAM_CHANGE_I_FAIL = 53;

/** 待提交变更二级 */
export const PENDING_EXAM_CHANGE_II = 54;

/** 待审核变更二级不通过 */
export const PENDING_EXAM_CHANGE_II_FAIL = 55

/** 已确认 */
export const HAS_CONFIRM = 99