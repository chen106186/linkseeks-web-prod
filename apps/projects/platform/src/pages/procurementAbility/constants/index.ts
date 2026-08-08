import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
/** 询价外部状态 */
export const INQUIRY_EXTERNALSTATE = {
  '-1': '作废',
  99: '已完成',
  1: '待提交需求单',
  2: '待审核需求单',
  3: '待提交报价单',
  4: '待确认授标结果',
}
/** 询价外部状态颜色 */
export const INQUIRY_EXTERNALSTATE_COLOR = {
  '-1': 'error',
  99: 'success',
  1: 'default',
  2: 'warning',
  3: 'warning',
  4: 'warning',
  5: 'error',
  6: 'warning',
}
/** 询价内部状态 */
export const INQUIRY_INTERNALSTATE = {
  99: '已完成',
  1: '待提交审核',
  2: '待审核(一级)',
  3: '待审核(二级)',
  4: '待提交报价单',
  5: '待比价',
  6: '审核通过(一级)',
  7: '审核通过(二级)',
  8: '审核不通过(一级)',
  9: '审核不通过(二级)',
}
/** 询价内部状态颜色 */
export const INQUIRY_INTERNALSTATE_COLOR = {
  '-1': 'error',
  99: 'success',
  1: 'default',
  2: 'warning',
  3: 'warning',
  4: 'warning',
  5: 'default',
  6: 'success',
  7: 'success',
  8: 'error',
  9: 'error',
}

/** 报价外部状态 */
export const OFFTER_EXTERNALSTATE = {
  '-1': '作废',
  99: '已完成',
  1: '待提交需求单',
  2: '待审核需求单',
  3: '待提交报价单',
  4: '待确认授标结果',
  5: '审核不通过需求单',
  6: '发下轮报价',
}
/** 报价外部状态颜色 */
export const OFFTER_EXTERNALSTATE_COLOR = {
  '-1': 'error',
  99: 'success',
  1: 'default',
  2: 'warning',
  3: 'warning',
  4: 'warning',
  5: 'error',
  6: 'warning',
}
/** 报价内部状态 */
export const OFFTER_INTERNALSTATE = {
  '-1': '作废',
  99: '已提交审核采购需求单',
  1: '待提交审核',
  2: '待审核(一级)',
  3: '待审核(二级)',
  4: '待提交报价单',
  5: '待比价',
  6: '审核通过(一级)',
  7: '审核通过(二级)',
  8: '审核不通过(一级)',
  9: '审核不通过(二级)',
}
/** 报价内部状态颜色 */
export const OFFTER_INTERNALSTATE_COLOR = {
  '-1': 'error',
  99: 'success',
  1: 'default',
  2: 'warning',
  3: 'warning',
  4: 'warning',
  5: 'default',
  6: 'success',
  7: 'success',
  8: 'error',
  9: 'error',
  10: 'error',
  11: 'default',
  12: 'default',
  13: 'default',
  14: 'default',
  15: 'error',
}

export enum OFFTER_EXTERNALSTATE_TYPE {
  /** 作废 */
  ABANDON_TYPE = -1,
  /** 待提交需求单 */
  WAITSUBMITINQUIRY_TYPE = 1,
  /** 待审核需求单 */
  WAITAUDITINQUIRY_TYPE,
  /** 待提交报价单 */
  WAITSUBMIOFFER_TYPE,
  /** 待确认授标结果 */
  WAITCONFIRMRESULTS_TYPE,
  /** 审核不通过需求单 */
  WAITNOPASSINQUIRY_TYPE,
  /** 发下轮报价 */
  NEXTOFFER_TYPE,
  /** 已完成 */
  SUCCESS_TYPE = 99,
}

export enum OFFTER_INTERNALSTATE_TYPE {
  /** 作废 */
  ABANDON_TYPE = -1,
  /** 待提交审核 */
  WAITSUBMITAUDIT_TYPE = 1,
  /** 待审核(一级) */
  WAITAUDIT1_TYPE,
  /** 待审核(二级) */
  WAITAUDIT2_TYPE,
  /** 待提交报价单 */
  WAITSUBMITOFFTER_TYPE,
  /** 待比价 */
  WAITSTHAN_TYPE,
  /** 审核通过(一级) */
  AUDITPASS1_TYPE,
  /** 审核通过(二级) */
  AUDITPASS2_TYPE,
  /** 审核不通过(一级) */
  AUDITNOPASS1_TYPE,
  /** 审核不通过(二级) */
  AUDITNOPASS2_TYPE,
  /** 已完成 */
  SUCCESS_TYPE = 99,
}

export enum OFFTER_CONFIRMINTERNALSTATE_TYPE {
  /** 作废 */
  ABANDON_TYPE = -1,
  /** 待比价 */
  WAITSTHAN_TYPE = 1,
  /** 待审核授标结果(一级) */
  WAITAUDIT1_TYPE,
  /** 待审核授标结果(二级) */
  WAITAUDIT2_TYPE,
  /** 待确认授标结果 */
  WAITCONFIRMRESULTS_TYPE,
  /** 审核授标结果通过(一级) */
  AUDITPASS1_TYPE,
  /** 审核授标结果通过(二级) */
  AUDITPASS2_TYPE,
  /** 审核授标结果不通过(一级) */
  AUDITNOPASS1_TYPE,
  /** 审核授标结果不通过(二级) */
  AUDITNOPASS2_TYPE,
  /** 已完成 */
  SUCCESS_TYPE = 99,
}

/** 阿拉伯对应中文 */
const chNum: { [key: number]: string } = {
  1: translate('web.common.one'),
  2: translate('web.common.two'),
  3: translate('web.common.three'),
  4: translate('web.common.four'),
  5: translate('web.common.five'),
  6: translate('web.common.six'),
  7: translate('web.common.seven'),
  8: translate('web.common.eight'),
  9: translate('web.common.nine'),
}

/** 筛选外部状态 */
export const FILTEREXTERNALSTATE = [
  {
    label: '作废',
    value: -1,
  },
  {
    label: '待提交需求单',
    value: 1,
  },
  {
    label: '待审核需求单',
    value: 2,
  },
  {
    label: '待提交报价单',
    value: 3,
  },
  {
    label: '待确认授标结果',
    value: 4,
  },
  {
    label: '审核不通过需求单',
    value: 5,
  },
  {
    label: '已完成',
    value: 99,
  },
]

/** 筛选确认报价内部状态  */
export const FILTERINTERNALSTATE = [
  {
    label: '待提交审核',
    value: 1,
  },
  {
    label: '待审核(一级)',
    value: 2,
  },
  {
    label: '待审核(二级)',
    value: 3,
  },
  {
    label: '待提交报价单',
    value: 4,
  },
  {
    label: '待比价',
    value: 5,
  },
  {
    label: '审核通过(一级)',
    value: 6,
  },
  {
    label: '审核通过(二级)',
    value: 7,
  },
  {
    label: '审核不通过(一级)',
    value: 8,
  },
  {
    label: '审核不通过(二级)',
    value: 9,
  },
  {
    label: '已提交审核采购需求单',
    value: 99,
  },
]

/** 筛选内部状态 */
export const FILTERCONFIRMINTERNALSTATE = [
  {
    label: '待比价',
    value: 1,
  },
  {
    label: '待审核授标结果(一级)',
    value: 2,
  },
  {
    label: '待审核授标结果(二级)',
    value: 3,
  },
  {
    label: '待确认授标结果',
    value: 4,
  },
  {
    label: '审核授标结果通过(一级)',
    value: 5,
  },
  {
    label: '审核授标结果通过(二级)',
    value: 6,
  },
  {
    label: '审核授标结果不通过(一级)',
    value: 7,
  },
  {
    label: '审核授标结果不通过(二级)',
    value: 8,
  },
  {
    label: '已完成',
    value: 99,
  },
]

/** 确认报价内部状态 */
export const OFFTER_CONFIRMINTERIORSTATE = {
  99: '已完成',
  1: '待比价',
  2: '待审核授标结果(一级)',
  3: '待审核授标结果(二级)',
  4: '待确认授标结果',
  5: '审核授标结果通过(一级)',
  6: '审核授标结果通过(二级)',
  7: '审核授标结果不通过(一级)',
  8: '审核授标结果不通过(二级)',
}

export const OFFTER_CONFIRMINTERIORSTATE_COLOR = {
  99: 'success',
  1: 'warning',
  2: 'warning',
  3: 'warning',
  4: 'warning',
  5: 'success',
  6: 'success',
  7: 'error',
  8: 'error',
}

export enum PRICECONTRAST_TYPE {
  /** 未解密 */
  UNDECRYPTED = 0,
  /** 已解密 */
  UNENCRYPTED,
}

/** 筛选需求计划内部状态  */
export const DEMANDPLANINTERNALSTATE = [
  {
    label: '待提交审核',
    value: 1,
  },
  {
    label: '待审核(一级)',
    value: 2,
  },
  {
    label: '审核不通过(一级)',
    value: 3,
  },
  {
    label: '待审核(二级)',
    value: 4,
  },
  {
    label: '审核不通过(二级)',
    value: 5,
  },
  {
    label: '待提交采购汇总',
    value: 6,
  },
  {
    label: '待采购汇总',
    value: 7,
  },
  {
    label: '采购退回',
    value: 8,
  },
  {
    label: '已完成',
    value: 9,
  },
]

export enum BUTTONAUTHORITY {
  /** 提交审核修改删除查看 */
  ONE = 1,
  /** 修改查看 */
  TWO,
  /** 报价查看 */
  THREE,
  /** 调整截止时间查看报价详情 */
  FOUR,
  /** 查看报价详情 */
  FIVE,
  /** 比价查看 */
  SIX,
  /** 修改授标结果查看 */
  SEVEN,
  /** 审核查看 */
  EIGHT,
  /** 查看 */
  NINE,
}
