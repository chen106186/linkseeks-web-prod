import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export const validatorByte = (value: any, limitNumber: number) => {
  let _str = value
  _str = _str ? _str.replace(/[\u4E00-\u9FA5]/g, 'AA') : ''
  if (_str.length > limitNumber) {
    return Promise.reject(
      new Error(
        intl.formatMessage({
          id: 'balance.businessReconciliationCollaboration.components.modalOperate.validator',
          maxnumber2: limitNumber,
          maxnumber: limitNumber / 2,
        }),
      ),
    )
  } else {
    return Promise.resolve()
  }
}
