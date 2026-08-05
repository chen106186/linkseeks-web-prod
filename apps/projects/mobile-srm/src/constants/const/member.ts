/* --------------------------------- 税点 -------------------------------- */
/**
 * 17%
 */
export const MEMBER_TAX_POINT_1 = 17
/**
 * 11%
 */
export const MEMBER_TAX_POINT_2 = 11
/**
 * 6%
 */
export const MEMBER_TAX_POINT_3 = 6
/**
 * 3%
 */
export const MEMBER_TAX_POINT_4 = 3
/**
 * 0%
 */
export const MEMBER_TAX_POINT_5 = 0
/**
 * 会员等级类型枚举对应中文
 */
export const MEMBER_TAX_POINT = {
  [MEMBER_TAX_POINT_1]: '17%',
  [MEMBER_TAX_POINT_2]: '11%',
  [MEMBER_TAX_POINT_3]: '6%',
  [MEMBER_TAX_POINT_4]: '3%',
  [MEMBER_TAX_POINT_5]: '0%',
}

/* --------------------------------- 会员内部状态 -------------------------------- */
/**
 * 待审核入库资料
 */
export const MEMBER_INNER_STATUS_TO_VERIFY_DEPOSITORY_DETAIL = 1
/**
 * 入库资料审核不通过
 */
export const MEMBER_INNER_STATUS_DEPOSITORY_DETAIL_NOT_PASSED = 2
/**
 * 待审核入库资质
 */
export const MEMBER_INNER_STATUS_TO_VERIFY_DEPOSITORY_QUALIFICATION = 3
/**
 * 入库资质审核不通过
 */
export const MEMBER_INNER_STATUS_DEPOSITORY_QUALIFICATION_NOT_PASSED = 4
/**
 * 待入库考察
 */
export const MEMBER_INNER_STATUS_TO_INSPECT_DEPOSITORY = 5
/**
 * 入库考察不通过
 */
export const MEMBER_INNER_STATUS_DEPOSITORY_INSPECTION_NOT_PASSED = 6
/**
 * 待入库分类
 */
export const MEMBER_INNER_STATUS_TO_CLASSFIY_DEPOSITORY = 7
/**
 * 入库分类不通过
 */
export const MEMBER_INNER_STATUS_DEPOSITORY_CLASSIFICATION_NOT_PASSED = 8
/**
 * 待审核入库(一级)
 */
export const MEMBER_INNER_STATUS_TO_DEPOSIT_GRADE_ONE = 9
/**
 * 入库审核不通过(一级)
 */
export const MEMBER_INNER_STATUS_DEPOSITORY_GRADE_ONE_NOT_PASSED = 10
/**
 * 待审核入库(二级)
 */
export const MEMBER_INNER_STATUS_TO_DEPOSIT_GRADE_TWO = 11
/**
 * 待审核入库不通过(二级)
 */
export const MEMBER_INNER_STATUS_DEPOSITORY_GRADE_TWO_NOT_PASSED = 12
/**
 * 待确认入库
 */
export const MEMBER_INNER_STATUS_TO_COMFIRM_DEPOSITORY = 13
/**
 * 审核通过
 */
export const MEMBER_INNER_STATUS_VERIFY_PASSED = 14
/**
 * 审核不通过
 */
export const MEMBER_INNER_STATUS_VERIFY_NOT_PASSED = 15
/**
 * 待审核会员变更(一级)
 */
export const MEMBER_INNER_STATUS_VERIFY_TO_MODIFY_GRADE_ONE = 16
/**
 * 会员变更审核不通过(一级)
 */
export const MEMBER_INNER_STATUS_MODIFY_GRADE_ONE_NOT_PASSED = 17
/**
 * 待审核会员变更(二级)
 */
export const MEMBER_INNER_STATUS_TO_MODIFY_GRADE_TWO = 18
/**
 * 会员变更审核不通过(二级)
 */
export const MEMBER_INNER_STATUS_MODIFY_GRADE_TWO_NOT_PASSED = 19
/**
 * 待确认会员变更
 */
export const MEMBER_INNER_STATUS_TO_COMFIRM_MODIFY = 20
/**
 * 会员变更审核通过
 */
export const MEMBER_INNER_STATUS_MODIFY_PASSED = 21
/**
 * 会员变更审核不通过
 */
export const MEMBER_INNER_STATUS_MODIFY_NOT_PASSED = 22
