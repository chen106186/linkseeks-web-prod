/*
 * @Author: XieZhiXiong
 * @Date: 2021-12-02 19:00:53
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-02 19:53:36
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
