/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 18:30:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-31 10:42:22
 * @Description: 联动逻辑相关
 */
import { Modal } from 'antd'
import { FormEffectHooks, FormPath } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { getLogisticsSelectListShipperAddress } from '@apps/apis'

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

export const useBusinessEffects = (context, actions) => {
  const { getFieldValue, setFieldValue, getFieldState, setFieldState } = actions
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

    // 不需要做数量校验
    // setFieldState(
    //   FormPath.transform(name, /\d/, $1 => {
    //     return `replaceGoodsList.${$1}.replaceCount`
    //   }),
    //   state => {
    //     if (+value > replacedCountValue) {
    //       state.errors = '填写值已超过最大可换货数量，请重新填写';
    //     } else {
    //       state.errors = '';
    //     }
    //   }
    // );
  })

  // 供应会员联动 单据明细
  onFieldInputChange$('*(supplierMember,orderType)').subscribe((fieldState) => {
    const replaceGoodsListValue = getFieldValue('replaceGoodsList')
    if (replaceGoodsListValue && replaceGoodsListValue.length) {
      setFieldValue('replaceGoodsList', [])
    }
  })
}
