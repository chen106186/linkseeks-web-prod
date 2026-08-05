export enum DEMANDPLAN_INTERNALSTATE_TYPE {
  /** 待提交审核 */
  WAITESUBMITAUDIT_TYPE = 1,
  /** 审核不通过(一级) */
  AUDITNOPASS1_TYPE = 8,
  /** 审核不通过(二级) */
  AUDITNOPASS2_TYPE = 9,
  /** 采购退回 */
  PURCHASEBACK_TYPE = 10,
}
