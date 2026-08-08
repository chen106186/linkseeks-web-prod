import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

/**
 * ****采购能力 相关常量****
 */

/**
 *
 * 其中包括：采购门户管理、需求计划管理、采购计划管理、采购询价、报价、确认报价、招标、投标、采购竞价、在线竞价
 *
 */

/**————招投标————*/

/** 采购类型 */
export const PURCHASE_TYPE = {
  1: intl.formatMessage({ id: 'constants.purchase.type1', defaultMessage: '有固定采购金额' }),
  2: intl.formatMessage({ id: 'constants.purchase.type2', defaultMessage: '无固定采购金额' }),
}

/** 招标方式 */
export const PUBLIC_BID = 1
export const SYSTEM_BID = 2
export const INVITE_BID = 3
export const CALLFORBID_TYPE_ENUM = {
  [PUBLIC_BID]: intl.formatMessage({ id: 'constants.purchase.callforbid.type1', defaultMessage: '公开招标' }),
  [SYSTEM_BID]: intl.formatMessage({ id: 'constants.purchase.callforbid.type2', defaultMessage: '系统匹配' }),
  [INVITE_BID]: intl.formatMessage({ id: 'constants.purchase.callforbid.type3', defaultMessage: '邀请招标' }),
}
export const CALLFORBID_TYPE = [
  '',
  intl.formatMessage({ id: 'constants.purchase.callforbid.type1', defaultMessage: '公开招标' }),
  intl.formatMessage({ id: 'constants.purchase.callforbid.type2', defaultMessage: '系统匹配' }),
  intl.formatMessage({ id: 'constants.purchase.callforbid.type3', defaultMessage: '邀请招标' }),
]

/** 专业类别 */
export const SpecialityTypeMap = {
  1: intl.formatMessage({ id: 'constants.purchase.speciality.type1', defaultMessage: '工程类' }),
  2: intl.formatMessage({ id: 'constants.purchase.speciality.type2', defaultMessage: '货物类' }),
  3: intl.formatMessage({ id: 'constants.purchase.speciality.type3', defaultMessage: '服务类' }),
  4: intl.formatMessage({ id: 'constants.purchase.speciality.type4', defaultMessage: '其他类' }),
}

/**  专家类型 */
export const ExpertTypeMap = {
  1: intl.formatMessage({ id: 'constants.purchase.expert.type1', defaultMessage: '招标人代表' }),
  2: intl.formatMessage({ id: 'constants.purchase.expert.type2', defaultMessage: '技术类专家' }),
  3: intl.formatMessage({ id: 'constants.purchase.expert.type3', defaultMessage: '特邀类专家' }),
  4: intl.formatMessage({ id: 'constants.purchase.expert.type4', defaultMessage: '其他类专家' }),
}

/** 招标 内部状态工作流状态 */
export enum BidInsideWorkState {
  /** 待提交审核招标 */
  Not_Submitted_Check_Invite_Tender = 1,
  /** 待审核招标 */
  Not_Tender_Check,
  /** 招标审核不通过 */
  Tender_Check_Not_Pass,
  /** 待提交招标 */
  Tender_Check_Pass,
  /** 已提交招标 */
  Submitted_Invite_Tender,
  /** 待审核报名 */
  Not_Register_Check,
  /** 待审核资格预审 */
  Not_Qualifications_Check,
  /** 待评标 */
  Not_Selection_Tender,
  /** 待提交评标报告 */
  Submitted_Selection_Tender,
  /** 待提交审核定标 */
  Not_Submitted_Check_Finish_Tender,
  /** 待审核定标 */
  Not_Check_Finish_Tender,
  /** 定标审核不通过 */
  Finish_Tender_Check_Not_Pass,
  /** 待确认定标 */
  Not_Confirm_Finish_Tender,
  /** 待中标公示 */
  Not_Win_Notice,
  /** 完成招标 */
  Finish_Invite_Tender,
  /** 已废标 */
  Discard_Tender,
}

/** 招标 内部状态 */
export const BidInStateTexts = {
  1: '待提交审核招标',
  2: '待审核招标',
  3: '招标审核不通过',
  4: '待提交招标',
  5: '已提交招标',
  6: '待审核报名',
  7: '待审核资格预审',
  8: '待评标',
  9: '待提交评标报告',
  10: '待提交审核定标',
  11: '待审核定标',
  12: '定标审核不通过',
  13: '待确认定标',
  14: '待中标公示',
  15: '完成招标',
  16: '已废标',
}

/** 招标 外部状态工作流状态 */
export enum BidOuterWorkState {
  /** 待提交招标 */
  Submitted_Invite_Tender = 1,
  /** 待平台审核招标 */
  Platform_Not_Check_Invite_Tender,
  /** 平台审核不通过 */
  Platform_Check_Not_Pass,
  /** 待招标报名 */
  Not_Invite_Tender_Register,
  /** 待审核报名 */
  Not_Check_Register_Check,
  /** 待提交资格预审 */
  Not_Submitted_Qualifications_Check,
  /** 待资格预审 */
  Not_Qualifications_Check,
  /** 待投标 */
  Not_Submit_Tender,
  /** 待开标 */
  Not_Open_Tender,
  /** 待评标 */
  Not_Selection_Tender,
  /** 待定标 */
  Not_Finish_Notice,
  /** 待中标公示 */
  Not_Win_Notice,
  /** 完成招标 */
  Finish_Invite_Tender,
  /** 已废标 */
  Discard_Tender,
}

/** 招标 外部状态 */
export const BidOutStateTexts = {
  1: '待提交招标',
  2: '待平台审核招标',
  3: '平台审核不通过',
  4: '待招标报名',
  5: '待审核报名',
  6: '待提交资格预审',
  7: '待资格预审',
  8: '待投标',
  9: '待开标',
  10: '待评标',
  11: '待定标',
  12: '待中标公示',
  13: '完成招标',
  14: '已废标',
}

/** 招标 内部操作文本 */
export const BidInOpeartTexts = {
  1: '新增招标',
  2: '审核招标',
  3: '提交招标',
  4: '审核报名',
  5: '审核资格',
  6: '完成评标',
  7: '提交评标报告',
  8: '选择中标会员',
  9: '审核定标',
  10: '确认招标',
  11: '发送中标公示',
  12: '完成招标',
  13: '已废标',
}

/** 招标 外部操作文本 */
export const BidOutOpeartTexts = {
  1: '新增招标',
  2: '平台审核招标',
  3: '招标报名',
  4: '审核报名',
  5: '提交资格预审',
  6: '资格预审',
  7: '提交投标',
  8: '开标',
  9: '评标',
  10: '定标',
  11: '发送中标公示',
  12: '完成招标',
  13: '已废标',
}

/** 投标 内部状态工作流状态 */
export enum TenderInsideWorkState {
  /** 待招标报名 */
  Not_Submitted_Invite_Tender_Register = 1,
  /** 已提交招标报名 */
  Submitted_Invite_Tender_Register,
  /** 待提交资格预审 */
  Not_Submitted_Qualifications_Check,
  /** 已提交资格预审 */
  Submitted_Qualifications_Check,
  /** 待新增投标 */
  Not_Save_Submit_Tender,
  /** 待提交审核投标 */
  Not_Submitted_Check_Submit_Tender,
  /** 待审核投标 */
  Submitted_Check_Submit_Tender,
  /** 投标审核不通过 */
  Check_Submit_Tender_Not_Pass,
  /** 待提交投标 */
  Not_Submitted_Submit_Tender,
  /** 已提交投标 */
  Submitted_Submit_Tender,
}

/** 投标 内部状态 */
export const TenderInStateTexts = {
  1: '待招标报名',
  2: '已提交招标报名',
  3: '待提交资格预审',
  4: '已提交资格预审',
  5: '待新增投标',
  6: '待提交审核投标',
  7: '待审核投标',
  8: '投标审核不通过',
  9: '待提交投标',
  10: '已提交投标',
}

/** 投标 外部状态工作流状态 */
export enum TenderOutWorkState {
  /** 待招标报名 */
  Not_Invite_Tender_Register = 1,
  /** 待审核报名 */
  Not_Check_Register_Check,
  /** 报名审核不通过 */
  Register_Check_Not_Pass,
  /** 待提交资格预审 */
  Not_Submitted_Qualifications_Check,
  /** 待资格预审 */
  Not_Qualifications_Check,
  /** 资格预审不通过 */
  Qualifications_Check_Not_Pass,
  /** 待投标 */
  Not_Submit_Tender,
  /** 待开标 */
  Not_Open_Tender,
  /** 待评标 */
  Not_Selection_Tender,
  /** 待定标 */
  Not_Finish_Notice,
  /** 待中标公示 */
  Not_Win_Notice,
  /** 完成招标 */
  Finish_Invite_Tender,
  /** 已废标 */
  Discard_Tender,
}

/** 投标 外部状态 */
export const TenderOutStateTexts = {
  1: '待招标报名',
  2: '待审核报名',
  3: '报名审核不通过',
  4: '待提交资格预审',
  5: '待资格预审',
  6: '资格预审不通过',
  7: '待投标',
  8: '待开标',
  9: '待评标',
  10: '待定标',
  11: '待中标公示',
  12: '完成招标',
  13: '已废标',
}

/** 投标 内部操作文本 */
export const TenderInOpeartTexts = {
  1: '投标报名',
  2: '审核报名',
  3: '审核资格',
  4: '审核投标',
  5: '完成评标',
  6: '选择中标会员',
  7: '审核定标',
  8: '确认招标',
  9: '发送中标公示',
  10: '完成招标',
  11: '已废标',
}

/** 专家抽取通知状态 */
export const ExpertRectractStatus = {
  1: '待发送',
  2: '待确认',
  3: '已确认',
  4: '已拒绝',
  5: '已评标',
}

/**————————————*/

/** 页面类型 */
export const SELECT_NAME = {
  1: intl.formatMessage({ id: 'detail.purchase.doorIndex' }),
  2: intl.formatMessage({ id: 'detail.purchase.aboutUs' }),
}

/** 页面类型 */
export const SHOP_SELECT_NAME = {
  1: intl.formatMessage({ id: 'shop.seo.table.home' }),
  2: intl.formatMessage({ id: 'shop.seo.table.about' }),
}

export const CHANNEL_SELECT_NAME = {
  1: '渠道商城首页',
  2: intl.formatMessage({ id: 'detail.purchase.aboutUs' }),
}

/** 门户类型 */
export enum DOORTYPE {
  /** 店铺门户 */
  STORE_DOORTYPE = 1,
  /** 渠道门户 */
  PLACE_DOORTYPE,
  /** 采购门户 */
  PROCUREMENT_DOORTYPE,
  /** 自营门户 */
  OWN_DOORTYPE,
}

/** 年加工额 */
export const yearProcessAmount = [
  { label: intl.formatMessage({ id: 'common.wanyixia', defaultMessage: '{{data}}万以下', data: 50 }), value: 1 },
  {
    label: `${intl.formatMessage({ id: 'common.wan', defaultMessage: '{{data}}万', data: 50 })}-${intl.formatMessage({
      id: 'common.wan',
      defaultMessage: '{{data}}万',
      data: 100,
    })}`,
    value: 2,
  },
  {
    label: `${intl.formatMessage({ id: 'common.wan', defaultMessage: '{{data}}万', data: 101 })}-${intl.formatMessage({
      id: 'common.wan',
      defaultMessage: '{{data}}万',
      data: 500,
    })}`,
    value: 3,
  },
  {
    label: `${intl.formatMessage({ id: 'common.wan', defaultMessage: '{{data}}万', data: 501 })}-${intl.formatMessage({
      id: 'common.wan',
      defaultMessage: '{{data}}万',
      data: 1000,
    })}`,
    value: 4,
  },
  {
    label: `${intl.formatMessage({ id: 'common.wan', defaultMessage: '{{data}}万', data: 1001 })}-${intl.formatMessage({
      id: 'common.wan',
      defaultMessage: '{{data}}万',
      data: 2000,
    })}`,
    value: 5,
  },
  { label: intl.formatMessage({ id: 'common.wanyishang', defaultMessage: '{{data}}万以上', data: 2000 }), value: 6 },
]

/** 厂房面积 */
export const plantArea = [
  { label: intl.formatMessage({ id: 'common.pingyixia', defaultMessage: '{{data}}平以下', data: 100 }), value: 1 },
  {
    label: `${intl.formatMessage({ id: 'common.ping', defaultMessage: '{{data}}平', data: 100 })}-${intl.formatMessage({
      id: 'common.ping',
      defaultMessage: '{{data}}平',
      data: 200,
    })}`,
    value: 2,
  },
  {
    label: `${intl.formatMessage({ id: 'common.ping', defaultMessage: '{{data}}平', data: 201 })}-${intl.formatMessage({
      id: 'common.ping',
      defaultMessage: '{{data}}平',
      data: 500,
    })}`,
    value: 3,
  },
  {
    label: `${intl.formatMessage({ id: 'common.ping', defaultMessage: '{{data}}平', data: 501 })}-${intl.formatMessage({
      id: 'common.ping',
      defaultMessage: '{{data}}平',
      data: 1000,
    })}`,
    value: 4,
  },
  {
    label: `${intl.formatMessage({ id: 'common.ping', defaultMessage: '{{data}}平', data: 1001 })}-${intl.formatMessage(
      {
        id: 'common.ping',
        defaultMessage: '{{data}}平',
        data: 5000,
      },
    )}`,
    value: 5,
  },
  { label: intl.formatMessage({ id: 'common.pingyishang', defaultMessage: '{{data}}平以上', data: 5000 }), value: 6 },
]

/** 员工人数 */
export const staffNum = [
  { label: intl.formatMessage({ id: 'common.renyixia', defaultMessage: '{{data}}人以下', data: 10 }), value: 1 },
  {
    label: `${intl.formatMessage({ id: 'common.ren', defaultMessage: '{{data}}人', data: 10 })}-${intl.formatMessage({
      id: 'common.ren',
      defaultMessage: '{{data}}人',
      data: 50,
    })}`,
    value: 2,
  },
  {
    label: `${intl.formatMessage({ id: 'common.ren', defaultMessage: '{{data}}人', data: 51 })}-${intl.formatMessage({
      id: 'common.ren',
      defaultMessage: '{{data}}人',
      data: 100,
    })}`,
    value: 3,
  },
  {
    label: `${intl.formatMessage({ id: 'common.ren', defaultMessage: '{{data}}人', data: 101 })}-${intl.formatMessage({
      id: 'common.ren',
      defaultMessage: '{{data}}人',
      data: 500,
    })}`,
    value: 4,
  },
  {
    label: `${intl.formatMessage({ id: 'common.ren', defaultMessage: '{{data}}人', data: 501 })}-${intl.formatMessage({
      id: 'common.ren',
      defaultMessage: '{{data}}人',
      data: 1000,
    })}`,
    value: 5,
  },
  { label: intl.formatMessage({ id: 'common.renyishang', defaultMessage: '{{data}}人以上', data: 1000 }), value: 6 },
]
