/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 18:19:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:53:27
 * @Description:
 */
import { FormEffectHooks, FormPath } from '@apps/formily'
import { useBusinessEffects } from './useBusinessEffects'
import { getLogisticsSelectListReceiverAddress } from '@apps/apis'

const { onFormMount$ } = FormEffectHooks

export const createEffects = (context, actions) => {
  const { setFieldState } = actions

  useBusinessEffects(context, actions)

  onFormMount$().subscribe(() => {
    // 获取收件地址
    getLogisticsSelectListReceiverAddress().then((res) => {
      if (res.code === 1000) {
        setFieldState('repairAddress', (state) => {
          state.props['x-component-props'].dataSource = res.data
        })
      }
    })
  })
}
