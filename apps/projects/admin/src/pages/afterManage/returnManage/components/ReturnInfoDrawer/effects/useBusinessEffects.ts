/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 18:30:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-07 16:40:29
 * @Description: 联动逻辑相关
 */
import { FormEffectHooks, FormPath } from '@apps/formily'

const { onFieldValueChange$ } = FormEffectHooks

export const useBusinessEffects = (_, actions) => {
  const { getFieldValue, setFieldValue } = actions

  // 联动退款金额
  onFieldValueChange$('payList.*.refundAmount').subscribe(async () => {
    const payListValue = await getFieldValue('payList')
    const amount = payListValue.reduce((pre, now) => +now.refundAmount + pre, 0)
    setFieldValue('refundAmount', amount)
  })
}
