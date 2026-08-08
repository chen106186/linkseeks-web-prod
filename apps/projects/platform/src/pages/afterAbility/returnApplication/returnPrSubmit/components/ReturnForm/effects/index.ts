/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 18:19:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 20:04:00
 * @Description:
 */
import { useBusinessEffects } from './useBusinessEffects'
import { getLogisticsSelectListShipperAddress } from '@apps/apis'

export const createEffects = (context, actions) => {
  const { setFieldState } = actions

  useBusinessEffects(context, actions)

  // 获取发货地址
  getLogisticsSelectListShipperAddress()
    .then((res) => {
      if (res.code === 1000) {
        setFieldState('*(shippingAddress,pickupAddress)', (state) => {
          state.props['x-component-props'].dataSource = res.data
        })
      }
    })
    .catch((err) => {
      console.warn(err)
    })
}
