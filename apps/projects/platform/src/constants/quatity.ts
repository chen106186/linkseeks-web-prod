/**
 * **** 质量能力相关 ****
 */

/**
 * 8D内部状态
 */

/** 待提交8D */
export const QUATITY_EIGHTD_IN_STATUS_WANT_SUBMIT_8D = 1;
/** 已提交8D */
export const QUATITY_EIGHTD_IN_STATUS_SUBMITTED_8D = 2;
/** 待提交审核ICA反馈 */
export const QUATITY_EIGHTD_IN_STATUS_WANT_SUBMIT_ICA = 3;
/** 待审核ICA反馈（一级） */
export const QUATITY_EIGHTD_IN_STATUS_WANT_AUDITING_ICA_1 = 4;
/** ICA反馈审核不通过（一级） */
export const QUATITY_EIGHTD_IN_STATUS_NO_PASS_ICA_1 = 5;
/** 待审核ICA反馈（二级） */
export const QUATITY_EIGHTD_IN_STATUS_WANT_AUDITING_ICA_2 = 6;
/** ICA反馈审核不通过（二级） */
export const QUATITY_EIGHTD_IN_STATUS_NO_PASS_ICA_2 = 7;
/** 待确认ICA反馈 */
export const QUATITY_EIGHTD_IN_STATUS_WANT_COMFIRM_ICA = 8;
/** ICA反馈审核不通过 */
export const QUATITY_EIGHTD_IN_STATUS_NO_PASS_ICA = 9;
/** 已确认ICA反馈 */
export const QUATITY_EIGHTD_IN_STATUS_COMFIRMED_ICA = 10;
/** 待提交审核PCA反馈 */
export const QUATITY_EIGHTD_IN_STATUS_WANT_SUBMIT_PCA = 11;
/** 待审核PCA反馈（一级） */
export const QUATITY_EIGHTD_IN_STATUS_WANT_AUDITING_PCA_1 = 12;
/** PCA反馈审核不通过（一级） */
export const QUATITY_EIGHTD_IN_STATUS_NO_PASS_PCA_1 = 13;
/** 待审核PCA反馈（二级） */
export const QUATITY_EIGHTD_IN_STATUS_WANT_AUDITING_PCA_2 = 14;
/** PCA反馈审核不通过（二级） */
export const QUATITY_EIGHTD_IN_STATUS_NO_PASS_PCA_2 = 15;
/** 待确认PCA反馈 */
export const QUATITY_EIGHTD_IN_STATUS_WANT_COMFIRM_PCA = 16;
/** PCA反馈审核不通过 */
export const QUATITY_EIGHTD_IN_STATUS_NO_PASS_PCA = 17;
/** 已确认PCA反馈 */
export const QUATITY_EIGHTD_IN_STATUS_COMFIRMED_PCA = 18;
/** 已取消 */
export const QUATITY_EIGHTD_IN_STATUS_CANCEL = -1;
/** 已完成 */
export const QUATITY_EIGHTD_IN_STATUS_FINISH = 99;
/**
 * 8D外部状态
 */

/** 待提交8D */
export const QUATITY_EIGHTD_EX_WANT_SUBMIT_8D = 1;
/** 待ICA反馈 */
export const QUATITY_EIGHTD_EX_WANT_FEEDBACK_ICA = 2;
/** 待审核ICA反馈 */
export const QUATITY_EIGHTD_EX_WANT_AUDITING_ICA = 3;
/** ICA反馈审核不通过 */
export const QUATITY_EIGHTD_EX_NO_PASS_ICA = 4;
/** 待PCA反馈 */
export const QUATITY_EIGHTD_EX_WANT_FEEDBACK_PCA = 5;
/** 待审核PCA反馈 */
export const QUATITY_EIGHTD_EX_WANT_AUDITING_PCA = 6;
/** PCA反馈审核不通过 */
export const QUATITY_EIGHTD_EX_NO_PASS_PCA = 7;
/** 已完成 */
export const QUATITY_EIGHTD_EX_FINISH = 99;
/** 已取消 */
export const QUATITY_EIGHTD_EX_CANCEL = -1;
