export const rootRouter = {
  'root/index': 'pages/index/index', // 首页
  'root/login': 'pages/login/index', // 登录
  'root/network': 'pages/network/index', // 网络异常页
  'root/statusLayout': 'pages/statusLayout/index', // 审核状态
  'root/richtext': 'pages/richtext/index', // 富文本
}

// 请购单相关
export const requisitionRouter = {
  'requisition/requisitionList': 'pages/list/index', // 请购单列表
  'requisition/requisitionDetail': 'pages/detail/index', // 请购单详情
  'requisition/requisitionAudit': 'pages/audit/index', // 审核
  'requisition/requisitionAttachments': 'pages/attachments/index', // 上传附件
  'requisition/requisitionCreate': 'pages/create/index', // 新建
  'requisition/requisitionAddMaterial': 'pages/addMaterial/index', // 添加物料
  'requisition/requisitionMaterialList': 'pages/materialList/index', // 请购物料
  'requisition/requisitionAuditList': 'pages/auditList/index', // 请购单审核列表
}

// 合同相关
export const contractRouter = {
  'contract/list': 'pages/list/index', // 合同查询
  'contract/detail': 'pages/detail/index', //合同详情
  'contract/contractAudit': 'pages/audit/index', // 审核
}

export const addressRouter = {
  // 地址管理
  'address/addressList': 'pages/addressList/index',
  'address/addressAdd': 'pages/addressAdd/index',
  //
}

export const userRouter = {
  // 用户模块
  'user/userInfo': 'pages/userInfo/index',
  //
}

// 物料模块
export const materialRouter = {
  'material/materialList': 'pages/inquire/list/index', // 物料列表
  'material/materialDetail': 'pages/inquire/detail/index', // 物料详情
}

// 结算模块
export const settlementRouter = {
  'settlement/settlementList': 'pages/inquire/list/index', // 请款单列表
  'settlement/settlementDetail': 'pages/inquire/detail/index', // 请款单详情
}

// 供应商管理
export const supplierAbilityRouter = {
  'supplierAbility/home': 'pages/home/index',
  'supplierAbility/supplierImport/index': 'pages/supplierImport/index/index',
  'supplierAbility/supplierImport/supplierAdd': 'pages/supplierImport/supplierAdd/index',
  'supplierAbility/supplierImport/supplierModify': 'pages/supplierImport/supplierModify/index',
  'supplierAbility/supplierImport/supplierDetails': 'pages/supplierImport/supplierDetails/index',
  'supplierAbility/supplierManagement/index': 'pages/supplierManagement/index/index',
  'supplierAbility/supplierManagement/supplierActions': 'pages/supplierManagement/supplierActions/index',
  'supplierAbility/supplierManagement/supplierBlack': 'pages/supplierManagement/supplierBlack/index',
  'supplierAbility/supplierManagement/supplierFreeze': 'pages/supplierManagement/supplierFreeze/index',
  'supplierAbility/supplierManagement/supplierUnFreeze': 'pages/supplierManagement/supplierUnFreeze/index',
  'supplierAbility/supplierManagement/suppliereLiminate': 'pages/supplierManagement/suppliereLiminate/index',
  'supplierAbility/supplierAssigned/index': 'pages/supplierAssigned/index',
  'supplierAbility/supplierDeposits/index': 'pages/supplierDeposits/index/index',
  'supplierAbility/supplierDeposits/supplierDepositData/supplierDepositDetails':
    'pages/supplierDeposits/supplierDepositData/supplierDepositDetails/index',
  'supplierAbility/supplierDeposits/supplierDepositData/supplierDepositVerify':
    'pages/supplierDeposits/supplierDepositData/supplierDepositVerify/index',
  'supplierAbility/supplierDeposits/supplierDepositData/supplierDepositVerifyConfirm':
    'pages/supplierDeposits/supplierDepositData/supplierDepositVerifyConfirm/index',
  'supplierAbility/supplierDepositQualities/index': 'pages/supplierDepositQualities/index',
  'supplierAbility/supplierDeposits/supplierDepositQualify/supplierDepositDetails':
    'pages/supplierDeposits/supplierDepositQualify/supplierDepositDetails/index',
  'supplierAbility/supplierDeposits/supplierDepositQualify/supplierDepositQualifyVerify':
    'pages/supplierDeposits/supplierDepositQualify/supplierDepositQualifyVerify/index',
  'supplierAbility/supplierDeposits/supplierDepositInspect/supplierDepositDetails':
    'pages/supplierDeposits/supplierDepositInspect/supplierDepositDetails/index',
  'supplierAbility/supplierDeposits/supplierDepositInspect/supplierDepositInspectVerify':
    'pages/supplierDeposits/supplierDepositInspect/supplierDepositInspectVerify/index',
  'supplierAbility/supplierDeposits/supplierDepositInspect/supplierDepositInspectVerifyConfirm':
    'pages/supplierDeposits/supplierDepositInspect/supplierDepositInspectVerifyConfirm/index',
  'supplierAbility/supplierDeposits/supplierDepositClassify/supplierDepositDetails':
    'pages/supplierDeposits/supplierDepositClassify/supplierDepositDetails/index',
  'supplierAbility/supplierDeposits/supplierDepositClassify/supplierDepositClassifyVerify':
    'pages/supplierDeposits/supplierDepositClassify/supplierDepositClassifyVerify/index',
  'supplierAbility/supplierDeposits/supplierDepositClassify/supplierDepositClassifyVerifyConfirm':
    'pages/supplierDeposits/supplierDepositClassify/supplierDepositClassifyVerifyConfirm/index',
  'supplierAbility/supplierDepositClassifyPayType/index': 'pages/supplierDepositClassifyPayType/index',
  'supplierAbility/supplierDeposits/supplierDepositGradeOne/supplierDepositDetails':
    'pages/supplierDeposits/supplierDepositGradeOne/supplierDepositDetails/index',
  'supplierAbility/supplierDeposits/supplierDepositGradeOne/supplierDepositGradeOneVerify':
    'pages/supplierDeposits/supplierDepositGradeOne/supplierDepositGradeOneVerify/index',
  'supplierAbility/supplierDeposits/supplierDepositGradeTwo/supplierDepositDetails':
    'pages/supplierDeposits/supplierDepositGradeTwo/supplierDepositDetails/index',
  'supplierAbility/supplierDeposits/supplierDepositGradeTwo/supplierDepositGradeTwoVerify':
    'pages/supplierDeposits/supplierDepositGradeTwo/supplierDepositGradeTwoVerify/index',
  'supplierAbility/supplierDeposits/supplierDepositConfirm/supplierDepositDetails':
    'pages/supplierDeposits/supplierDepositConfirm/supplierDepositDetails/index',
  'supplierAbility/supplierDeposits/supplierDepositConfirm/supplierDepositConfirmVerify':
    'pages/supplierDeposits/supplierDepositConfirm/supplierDepositConfirmVerify/index',
  'supplierAbility/supplierModifies/index': 'pages/supplierModifies/index/index',
  'supplierAbility/supplierModifies/supplierModifyGradeOne/supplierModifyDetails':
    'pages/supplierModifies/supplierModifyGradeOne/supplierModifyDetails/index',
  'supplierAbility/supplierModifies/supplierModifyGradeOne/supplierModifyGradeOneVerify':
    'pages/supplierModifies/supplierModifyGradeOne/supplierModifyGradeOneVerify/index',
  'supplierAbility/supplierModifies/supplierModifyGradeTwo/supplierModifyDetails':
    'pages/supplierModifies/supplierModifyGradeTwo/supplierModifyDetails/index',
  'supplierAbility/supplierModifies/supplierModifyGradeTwo/supplierModifyGradeTwoVerify':
    'pages/supplierModifies/supplierModifyGradeTwo/supplierModifyGradeTwoVerify/index',
  'supplierAbility/supplierModifies/supplierModifyConfirm/supplierModifyDetails':
    'pages/supplierModifies/supplierModifyConfirm/supplierModifyDetails/index',
  'supplierAbility/supplierModifies/supplierModifyConfirm/supplierModifyConfirmVerify':
    'pages/supplierModifies/supplierModifyConfirm/supplierModifyConfirmVerify/index',
  'supplierAbility/supplierDepositRegisterDataList/index': 'pages/supplierDepositRegisterDataList/index',
}

// 供应商采购单模块（mobile-srm 供应商角色）
export const vendorRouter = {
  'vendor/orderList': 'pages/list/index',    // 供应商-我的采购单列表
  'vendor/orderDetail': 'pages/detail/index', // 供应商-采购单详情（含发货弹窗）
}

// 使用所有路由的集合
export const mergeRouter = {
  ...contractRouter,
  ...rootRouter,
  ...requisitionRouter,
  ...addressRouter,
  ...userRouter,
  ...materialRouter,
  ...settlementRouter,
  ...supplierAbilityRouter,
  ...vendorRouter,
}
export type RouterList = typeof mergeRouter

export type RouterKeys = keyof RouterList
