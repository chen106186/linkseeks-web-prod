/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-07 15:59:30
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-11-19 15:18:29
 * @Description:
 */
import { useBusinessEffects } from './useBusinessEffects'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'

export const createEffects = (context, actions) => {
  const { setFieldState } = actions

  useBusinessEffects(context, actions)
}
