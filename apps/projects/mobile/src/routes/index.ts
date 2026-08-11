// 商城相关
export const mallRouter = {
  'extra/mall/b2b': 'pages/mall/b2b/index', // 联营商城B端首页
  'extra/mall/client': 'pages/mall/client/index', // 联营商城C端首页
  'extra/mall/own': 'pages/mall/own/index', // 自营商城首页
  'extra/showcase': 'pages/showcase/index', // B端联营商城橱窗页
  'extra/integralMall': 'pages/integralMall/index', //积分商城
  'extra/mall/own/select': 'pages/mall/own/selectOwnMall/index', // 选择自营商城
  'extra/switchCity': 'pages/switchCity/index', // 选择城市
}
// 找回密码和 注册
export const userRouter = {
  'user/passwordRecovery': 'pages/passwordRecovery/index', // 找回密码
  'user/countryCode': 'pages/countryCode/index', //找回密码输入
  'user/editPassword': 'pages/editPassword/index', //找回密码输入新密码
  'user/complete': 'pages/register/complete/index',
  'user/register': 'pages/register/index', // 注册
  'user/businessTypes': 'pages/register/businessTypes/index', // 选择业务
  'user/role': 'pages/register/role/index', // 选择角色
  'user/Identity': 'pages/register/Identity/index', // 选择身份
  'user/store': 'pages/register/store/index', // 注册
  'user/paySuccess': 'pages/paySuccess/index', // 支付成功页面
  'user/pay': 'pages/pay/index', // app跳转支付页面
  'user/login': 'pages/login/index',
  'user/multAccInfoList': 'pages/multAccInfoList/index', // 多主体选择
  'user/scanLoginConfirm': 'pages/scanLoginConfirm/index', //扫码登录
}
export const rootRouter = {
  'root/splashView': 'pages/splashView/index',
}

export const extraRouter = {
  'extra/mine': 'pages/mine/index', // 我的
  'extra/commonClassify': 'pages/commonClassify/index', // 店铺分类共用
  'extra/evaluatingManage': 'pages/evaluatingManage/index', // 评论中心
  'extra/evaluatingManage/evaluating': 'pages/evaluatingManage/evaluating/index', //评论商品
  'extra/classify': 'pages/classify/index', // 分类
  'extra/search': 'pages/search/index', // 搜索
  'extra/webview': 'pages/webview/index', // 打开外部网页

  ...mallRouter,
}
// 基本设置相关路由
export const basicSettingRouter = {
  // 个人资料
  'basicSetting/userInfo': 'pages/userInfo/index',
  // 帮助信息
  'basicSetting/HelpCenter': 'pages/HelpCenter/index',
  'basicSetting/HelpCenter/details': 'pages/HelpCenter/details/index',
  // 外部网页
  'basicSetting/webView': 'pages/webView/index',
  // 无网络
  'basicSetting/network': 'pages/network/index',
  // 资金账户
  'basicSetting/normalAccountDetail': 'pages/captialAccount/accountDetail/index',
  'basicSetting/accountDetail': 'pages/captialAccount/universal/accountDetail/index',
  // 资金充值
  'basicSetting/accountRecharge': 'pages/captialAccount/accountRecharge/index',
  // 资金账户提现
  'basicSetting/accountWithdraw': 'pages/captialAccount/accountWithdraw/index',
  // 绑定银行卡
  'basicSetting/accountBindBlamk': 'pages/captialAccount/accountBindBlamk/index',
  // 交易记录列表
  'basicSetting/tradingRecord': 'pages/captialAccount/tradingRecord/index',
  // 交易记录详情
  'basicSetting/tradingDetail': 'pages/captialAccount/tradingDetail/index',
  // 通联交易记录列表
  'basicSetting/eAccountRecord': 'pages/captialAccount/eAccountRecord/index',
  // 通联交易记录详情
  'basicSetting/eAccountRecordDetail': 'pages/captialAccount/eAccountRecordDetail/index',
  // e账户企业认证第一步
  'basicSetting/entErpriseAuth': 'pages/captialAccount/enterprise/enterpriseAuth/index',
  // e账户企业认证第二步
  'basicSetting/ImageAcquisition': 'pages/captialAccount/enterprise/ImageAcquisition/index',
  // e账户企业认证第三步
  'basicSetting/enterpBindphone': 'pages/captialAccount/enterprise/enterpBindphone/index',
  //  e账户企业认证第四步
  'basicSetting/enterBindbankCard': 'pages/captialAccount/enterprise/enterBindbankCard/index',
  // e账户个人认证
  'basicSetting/Authentication': 'pages/captialAccount/universal/authentication/index',
  // e账号企业个人绑定手机号
  'basicSetting/bindphone': 'pages/captialAccount/universal/bindphone/index',
  // e账户个人绑定银行卡
  'basicSetting/bindbankCard': 'pages/captialAccount/universal/bindbankCard/index',
  // e账户接触绑定手机号 这个有问题 先放着晚点转换
  'basicSetting/unbound': 'pages/captialAccount/universal/unbound/index',
  // 企业个人账户设置
  'basicSetting/accountHome': 'pages/captialAccount/universal/accountHome/index',
  // 'basicSetting/accountInfoDetail': 'pages/captialAccount/universal/accountDetail/index',
  // e账户签约
  'basicSetting/webInfo': 'pages/captialAccount/webViewInfo/index',
  // 系统消息
  'basicSetting/message': 'pages/message/index',
  'basicSetting/platformMsg': 'pages/message/PlatformMsg/index',
  'basicSetting/msgDetail': 'pages/message/MsgDetail/index',
  // 账户安全
  'basicSetting/accountSafe': 'pages/accountSafe/index',
  'basicSetting/verifys': 'pages/accountSafe/Verifys/index',
  'basicSetting/capture': 'pages/accountSafe/InputCaptureCode/index',
  'basicSetting/phone': 'pages/accountSafe/Edits/phone/index',
  'basicSetting/paycode': 'pages/accountSafe/Edits/paycode/index',
  'basicSetting/password': 'pages/accountSafe/Edits/password/index',
  'basicSetting/email': 'pages/accountSafe/Edits/email/index',
  // 实名认证
  'basicSetting/realLayout': 'pages/accountSafe/realLayout/index',
  'basicSetting/realChange': 'pages/accountSafe/realChange/index',
  'basicSetting/successLayout': 'pages/accountSafe/successLayout/index',
  // 账户设置
  'basicSetting/accountSettings': 'pages/accountSettings/index',
  // 会员信息
  'basicSetting/memberInfo': 'pages/member/memberInfo/index',
  'basicSetting/memberInfoEdit': 'pages/member/NewMemberInfoEdit/index',
  // 我的足迹
  'basicSetting/footprint': 'pages/footprint/index',
  // 地址管理
  'basicSetting/addressList': 'pages/address/addressList/index',
  'basicSetting/addressAdd': 'pages/address/addressAdd/index',
  // 发票管理
  'basicSetting/invoiceList': 'pages/invoice/invoiceList/index',
  'basicSetting/invoiceAdd': 'pages/invoice/invoiceAdd/index',
  'basicSetting/kuaiDi': 'pages/kuaiDi/index', // 快递100
  'basicSetting/logOff': 'pages/accountSafe/logOff/index', // 注销账号
  'basicSetting/logOffReason': 'pages/accountSafe/logOff/reason/index', // 注销账号-注销原因
  'basicSetting/logOffConfirm': 'pages/accountSafe/logOff/confirm/index', // 注销账号-确认注销账号
  'basicSetting/logOffSuccess': 'pages/accountSafe/logOff/success/index', // 注销账号-注销成功
  'basicSetting/logOffFail': 'pages/accountSafe/logOff/fail/index', // 注销账号-注销失败
}

// 订单相关
export const orderRouter = {
  // 提交询价单
  'order/editRfqOrder': 'pages/editRfqOrder/index',
  // 填写其他条件
  'order/editRfqOtherInfo': 'pages/editRfqOrder/editRfqOtherInfo/index',
  // 修改询价商品
  'order/editRfqOrderProduct': 'pages/editRfqOrder/editRfqOrderProduct/index',
  // 提交成功询价
  'order/editRfqSubmitSuccess': 'pages/editRfqOrder/editRfqSubmitSuccess/index',
  // 商品订单
  'order/mycommodityList': 'pages/mycommodityList/index', // 全部订单
  'order/mycommodityDetails': 'pages/mycommodityDetails/index', // 订单详情
  'order/feedback': 'pages/feedback/index', // 提交审核
  'order/logistics': 'pages/mycommodityDetails/logistics/index', // 查看物流
  'order/logisticsDetail': 'pages/logisticsDetail/index', // 物流详情
  'order/payList': 'pages/payList/index', // 支付列表
  // 申请售后
  'order/oftenBuy': 'pages/oftenBuyList/index', // 常购清单
  // 购物车
  'order/SubmitSuccess': 'pages/submitSuccess/index', // 订单提交成功
  'order/Purchase': 'pages/purchase/index', // 购物车
  'order/ConfirmOrder': 'pages/confirmOrder/index', // 确认订单
  'order/integral': 'pages/integral/index', // 积分订单， 确认订单
  'order/payOrder': 'pages/payOrder/index', // 支付订单（余额支付/授信支付）
  'order/offlineTransfer': 'pages/offlineTransfer/index', // 支付订单（线下支付线上确认）
  // 审核状态
  'order/statusLayout': 'pages/statusLayout/index', // 审核状态通用
  // 询价单
  'order/inquiry': 'pages/inquiry/index', // 询价单列表
  'order/inquiry/inquiryDetail': 'pages/inquiry/inquiryDetail/index', // 询价单详情
  'order/inquiry/inquiryAudit': 'pages/inquiry/inquiryAudit/index', // 审核不通过
  // 选择自提地址
  'order/selfMention': 'pages/selfMention/index',
  // 我的询价报价
  'order/inquiryQuotation': 'pages/inquiryQuotation/index', // 我的询价报价列表
  'order/inquiryQuotation/inquiryQuotationDetail': 'pages/inquiryQuotation/inquiryQuotationDetail/index', // 我的询价报价详情
  'order/inquiryQuotation/inquiryQuotationAudit': 'pages/inquiryQuotation/inquiryQuotationAudit/index', // 审核不通过
  'order/payResult': 'pages/payResult/index', // 支付结果
}
// 行情资讯
export const companyNewsRouter = {
  'companyNews/newsHome': 'pages/newsHome/index', // 首页
  'companyNews/newsClassify': 'pages/newsClassify/index', // 分类
  'companyNews/newsRecommend': 'pages/newsRecommend/index', // 推荐
  'companyNews/newsMy': 'pages/newsMy/index', // 我的
  'companyNews/newsSearchList': 'pages/newsSearchList/index', // 搜索
  'companyNews/newsInformation': 'pages/newsInformation/index', // 详情
  'companyNews/newsHistoryList': 'pages/newsHistoryList/index', // 历史
}

// 会员
export const membersRouter = {
  'members/shop': 'pages/shop/index', // 店铺会员
  'members/my': 'pages/my/index', // 会员中心
  'members/equityRecord': 'pages/equityRecord/index', // 权益记录
  'members/activeRecord': 'pages/activeRecord/index', // 活跃分获取记录
  'members/card': 'pages/myCardBag/index', // 卡包
  'members/myCoupon': 'pages/myCoupon/index', // 优惠券
  'members/collection': 'pages/myCollections/index', // 我的收藏
}

// 店铺相关
export const shopRouter = {
  'shop/home': 'pages/home/index', // 店铺主页
  'shop/pointExchange': 'pages/pointExchange/index', // 积分兑换
  'shop/pointExchange/detail': 'pages/pointExchange/detail/index', // 积分明细
  'shop/shopSearch': 'pages/shopSearch/index', // 店铺搜索
  'shop/findShop': 'pages/findShop/index',
  'shop/shopAbout': 'pages/shopAbout/index', // 店铺/公司介绍
  'shop/ingralCommodityList': 'pages/ingralCommodityList/index',
  'shop/popularShop': 'pages/popularShop/index', // 人气店铺
}

// 商品相关
export const commodityMergeRouter = {
  'commodityMerge/stocksSourcing/index': 'pages/stocksSourcing/index',
  'commodityMerge/stocksSourcing/detail': 'pages/stocksSourcing/detail/index',
  'commodityMerge/stocksSourcing/detailGroup': 'pages/stocksSourcing/detailGroup/index',
  'commodityMerge/stocksSourcing/shareGroupDetail': 'pages/stocksSourcing/shareGroupDetail/index',
  'commodityMerge/stocksSourcing/evaluateRecord': 'pages/stocksSourcing/evaluateRecord/index',
  'commodityMerge/stocksSourcing/transactionRecord': 'pages/stocksSourcing/transactionRecord/index',
  'commodityMerge/stocksSourcing/conponSimilarList': 'pages/stocksSourcing/conponSimilarList/index',
  'commodityMerge/stocksSourcing/salesCampaignList': 'pages/stocksSourcing/salesCampaignList/index',
  'commodityMerge/stocksSourcing/changeProduct': 'pages/stocksSourcing/changeProduct/index',
  'commodityMerge/soleSourcing/index': 'pages/soleSourcing/index',
  'commodityMerge/soleSourcing/detail': 'pages/soleSourcing/detail/index',
  'commodityMerge/pointsSourcing/detail': 'pages/pointsSourcing/detail/index',
}

// 售后相关
export const afterServiceRouter = {
  'afterService/afterTodo/applyAs': 'pages/afterTodo/applyAs/index', // 申请售后
  'afterService/afterTodo/refundApply': 'pages/afterTodo/refundTodo/refundApply/index', // 申请售后 -> 退货
  'afterService/afterTodo/refundPrSubmit/refundEditProducts':
    'pages/afterTodo/refundTodo/refundPrSubmit/refundEditProducts/index', // 申请售后 -> 编辑换货商品
  'afterService/afterTodo/refundPrSubmit/refundEditReturnmount':
    'pages/afterTodo/refundTodo/refundPrSubmit/refundEditReturnmount/index', // 申请售后 -> 退款金额
  'afterService/afterTodo/refundPrSendOut/refundSendOut':
    'pages/afterTodo/refundTodo/refundPrSendOut/refundSendOut/index', // 售后退货 -> 退货发货
  'afterService/afterTodo/refundPrConfirmResult/refundConfirmResult':
    'pages/afterTodo/refundTodo/refundPrConfirmResult/refundConfirmResult/index',
  'afterService/afterTodo/refundPrConfirmResult/refundInfo':
    'pages/afterTodo/refundTodo/refundPrConfirmResult/refundInfo/index',
  'afterService/afterTodo/refundPrConfirmResult/checkVoucher':
    'pages/afterTodo/refundTodo/refundPrConfirmResult/checkVoucher/index',
  'afterService/afterTodo/refundPrConfirmResult/refundConfirmTransferred':
    'pages/afterTodo/refundTodo/refundPrConfirmResult/refundConfirmTransferred/index',
  'afterService/afterTodo/refundPrFinished/refundSubmitFinished':
    'pages/afterTodo/refundTodo/refundPrFinished/refundSubmitFinished/index',
  'afterService/afterTodo/exchangeApply': 'pages/afterTodo/exchangeTodo/exchangeApply/index', // 申请售后 -> 换货
  'afterService/afterTodo/exchangePrSubmit/exchangeEditProducts':
    'pages/afterTodo/exchangeTodo/exchangePrSubmit/exchangeEditProducts/index', // 申请售后 -> 编辑换货商品
  'afterService/afterRecords/refundRecords': 'pages/afterRecords/refundRecords/index', // 申请售后 -> 售后退货记录
  'afterService/afterRecords/refundRecords/refundDetails': 'pages/afterRecords/refundRecords/refundDetails/index', // 申请售后 -> 售后退货详情
  'afterService/afterRecords/refundRecords/refundDeliveryDetails':
    'pages/afterRecords/refundRecords/refundDeliveryDetails/index', // 申请售后 -> 售后退货发货明细
  'afterService/afterRecords/exchangeRecords': 'pages/afterRecords/exchangeRecords/index', // 售后换货 -> 售后换货记录
  'afterService/afterRecords/exchangeRecords/exchangeDetails':
    'pages/afterRecords/exchangeRecords/exchangeDetails/index', // 售后换货 -> 售后换货详情
  'afterService/afterRecords/exchangeRecords/exchangeRefundDeliveryDetails':
    'pages/afterRecords/exchangeRecords/exchangeRefundDeliveryDetails/index', // 售后换货 -> 售后换货退货发货明细
  'afterService/afterRecords/exchangeRecords/exchangeReceivedDetails':
    'pages/afterRecords/exchangeRecords/exchangeReceivedDetails/index', // 售后换货 -> 售后换货收货明细
  'afterService/afterTodo/exchangePrSendOut/exchangeSendOut':
    'pages/afterTodo/exchangeTodo/exchangePrSendOut/exchangeSendOut/index', // 售后换货 -> 换货退货发货
  'afterService/afterTodo/exchangePrReceived/exchangeReceived':
    'pages/afterTodo/exchangeTodo/exchangePrReceived/exchangeReceived/index', // 售后换货 -> 换货收货
  'afterService/afterTodo/exchangePrFinished/exchangeSubmitFinished':
    'pages/afterTodo/exchangeTodo/exchangePrFinished/exchangeSubmitFinished/index', // 售后换货 -> 确认售后完成
  'afterService/afterTodo/repairApply': 'pages/afterTodo/repairTodo/repairApply/index', // 申请售后 -> 维修
  'afterService/afterTodo/repairPrFinished/repairSubmitFinished':
    'pages/afterTodo/repairTodo/repairPrFinished/repairSubmitFinished/index', // 售后维修 -> 确认售后完成
  'afterService/afterRecords/repairRecords': 'pages/afterRecords/repairRecords/index', // 售后维修 -> 售后维修记录
  'afterService/afterRecords/repairRecords/repairDetails': 'pages/afterRecords/repairRecords/repairDetails/index', // 售后维修 -> 售后维修详情
  'afterService/afterRecords/voucherList': 'pages/afterRecords/voucherList/index',
  'afterService/afterRecords/chooseLogisticsCompany': 'pages/afterRecords/chooseLogisticsCompany/index',
}

/** 品类导航页 */
export const categoryNavigation = {
  'categoryNavigation/index': 'pages/categoryNavigation/index',
}

/** 活动页 */
export const activityRouter = {
  'activity/index': 'pages/activityPage/index',
}

/** 合同 */
export const contractRouter = {
  'contract/signatureDetail': 'pages/signatureDetail/index',
  'contract/signatureAuth': 'pages/signatureAuth/index',
  'contract/submitSucceed': 'pages/submitSucceed/index',
}

/** 采购寻源 */
export const ashPurchaseRouter = {
  'askPurchase/list': 'pages/list/index',
  'askPurchase/detail': 'pages/detail/index',
  'askPurchase/quoteDetail': 'pages/quoteDetail/index', // 报价详情
  'askPurchase/offerDetail': 'pages/offerDetail/index', // 查看报价
  'askPurchase/add': 'pages/add/index',
  'askPurchase/skuList': 'pages/skuList/index', // 关联sku商品列表
  'askPurchase/buyer/feedback': 'pages/buyer/feedback/index',
  'askPurchase/buyer/list': 'pages/buyer/list/index', // 采购商-寻源需求
  'askPurchase/buyer/add': 'pages/buyer/add/index', // 采购商-新增寻源需求
  'askPurchase/buyer/edit': 'pages/buyer/edit/index', // 采购商-修改寻源需求
  'askPurchase/merchants/list': 'pages/merchants/list/index', // 供应商-寻源管理
  'askPurchase/merchants/quoteList': 'pages/merchants/quoteList/index', // 供应商-报价管理
  'askPurchase/merchants/feedback': 'pages/merchants/feedback/index',
  'askPurchase/supplierList': 'pages/supplierList/index', // 供应商列表
}
/**
 * im 消息列表
 */
export const imRouter = {
  'im/chatList': 'pages/chatList/index',
  'im/chatRoom': 'pages/chatRoom/index',
}

// 分销中心
export const distributionRouter = {
  'distribution/mine': 'pages/mine/index', // 分销中心
  'distribution/apply': 'pages/apply/index', // 成为分销员
  'distribution/addShop': 'pages/addShop/index', // 加入商城
  'distribution/invitation': 'pages/invitation/index', // 分销员邀请
  'distribution/list': 'pages/list/index', // 分销员列表
  'distribution/detail': 'pages/detail/index', // 分销员明细
  'distribution/reward': 'pages/reward/index', // 分销返现明细
  'distribution/goods': 'pages/goods/index', // 商品详情
}

// 团长中心
export const teamLeaderRouter = {
  'teamLeader/mine': 'pages/mine/index', // 团长中心
  'teamLeader/apply': 'pages/apply/index', // 申请团长
  'teamLeader/applicationForm': 'pages/applicationForm/index', // 填写团长信息
  'teamLeader/detail': 'pages/detail/index', // 填写团长信息
  'teamLeader/applySuccess': 'pages/applySuccess/index', // 申请团长提交成功
  'teamLeader/groupBuyList': 'pages/groupBuyList/index', // 社区团购活动列表
  'teamLeader/groupBuyDetail': 'pages/groupBuyDetail/index', // 团购详情页
  'teamLeader/receiptList': 'pages/receiptList/index', // 团长收货单列表
  'teamLeader/receiptDetail': 'pages/receiptDetail/index', // 团长收货单详情
  'teamLeader/enrolledActivityList': 'pages/enrolledActivityList/index', // 已报名活动
  'teamLeader/groupPurchaseOrders': 'pages/groupPurchaseOrders/index', // 团购订单管理
  'teamLeader/agentPickup': 'pages/agentPickup/index', // 待取货(代取)
  'teamLeader/selfPickup': 'pages/selfPickup/index', // 待取货(自提)
  'teamLeader/scanVerify': 'pages/scanVerify/index', // 扫码核销
}

// 社区团购列表
export const communityGroupBuyRouter = {
  'communityGroupBuy/list': 'pages/list/index', // 社区团购列表
  'communityGroupBuy/changeSelfPickupAddress': 'pages/changeSelfPickupAddress/index', // 切换自提点
  'communityGroupBuy/productDetail': 'pages/productDetail/index', // 商品详情
  'communityGroupBuy/activityDetail': 'pages/activityDetail/index', // 活动详情
}

// 使用所有路由的集合
export const mergeRouter = {
  ...rootRouter,
  ...basicSettingRouter,
  ...orderRouter,
  ...afterServiceRouter,
  ...commodityMergeRouter,
  ...shopRouter,
  ...companyNewsRouter,
  ...contractRouter,
  ...membersRouter,
  ...categoryNavigation,
  ...activityRouter,
  ...userRouter,
  ...ashPurchaseRouter,
  ...imRouter,
  ...extraRouter,
  ...distributionRouter,
  ...teamLeaderRouter,
  ...communityGroupBuyRouter,
}
export type RouterList = typeof mergeRouter

export type RouterKeys = keyof RouterList
