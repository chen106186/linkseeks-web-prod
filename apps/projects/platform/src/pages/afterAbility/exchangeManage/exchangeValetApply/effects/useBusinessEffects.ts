/*
 * @Author: XieZhiXiong
 * @Date: 2021-12-02 14:15:36
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-02 14:15:36
 * @Description:
 */
import { FormEffectHooks, FormPath } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { getLogisticsSelectListMemberReceiverAddress, getLogisticsSelectListMemberShipperAddress } from '@apps/apis'

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

export const useBusinessEffects = (context, actions) => {
  const { getFieldValue, setFieldState, setFieldValue, getFieldState } = actions
  const linkage = useLinkageUtils()

  // 联动配送方式
  onFieldValueChange$('deliveryType').subscribe((fieldState) => {
    const { name, value } = fieldState

    switch (value) {
      // 物流
      case 1: {
        linkage.show('shippingAddress')
        linkage.hide('pickupAddress')
        break
      }
      // 自提
      case 2: {
        linkage.hide('shippingAddress')
        linkage.show('pickupAddress')
        break
      }
      // 无需物流
      case 3: {
        linkage.hide('*(shippingAddress,pickupAddress)')
        break
      }
      default:
        break
    }
  })

  onFieldValueChange$('purchaser').subscribe((fieldState) => {
    const { originData, value } = fieldState

    const current = originData.find((item) => item.id === value)

    if (current) {
      setFieldState('deliveryAddress', (state) => {
        state.props['x-component-props'].getAddressListApi = getLogisticsSelectListMemberReceiverAddress
        state.props['x-component-props'].params = {
          memberId: current.memberId,
          roleId: current.roleId,
        }
      })

      setFieldState('*(pickupAddress)', (state) => {
        state.props['x-component-props'].getAddressListApi = getLogisticsSelectListMemberShipperAddress
        state.props['x-component-props'].params = {
          memberId: current.memberId,
          roleId: current.roleId,
        }
      })
    }
  })

  // 校验换货数量
  onFieldInputChange$('replaceGoodsList.*.replaceCount').subscribe((fieldState) => {
    const { name, value } = fieldState
    // 已换货数量
    const replacedCountValue = getFieldState(
      FormPath.transform(name, /\d/, ($1) => {
        return `replaceGoodsList.${$1}.extraData`
      }),
      (state) => state.value.remaining,
    )
  })

  // 供应会员联动 单据明细
  onFieldInputChange$('*(supplierMember,orderType)').subscribe((fieldState) => {
    const replaceGoodsListValue = getFieldValue('replaceGoodsList')
    if (replaceGoodsListValue && replaceGoodsListValue.length) {
      setFieldValue('replaceGoodsList', [])
    }
  })
}
