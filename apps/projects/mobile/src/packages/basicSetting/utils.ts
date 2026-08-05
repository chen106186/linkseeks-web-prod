import { getIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'

export const getTypeImg = (type: string) => {
  switch (type) {
    case getIntl().formatMessage({ id: 'pay.chongzhi', defaultMessage: '充值' }):
      return getOssUrlPath('/Images/e_chongzhi_icon.png')
    case getIntl().formatMessage({ id: 'pay.zhuanzhang', defaultMessage: '转账' }):
      return getOssUrlPath('/Images/e_zhuanzhang_icon.png')
    case getIntl().formatMessage({ id: 'pay.tixian', defaultMessage: '提现' }):
      return getOssUrlPath('/Images/e-tixian_icon.png')
    case getIntl().formatMessage({ id: 'pay.tuikuan', defaultMessage: '退款' }):
      return getOssUrlPath('/Images/e_tuikuan_icon.png')
    default:
      return getOssUrlPath('/Images/e_zhuanzhang_icon.png')
  }
}
