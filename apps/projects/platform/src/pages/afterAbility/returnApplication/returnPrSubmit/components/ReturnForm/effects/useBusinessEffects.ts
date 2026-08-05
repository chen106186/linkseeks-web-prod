/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 18:30:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-31 10:32:33
 * @Description: 联动逻辑相关
 */
import { FormEffectHooks } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

export const useBusinessEffects = (context, actions) => {
  const { getFieldValue, setFieldValue } = actions
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

  // 供应会员、售后订单类型联动 单据明细
  onFieldInputChange$('*(supplierMember,orderType)').subscribe((fieldState) => {
    const replaceGoodsListValue = getFieldValue('returnGoodsList')
    if (replaceGoodsListValue && replaceGoodsListValue.length) {
      setFieldValue('returnGoodsList', [])
    }
  })
}
