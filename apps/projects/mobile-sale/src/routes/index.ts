export const rootRouter = {
  'root/home': 'pages/index/index', // 首页
  'root/login': 'pages/login/index', // 登录
  'root/multAccInfoList': 'pages/multAccInfoList/index', // 多主体选择
  'root/network': 'pages/network/index', // 网络异常页
  'root/statusLayout': 'pages/statusLayout/index', // 审核状态
  'root/richtext': 'pages/richtext/index', // 富文本
}

// 用户相关
export const userRouter = {
  'root/user/userInfo': 'pages/user/userInfo/index', // 个人信息
}

// 订单相关
export const orderRouter = {
  'root/order/orderList': 'pages/order/orderList/index', // 查看绑定订单列表
  'root/order/orderDetail': 'pages/order/orderDetail/index', // 订单详情
  'root/order/payInfo': 'pages/order/payInfo/index', // 支付信息
}

// 会员相关
export const memberRouter = {
  'root/order/memberList': 'pages/member/memberList/index', // 查看绑定会员列表
}

// 业绩相关
export const achievementRouter = {
  'root/order/achievementList': 'pages/achievement/achievementList/index', // 个人业绩统计列表
}

// 报价单相关
export const offerRouter = {
  'root/offer/offerList': 'pages/offer/offerList/index', // 报价单列表
  'root/offer/offerDetail': 'pages/offer/offerDetail/index', // 报价单列表
  'root/offer/offerAudit': 'pages/offer/offerAudit/index', // 审核
}

// 询价单相关
export const inquiryRouter = {
  'root/inquiry/inquiryList': 'pages/inquiry/inquiryList/index', // 询价单列表
  'root/inquiry/inquiryDetail': 'pages/inquiry/inquiryDetail/index', // 询价单详情
  'root/inquiry/inquiryOffer': 'pages/inquiry/inquiryOffer/index', // 报价
  'root/inquiry/viewHistoryOffer': 'pages/inquiry/viewHistoryOffer/index', // 历史报价
  'root/inquiry/productOffer': 'pages/inquiry/productOffer/index', // 商品报价
  'root/inquiry/fillinOther': 'pages/inquiry/fillinOther/index', // 填写其他说明
}

// 订单审核相关
export const orderExamineRouter = {
  'root/orderExamine/orderExamineList': 'pages/orderExamine/orderExamineList/index', // 订单审核列表
  'root/orderExamine/orderExamineDetail': 'pages/orderExamine/orderExamineDetail/index', // 订单审核详情
  'root/orderExamine/orderEditFreight': 'pages/orderExamine/orderEditFreight/index', // 订单审核-修改单价
  'root/orderExamine/orderEditPrice': 'pages/orderExamine/orderEditPrice/index', // 订单审核-修改运费
  'root/orderExamine/orderExamineConfirm': 'pages/orderExamine/orderExamineConfirm/index', // 订单审核通过/不通过原因
  'root/orderExamine/orderContract': 'pages/orderExamine/orderContract/index', // 订单审核-电子合同
  'root/orderExamine/orderContractTemplate': 'pages/orderExamine/orderContractTemplate/index', // 订单审核-选择电子合同模板
}

// 使用所有路由的集合
export const mergeRouter = {
  ...rootRouter,
  ...userRouter,
  ...orderRouter,
  ...offerRouter,
  ...inquiryRouter,
  ...memberRouter,
  ...achievementRouter,
  ...orderExamineRouter,
}
export type RouterList = typeof mergeRouter

export type RouterKeys = keyof RouterList
