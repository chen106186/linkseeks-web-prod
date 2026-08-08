/*
 * @Author: XieZhiXiong
 * @Date: 2021-12-03 09:56:25
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 09:56:25
 * @Description:
 */
import { FormEffectHooks, FormPath } from '@apps/formily'
import { useBusinessEffects } from './useBusinessEffects'

const { onFormMount$ } = FormEffectHooks

export const createEffects = (context, actions) => {
  const { setFieldState, getFieldValue, getFieldState } = actions

  useBusinessEffects(context, actions)
}
