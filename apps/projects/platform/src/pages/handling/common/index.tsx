import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
/**
 * 时间
 */
export const commonTimeList = [
  { label: intl.formatMessage({ id: 'handling.jintian' }), value: 1 },
  { label: intl.formatMessage({ id: 'handling.yizhounei' }), value: 2 },
  { label: intl.formatMessage({ id: 'handling.yigeyuenei' }), value: 3 },
  { label: intl.formatMessage({ id: 'handling.sangeyuenei' }), value: 4 },
  { label: intl.formatMessage({ id: 'handling.liugeyuenei' }), value: 5 },
  { label: intl.formatMessage({ id: 'handling.yiniannei' }), value: 6 },
  { label: intl.formatMessage({ id: 'handling.yinianqian' }), value: 7 },
]

/**
 * 单据时间
 */
export const docTime = [{ label: intl.formatMessage({ id: 'handling.danjushijianquanbu' }), value: 0 }].concat(
  commonTimeList,
)

/**
 * 下单时间
 */
export const orderTime = [{ label: intl.formatMessage({ id: 'handling.dingdanshijianquanbu' }), value: 0 }].concat(
  commonTimeList,
)

export const ASSIGN_QUERY = '/handling/assign/query'
export const ASSIGN_TO_BE_ADD_QUERY = '/handling/assign/tobeAddQuery'
export const ASSIGN_PENDING_FIRST = '/handling/assign/pendingFirst'
export const ASSIGN_PENDING_SECOND = '/handling/assign/pendingSecond'
export const ASSIGN_PENDING_SUBMIT = '/handling/assign/pendingSubmit'

/**
 * 指派生产通知单->待收货生产通知单
 */
export const ASSIGN_PENDING_RECEIVE = '/handling/assign/pendingReceive'

/**
 * 确认生产通知单MENU -> 生产通知单查询， 待提交生产通知单，待审核（一级）， 待审核（二级），待确认生产通知单
 */
export const CONFIRM_QUERY = '/handling/confirm/query'
export const CONFIRM_PENDING_SUBMIT = '/handling/confirm/pendingSubmit'
export const CONFIRM_PENDING_FIRST = '/handling/confirm/pendingFirst'
export const CONFIRM_PENDING_SECOND = '/handling/confirm/pendingSecond'
export const CONFIRM_PENDING_CONFIRM = '/handling/confirm/pendingConfirm'

/**
 * 以下是以下detail 的路径
 */

const DETAIL = '/detail'
export const ASSIGN_QUERY_DETAIL = ASSIGN_QUERY + DETAIL
export const ASSIGN_TO_BE_ADD_QUERY_DETAIL = ASSIGN_TO_BE_ADD_QUERY + DETAIL
export const ASSIGN_PENDING_FIRST_DETAIL = ASSIGN_PENDING_FIRST + DETAIL
export const ASSIGN_PENDING_SECOND_DETAIL = ASSIGN_PENDING_SECOND + DETAIL
export const ASSIGN_PENDING_SUBMIT_DETAIL = ASSIGN_PENDING_SUBMIT + DETAIL
export const ASSIGN_PENDING_RECEIVE_DETAIL = ASSIGN_PENDING_RECEIVE + DETAIL

export const CONFIRM_QUERY_DETAIL = CONFIRM_QUERY + DETAIL
export const CONFIRM_PENDING_SUBMIT_DETAIL = CONFIRM_PENDING_SUBMIT + DETAIL
export const CONFIRM_PENDING_FIRST_DETAIL = CONFIRM_PENDING_FIRST + DETAIL
export const CONFIRM_PENDING_SECOND_DETAIL = CONFIRM_PENDING_SECOND + DETAIL
export const CONFIRM_PENDING_CONFIRM_DETAIL = CONFIRM_PENDING_CONFIRM + DETAIL

/**
 * 指派生产通知单-生产通知单查询页
 */

export const QUERY_SEARCH_NAME = 'noticeNo'

/**
 * 指派生产通知单-待新增生产通知单列表页
 */

export const TO_BE_ADD_QUERY_SEARCH_NAME = 'noticeNo'

/**
 * 指派生产通知单-待审核生产通知单（一级）
 * 指派生产通知单-待审核生产通知单（二级）
 */
export const PENDING_FIRST_AND_SECOND_NOTICE = 'noticeNo'

/**
 * 指派生产通知单-待提交生产通知单
 */
export const PENDING_TO_SUBMIT = 'noticeNo'

/**
 * 指派生产通知单-待新增加工入库单
 */

export const PENDING_ADD_PROCESS = 'summary'

/**
 * 指派生产通知单-待收货生产通知单
 */

export const PENDING_RECEIVE_SCHEMA = 'noticeNo'

/**
 * 下面设置各个 path 常量
 */

const QUERY_TITLE = intl.formatMessage({ id: 'handling.shengchantongzhidanchaxun' })

/**
 * 待新增生产通知单
 */
const TO_BE_ADD_QUERY_TITLE = intl.formatMessage({ id: 'handling.daixinzengshengchantongzhidan' })

/**
 * 带审核生产通知单（一级）
 */
const PENDING_FIRST_TITLE = intl.formatMessage({ id: 'handling.daishenhetongzhidanyi' })

/**
 * 待审核通知单（二级）
 */
const PENDING_SECOND_TITLE = intl.formatMessage({ id: 'handling.daishenhetongzhidaner' })

/**
 * 待审核生产通知单
 */
const PENDING_SUBMIT_TITLE = intl.formatMessage({ id: 'handling.daitijiaoshengchantongzhidan' })

/**
 * 待收货生产通知单
 */
export const PENDING_RECEIVE = '/pendingReceive'
const PENDING_RECEIVE_TITLE = intl.formatMessage({ id: 'handling.daishouhuoshengchantongzhidan' })

export const ASSINGN_TITLE_MAPS = {
  [ASSIGN_QUERY]: QUERY_TITLE,
  [ASSIGN_TO_BE_ADD_QUERY]: TO_BE_ADD_QUERY_TITLE,
  [ASSIGN_PENDING_FIRST]: PENDING_FIRST_TITLE,
  [ASSIGN_PENDING_SECOND]: PENDING_SECOND_TITLE,
  [ASSIGN_PENDING_SUBMIT]: PENDING_SUBMIT_TITLE,
}

export const COMFIRM_TITLE_MAPS = {
  [CONFIRM_QUERY]: intl.formatMessage({ id: 'handling.shengchantongzhidanchaxun' }),
  [CONFIRM_PENDING_SUBMIT]: intl.formatMessage({ id: 'handling.daitijiaoshengchantongzhidan' }),
  [CONFIRM_PENDING_FIRST]: intl.formatMessage({ id: 'handling.daishenheshengchantongzhidan' }),
  [CONFIRM_PENDING_SECOND]: intl.formatMessage({ id: 'handling.daishenheshengchantongzhidan' }),
  [CONFIRM_PENDING_CONFIRM]: intl.formatMessage({ id: 'handling.daiquerenshengchantongzhidan1' }),
}

// export const DETAIL_PATH = {
//   [QUERY_PATH]: ASSIGN_QUERY_DETAIL,
//   [TO_BE_ADD_QUERY_PATH]: ASSIGN_TO_BE_ADD_QUERY_DETAIL,
//   [PENDING_FIRST]: ASSIGN_PENDING_FIRST_DETAIL,
//   [PENDING_SECOND]: ASSIGN_PENDING_SECOND_DETAIL,
//   [PENDING_SUBMIT]: ASSIGN_PENDING_SUBMIT,
//   [PENDING_RECEIVE]: ASSIGN_PENDING_RECEIVE_DETAIL,
// }

export const INNER_STATUS_BADGE_COLOR = {
  '1': 'default',
  '2': 'warning',
  '3': 'processing',
  '4': 'success',
  '5': 'error',
  '9': 'error',
}

/**
 * 指派生产通知单-> 列表页 -> 内部状态： 只有四种装填：待审核， 待提交审核通知单- 审核不通过， 审核通过
 */
// supplierInnerStatus,
export const SUPPLIER_INNER_STATUS_COLOR = {
  '1': 'default',
  '2': 'warning',
  '3': 'processing',
  '4': 'processing',
  '5': 'success',
  '6': 'processing',
  '7': 'warning',
  '8': 'processing',
  '9': 'error',
  '10': 'success',
}

/**
 * 指派生产通知单 -> 详情页 -> 内部状态-》 颜色
 */

export const SUPPLIER_DETAIL_INNER_STATUS_COLOR = [
  '',
  '#d9d9d9', // 待提交审核
  'yellow', // 待审核
  'red', // 审核不通过
  'green', // 审核通过
  'lime', // 提交完成
  'blue', // 待新增入库单
  'orange', // 待审核加工入库单
  'yellow', // 待确认收货
  'cyan', // 已确认收货
  'green', // 完成
]

/**
 * 确认生产通知单 -> 详情页 -> 内部状态 -> 颜色
 */
export const CONFIRM_DETAIL_INNER_STATUS_COLOR = [
  'red', // 不接受申请
  '#d9d9d9', // 待提交申请,
  'yellow', // 待审核
  'red', // 审核不通过
  'green', // 审核通过
  'blue', // 待新增加工发货单
  'orange', // 待审核加工发货单
  'cyan', //  待新增物流单
  'geekblue', // 待确认物流单
  'gold', // 待确认发货，
  'green', // 已确认发货
  'orange', //待确认回单
  'green', // 完成
]

type SUPPLIER_OUTER_STATUS_COLOR_TYPE = ('default' | 'primary' | 'danger' | 'success' | 'warning')[]
/**
 * 指派生产通知单 -> 列表页 -> 外部状态
 */
export const SUPPLIER_OUTER_STATUS_COLOR: SUPPLIER_OUTER_STATUS_COLOR_TYPE = [
  'default',
  'default',
  'primary',
  'warning',
  'danger',
  'success',
]

/**
 * 确认生产通知单 -> 列表页 -> 内部状态
 */
export const PROCESS_OUTER_STATUS_COLOR: ('default' | 'processing' | 'error' | 'success' | 'warning')[] = [
  'error', // 不接受申请
  'default', // 待提交审核          processInnerStatus = 1,
  'warning', // 待审核             processInnerStatus = 2,
  'error', // 待审核(1级)        processInnerStatus = 3  不通过
  'success', // 待审核（2级）      processInnerStatus = 4  审核通过
  'processing', // 待新增加工发货单   processInnerStatus = 5
  'warning', // 待审核加工发货单   processInnerStatus = 6
  'default', // 待新增物流单       processInnerStatus = 7
  'processing', // 待确认物流单        processInnerStatus = 8
  'warning', // 待确认发货         processInnerStatus = 9
  'success', // 已确认发货          processInnerStatus = 10
  'default', // processInnerStatus = 11 待确认回单
  'success', // 完成 processInnerStatus = 12
]

/**
 * 待新增加工入库单
 */
export const PENDING_ADD_PROCESS_PATH = '/handling/assign/pendingAddProcessing'

/**
 * 待新增加工发货单
 */
export const PROCESSING_INVOICE_TO_BE_ADD_PATH = '/handling/confirm/processingInvoiceTobeAdd'

/**
 * 待新增物流单
 */
export const PENDING_ADD_LOGISTICS_PATH = '/handling/confirm/pendingAddLogistics'

/**
 * 待发货生产通知单
 */
export const PENDING_DELIVERD_PATH = '/handling/confirm/pendingDelivered'

/**
 * 待确认回单生产通知单
 */
export const PENDING_RECEIPT_PATH = '/handling/confirm/pendingReceipt'

/**
 * 待加工发货单， 待加工入库单，待新增物流单，待发货生产通知单，待确认回单生产通知单， 待确认收货生产通知单
 * 以上几种单据标题，因为共用一个页面，需要根据链接去判断
 */

export const PROCESS_TITLE = {
  [PENDING_ADD_PROCESS_PATH]: intl.formatMessage({ id: 'handling.daixinjianjiagongrukudan' }),
  [PROCESSING_INVOICE_TO_BE_ADD_PATH]: intl.formatMessage({ id: 'handling.daixinzengjiagongfahuodan' }),
  [PENDING_ADD_LOGISTICS_PATH]: intl.formatMessage({ id: 'handling.daixinzengwuliudan' }),
  [PENDING_DELIVERD_PATH]: intl.formatMessage({ id: 'handling.daifahuoshengchantongzhidan' }),
  [ASSIGN_PENDING_RECEIVE]: intl.formatMessage({ id: 'handling.daiquerenshouhuoshengchantong' }),
  [PENDING_RECEIPT_PATH]: intl.formatMessage({ id: 'handling.daiquerenhuidanshengchantong' }),
}

/**
 * 收发货铭心 内部状态， 用发货状态，收货状态，回单状态去判断内部状态
 * 因为上面三种情况 1：代表待确认 2，表示已确认收发货，回单，
 */
export const DELIEVER_AND_RECEIVE_INNER_STATUS_TEXT = [
  '',
  intl.formatMessage({ id: 'handling.daiquerenfahuo' }),
  intl.formatMessage({ id: 'handling.yiquerenfahuo' }),
  intl.formatMessage({ id: 'handling.daiquerenshouhuo' }),
  intl.formatMessage({ id: 'handling.yiquerenshouhuo' }),
  intl.formatMessage({ id: 'handling.daiquerenhuidan' }),
  intl.formatMessage({ id: 'handling.yiquerenhuidan' }),
]

export const DELIEVER_AND_RECEIVE_INNER_BTN_TEXT = [
  '',
  intl.formatMessage({ id: 'handling.querenfahuo' }),
  intl.formatMessage({ id: 'handling.querenfahuo' }),
  intl.formatMessage({ id: 'handling.querenshouhuo' }),
  intl.formatMessage({ id: 'handling.querenshouhuo' }),
  intl.formatMessage({ id: 'handling.querenhuidan' }),
  intl.formatMessage({ id: 'handling.querenhuidan' }),
]

export const DELIEVER_AND_RECEIVE_INNER_STATUS = {
  '5_1': 1,
  '5_2': 2,
  '7_1': 3,
  '7_2': 4,
  '8_1': 5,
  '8_2': 6,
}

// 用户当前的会员类型：1-企业会员，2-企业个人会员，3-渠道企业会员，4-渠道个人会员
export const ENTERPRISE_MALL = { '1': 1, '2': 1, '3': 3, '4': 4 } // 根据当前用户角色查询商城
