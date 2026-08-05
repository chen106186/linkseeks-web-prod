/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 18:30:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-31 10:34:04
 * @Description: 联动逻辑相关
 */
import BigNumber from 'bignumber.js'
import { getIntl } from '@linkseeks/i18n'
import { FormEffectHooks } from '@apps/formily'
import { isMaterialOrder } from '../../../utils'

const intl = getIntl()

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

export const useBusinessEffects = (context, actions) => {
  const { getFieldValue, setFieldValue, setFieldState } = actions

  // 联动退款金额
  onFieldValueChange$('payList.*.refundAmount').subscribe(async () => {
    const payListValue = await getFieldValue('payList')
    const amount = payListValue.reduce((pre, now) => new BigNumber(+now.refundAmount).plus(pre).toNumber(), 0)
    setFieldValue('refundAmount', amount)
  })

  // 退款数量 联动，支付信息里边的 退款金额
  onFieldInputChange$('returnCount').subscribe(async (fieldState) => {
    const { value } = fieldState
    const purchasePriceValue = await getFieldValue('purchasePrice')
    const orderTypeValue = await getFieldValue('orderType')
    const payListValue = (await getFieldValue('payList')) || []

    const isMateriel = isMaterialOrder(orderTypeValue)

    if (!isMateriel) {
      const newData = [...payListValue].map((item) => {
        const refundAmount = item.payTime
          ? +new BigNumber(+value)
              .multipliedBy(purchasePriceValue)
              .multipliedBy(new BigNumber(item.payRatio).dividedBy(100))
              .toFixed(2)
          : 0
        return {
          ...item,
          refundAmount,
        }
      })
      setFieldValue('payList', newData)
    }

    if (isMateriel) {
      const refundAmount = +new BigNumber(+value).multipliedBy(purchasePriceValue).toFixed(2)
      setFieldValue('refundAmount', refundAmount)
    }
  })

  // 校验退货数量
  onFieldInputChange$('returnCount').subscribe(async (fieldState) => {
    const { value } = fieldState
    // 剩余数量
    const remainingValue = await getFieldValue('remaining')

    setFieldState('returnCount', (state) => {
      if (+value > remainingValue) {
        state.errors = intl.formatMessage({
          id: 'afterService.components.ReturnInfoDrawer.returnCount.max',
          defaultMessage: '填写值已超过最大可退货数量，请重新填写',
        })
      } else {
        state.errors = ''
      }
    })
  })
}
