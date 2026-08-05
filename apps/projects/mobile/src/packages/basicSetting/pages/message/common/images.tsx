import { getOssUrlPath } from '@apps/constants'
const system = getOssUrlPath('/miniprogram/assets/images/system.png')
const notice = getOssUrlPath('/miniprogram/assets/images/notice.png')
const trade = getOssUrlPath('/miniprogram/assets/images/trade.png')
const purchase = getOssUrlPath('/miniprogram/assets/images/purchase_big.png')
const afterSale = getOssUrlPath('/miniprogram/assets/images/afterSale.png')
const capital = getOssUrlPath('/miniprogram/assets/images/capital.png')
const noticeSmall = getOssUrlPath('/miniprogram/assets/images/notice_small.png')
const systemSmall = getOssUrlPath('/miniprogram/assets/images/system_small.png')
const tradeSmall = getOssUrlPath('/miniprogram/assets/images/trade_small.png')
const purchaseSmall = getOssUrlPath('/miniprogram/assets/images/purchase_small.png')
const afterSaleSmall = getOssUrlPath('/miniprogram/assets/images/afterSale_small.png')
const capitalSmall = getOssUrlPath('/miniprogram/assets/images/capital_small.png')

const big = [system, trade, purchase, afterSale, capital, notice]
const small = [systemSmall, tradeSmall, purchaseSmall, afterSaleSmall, capitalSmall, noticeSmall]

export { big, small }
