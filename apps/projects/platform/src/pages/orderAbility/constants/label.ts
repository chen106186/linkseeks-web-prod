import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

// export const ReceiptAddLabel = intl.formatMessage({id: 'coupon.weishiyong', defaultMessage: '新增收货单'});

export const ReceiptAddLabel = intl.formatMessage({ id: 'order.xinzengshouhuodan', defaultMessage: '新增收货单' })

export const ReceiptAbstractLabel = intl.formatMessage({ id: 'order.shouhuodanzhaiyao', defaultMessage: '收货单摘要' })
export const DeliveryAbstractLabel = intl.formatMessage({ id: 'order.songhuodanzhaiyao', defaultMessage: '送货单摘要' })
export const DeliveryAbstractNoLabel = intl.formatMessage({
  id: 'order.songhuotongzhibianhao',
  defaultMessage: '送货通知编号',
})
export const ReNoLabel = intl.formatMessage({ id: 'order.shouhuodanbianhao', defaultMessage: '收货单编号' })
export const DeliveryPanleNoLabel = intl.formatMessage({
  id: 'order.songhuojihuabianhao',
  defaultMessage: '送货计划编号',
})
export const SupplyMembersLabel = intl.formatMessage({ id: 'order.gongyinghuiyuan', defaultMessage: '供应会员' })
export const NoteLabel = intl.formatMessage({ id: 'order.beizhu', defaultMessage: '备注' })

export const ConsigneeLabel = intl.formatMessage({ id: 'order.shouhuoren', defaultMessage: '收货人' })
export const ConsigneeTimeLabel = intl.formatMessage({ id: 'order.fahuoshijian', defaultMessage: '发货时间' })
export const ConsigneePhoneLabel = intl.formatMessage({ id: 'order.shouhuorendianhua', defaultMessage: '收货人电话' })

export const DeliveryOrderNoLabel = intl.formatMessage({ id: 'order.songhuodingdanhao', defaultMessage: '送货订单号' })
export const DeliveryNoLabel = intl.formatMessage({ id: 'order.songhuodanbianhao', defaultMessage: '送货单编号' })
export const DeliveryDateLabel = intl.formatMessage({ id: 'order.fahuoriqi', defaultMessage: '发货日期' })
export const DeliveryTimeLabel = intl.formatMessage({ id: 'order.fahuoshijian', defaultMessage: '发货时间' })
export const DeliveryAddrLabel = intl.formatMessage({ id: 'order.songhuodizhi', defaultMessage: '送货地址' })
export const DeliverySlefAddrLabel = intl.formatMessage({ id: 'order.fahuozitidizhi', defaultMessage: '发货地址' })
export const DeliveryNameLabel = intl.formatMessage({ id: 'order.songhuoren', defaultMessage: '送货人' })
export const DeliveryPhoneLabel = intl.formatMessage({ id: 'order.songhuorendianhua', defaultMessage: '送货人电话' })

export const LogisticsCompanyLabel = intl.formatMessage({ id: 'order.wuliugongsi', defaultMessage: '物流公司' })
export const LogisticsCarNoLabel = intl.formatMessage({ id: 'order.chepaihaoma', defaultMessage: '车牌号码' })
export const LogisticsNoLabel = intl.formatMessage({ id: 'order.wuliudanhao', defaultMessage: '物流单号' })

export const PlanNumber = intl.formatMessage({ id: 'order.jihuabianhao', defaultMessage: '计划编号' })
export const SupplyMember = intl.formatMessage({ id: 'order.gongyinghuiyuan', defaultMessage: '供应会员' })
export const PlanSummary = intl.formatMessage({ id: 'order.jihuazhaiyao', defaultMessage: '计划摘要' })
export const PlanningCycle = intl.formatMessage({ id: 'order.jihuazhouqi', defaultMessage: '计划周期' })
export const ExternalState = intl.formatMessage({ id: 'order.waibuzhuangtai', defaultMessage: '外部状态' })

export const BuyerLabel = intl.formatMessage({ id: 'order.caigouhuiyuan', defaultMessage: '采购会员' })
export const OutStatusLabel = intl.formatMessage({ id: 'order.waibuzhuangtai', defaultMessage: '外部状态' })

export const DeliveryTypeLabel = intl.formatMessage({ id: 'order.peisongfangshi', defaultMessage: '配送方式' })

export const Purchaser = intl.formatMessage({ id: 'order.caigoushang', defaultMessage: '采购商' })
export const SubmitDeliveryPlan = intl.formatMessage({ id: 'order.tijiaosonghuojihua', defaultMessage: '提交送货计划' })

export const Supplier = intl.formatMessage({ id: 'order.gongyingshang', defaultMessage: '供应商' })
export const ConfirmDeliveryPlan = intl.formatMessage({
  id: 'order.querensonghuojihua',
  defaultMessage: '确认送货计划',
})

export const OutStatusLogTitleLabel = intl.formatMessage({
  id: 'order.waibudanjuliuzhuanjilu',
  defaultMessage: '外部单据流转记录',
})

export const NoticeNo = intl.formatMessage({ id: 'order.tongzhidanbianhao', defaultMessage: '通知单编号' })
export const NoticeSummary = intl.formatMessage({ id: 'order.tongzhidanzhaiyao', defaultMessage: '通知单摘要' })
export const DeliveryDate = intl.formatMessage({ id: 'order.songhuoriqi', defaultMessage: '送货日期' })
export const DeliveryTime = intl.formatMessage({ id: 'order.songhuoshijian', defaultMessage: '送货时间' })
export const ReceivingAddress = intl.formatMessage({ id: 'order.shouhuodizhi', defaultMessage: '收货地址' })
export const ReceivingTime = intl.formatMessage({ id: 'order.shouhuoshijian', defaultMessage: '收货时间' })
export const ReceivingDate = intl.formatMessage({ id: 'order.shouhuoriqi', defaultMessage: '收货日期' })

export const SubmitDeliveryNotice = intl.formatMessage({
  id: 'order.tijiaosonghuotongzhidan',
  defaultMessage: '提交送货通知单',
})
export const ConfirmDeliveryNotice = intl.formatMessage({
  id: 'order.querensonghuotongzhidan',
  defaultMessage: '确认送货通知单',
})

export const DeliveryPlanText = intl.formatMessage({ id: 'order.songhuojihua', defaultMessage: '送货计划' })
export const DeliveryPlanRemark = intl.formatMessage({
  id: 'order.zuichang600gezifu300ge',
  defaultMessage: '最长600个字符,300个汉字',
})

export const CreateDeliveryPlanTitleSRM = intl.formatMessage({
  id: 'order.xinzengsonghuojihuaSRM',
  defaultMessage: '新增送货计划(SRM)',
})
export const CreateDeliveryPlanTitleB2B = intl.formatMessage({
  id: 'order.xinzengsonghuojihuaB2B',
  defaultMessage: '新增送货计划(B2B)',
})

export const NoticeGenerated = intl.formatMessage({
  id: 'order.shengchengsonghuotongzhidan',
  defaultMessage: '生成送货通知单',
})
export const DeliveryNoteGenerated = intl.formatMessage({
  id: 'order.shengchengsonghuodan',
  defaultMessage: '生成送货单',
})

export const AlreadyNoticeGenerated = intl.formatMessage({
  id: 'order.yishengchengsonghuotongzhidan',
  defaultMessage: '已生成送货通知单',
})
export const AlreadyDeliveryNoteGenerated = intl.formatMessage({
  id: 'order.yishengchengsonghuodan',
  defaultMessage: '已生成送货单',
})

export const Deliverylimit = intl.formatMessage({
  id: 'order.songhuoshuliangbunengdayu',
  defaultMessage: '送货数量不能大于待送货数量',
})

export const PlearInput = '请输入'
