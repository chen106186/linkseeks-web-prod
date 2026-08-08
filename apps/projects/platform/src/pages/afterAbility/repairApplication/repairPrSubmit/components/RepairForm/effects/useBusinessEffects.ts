/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 18:30:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-04-22 15:09:55
 * @Description: 联动逻辑相关
 */
import { FormEffectHooks, FormPath } from '@apps/formily'
import { ORDER_TYPE_INQUIRY_CONTRACT, ORDER_TYPE_BIDDING_CONTRACT, ORDER_TYPE_TENDER_CONTRACT } from '@/constants/order'
import { useLinkageUtils } from '@/utils/formEffectUtils'

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

export const useBusinessEffects = (context, actions) => {
  const { getFieldValue, setFieldValue, getFieldState, setFieldState } = actions
  const linkage = useLinkageUtils()

  // 校验维修数量
  onFieldInputChange$('repairGoodsList.*.repairCount').subscribe((fieldState) => {
    const { name, value } = fieldState
    // 已维修数量
    const repairedCountValue = getFieldState(
      FormPath.transform(name, /\d/, ($1) => {
        return `repairGoodsList.${$1}.extraData`
      }),
      (state) => state.value.remaining,
    )

    // 不需要做数量校验
    // setFieldState(
    //   FormPath.transform(name, /\d/, $1 => {
    //     return `repairGoodsList.${$1}.repairCount`
    //   }),
    //   state => {
    //     if (+value > repairedCountValue) {
    //       state.errors = '填写值已超过最大可维修数量，请重新填写';
    //     } else {
    //       state.errors = '';
    //     }
    //   }
    // );
  })

  // 供应会员、订单类型 联动 单据明细
  onFieldInputChange$('*(supplierMember,orderType)').subscribe((fieldState) => {
    const replaceGoodsListValue = getFieldValue('repairGoodsList')
    if (replaceGoodsListValue && replaceGoodsListValue.length) {
      setFieldValue('repairGoodsList', [])
    }
  })
}
