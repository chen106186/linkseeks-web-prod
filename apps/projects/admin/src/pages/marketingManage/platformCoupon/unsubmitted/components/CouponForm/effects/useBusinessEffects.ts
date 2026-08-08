/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-24 14:04:16
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 15:08:15
 * @Description:
 */
import { FormEffectHooks, FormPath, IFormActions } from '@apps/formily'
import moment from 'moment'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import {
  MERCHANT_COUPON_TYPE_UNIVERSAL,
  MERCHANT_COUPON_TYPE_CATEGORY,
  MERCHANT_COUPON_TYPE_BRAND,
  MERCHANT_COUPON_TYPE_PRODUCT,
  MERCHANT_COUPON_TYPE_VOUCHER,
  MERCHANT_COUPON_RECEIVE_FRONT,
  MERCHANT_COUPON_RECEIVE_ACTIVITY,
} from '@/constants/const/marketing'
import { ResponseType } from '../../../../components/MemberCheckboxGroup'
import { getMemberManageMarketingSuitableLevelConfigPage } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

// 获取 实用会员选项
const fetchMemberOptions: (params: {
  current: string
  pageSize: string
  levelConfigIds: string
  roleIds: string
  memberTypes: string
}) => Promise<ResponseType> = async (params) => {
  const res = await getMemberManageMarketingSuitableLevelConfigPage(params)
  if (res.code === 1000) {
    const options = res.data.data.map((item) => ({
      label: item.roleName,
      value: item.id,
      level: item.level,
      roleName: item.roleName,
      levelTypeName: item.levelTypeName,
      memberTypeName: item.memberTypeName,
      levelTag: item.levelTag,
    }))
    return {
      data: options,
      totalCount: res.data.totalCount,
    }
  }
  return {
    data: [],
    totalCount: 0,
  }
}

export const useBusinessEffects = (context, actions: IFormActions) => {
  const { getFieldValue, setFieldState, setFieldValue, getFieldState } = actions
  // const { id } = usePageStatus()
  const linkage = useLinkageUtils()

  // 优惠券类型
  onFieldInputChange$('type').subscribe((state) => {
    const { value } = state

    // 0元抵扣券
    if (value === MERCHANT_COUPON_TYPE_VOUCHER) {
    } else {
      setFieldState('getWay', (fieldState) => {
        FormPath.setIn(fieldState, 'value', undefined)
        FormPath.setIn(fieldState, 'props.x-component-props.disabled', false)
      })
    }
  })

  // 优惠券类型
  onFieldValueChange$('type').subscribe((state) => {
    const { value } = state
    const denominationValue = getFieldValue('denomination') // 券面额
    const useConditionMoneyValue = getFieldValue('useConditionMoney') // 使用条件

    // 0元抵扣券
    if (value === MERCHANT_COUPON_TYPE_VOUCHER) {
      // 设置领券方式为 营销活动用券，并设置禁用
      setFieldState('getWay', (fieldState) => {
        FormPath.setIn(fieldState, 'value', MERCHANT_COUPON_RECEIVE_ACTIVITY)
        FormPath.setIn(fieldState, 'props.x-component-props.disabled', true)
      })

      // 0元抵扣券，使用条件 等于 0 时 清空校验error
      if (useConditionMoneyValue && +useConditionMoneyValue === 0) {
        actions.clearErrors('useConditionMoney')
      }
    } else {
      // 非0元抵扣券，券面额 必须大于 0
      if (denominationValue && +denominationValue === 0) {
        setFieldState('denomination', (fieldState) => {
          FormPath.setIn(fieldState, 'errors', '券面额必须大于0')
        })
      }

      // 非0元抵扣券，使用条件 必须大于 0
      if (useConditionMoneyValue && +useConditionMoneyValue === 0) {
        setFieldState('useConditionMoney', (fieldState) => {
          FormPath.setIn(fieldState, 'errors', '使用条件必须大于0')
        })
      }
    }

    // 优惠券类型为 通用优惠券 隐藏 选择适用商品、选择适用品类、选择适用品牌页
    if (value === MERCHANT_COUPON_TYPE_UNIVERSAL) {
      linkage.hide('*(APPLICABLE_GOODS)')
    }

    // 优惠券类型为 商品优惠券 与 0元购买抵扣券时，显示 选择适用商品页
    if (value === MERCHANT_COUPON_TYPE_PRODUCT || value === MERCHANT_COUPON_TYPE_VOUCHER) {
      linkage.show('APPLICABLE_GOODS')
    }

    // 优惠券类型为 品类优惠券 时 显示 选择适用品类页
    if (value === MERCHANT_COUPON_TYPE_CATEGORY) {
      linkage.hide('*(APPLICABLE_GOODS)')
    }

    // 优惠券类型为 品牌优惠券时 显示 选择适用品牌页
    if (value === MERCHANT_COUPON_TYPE_BRAND) {
      linkage.hide('*(APPLICABLE_GOODS)')
    }
  })

  // 券面额
  onFieldValueChange$('denomination').subscribe((state) => {
    const { value } = state
    const typeValue = getFieldValue('type') // 优惠券类型
    const useConditionMoneyValue = getFieldValue('useConditionMoney') // 使用条件

    if (typeValue !== MERCHANT_COUPON_TYPE_VOUCHER && value && +value <= 0) {
      setFieldState('denomination', (fieldState) => {
        FormPath.setIn(fieldState, 'errors', '券面额必须大于0')
      })
    } else {
      actions.clearErrors('denomination')
    }

    // 券面额必须小于使用条件
    if (value && useConditionMoneyValue && +value >= +useConditionMoneyValue) {
      setFieldState('denomination', (fieldState) => {
        FormPath.setIn(fieldState, 'errors', '券面额必须小于使用条件')
      })
    } else {
      actions.clearErrors('denomination')
      actions.clearErrors('useConditionMoney')
    }
  })

  // 使用条件
  onFieldValueChange$('useConditionMoney').subscribe((state) => {
    const { value } = state
    const typeValue = getFieldValue('type') // 优惠券类型
    const denominationValue = getFieldValue('denomination') // 券面额

    if (typeValue !== MERCHANT_COUPON_TYPE_VOUCHER && value && +value <= 0) {
      setFieldState('useConditionMoney', (fieldState) => {
        FormPath.setIn(fieldState, 'errors', '使用条件必须大于0')
      })
    } else {
      actions.clearErrors('useConditionMoney')
    }

    // 券面额必须大于使用条件
    if (value && denominationValue && +value <= +denominationValue) {
      setFieldState('useConditionMoney', (fieldState) => {
        FormPath.setIn(fieldState, 'errors', '使用条件必须大于券面额')
      })
    } else {
      actions.clearErrors('useConditionMoney')
      actions.clearErrors('denomination')
    }
  })

  // 领券方式
  onFieldValueChange$('getWay').subscribe((state) => {
    const { value } = state
    const showReceiveCondition = value === MERCHANT_COUPON_RECEIVE_FRONT
    setFieldState('suitableMemberTypes', (state) => {
      if (state.value && state.value.length) {
        FormPath.setIn(state, 'value', [])
      }
    })

    setFieldState('receiveCondition', (state) => {
      FormPath.setIn(state, 'visible', showReceiveCondition)
    })
  })

  // 券有效期类型，展示对应的 FieldItem
  onFieldValueChange$('effectiveType').subscribe((state) => {
    const { value } = state
    if (value === 1) {
      linkage.show('[effectiveTimeStart, effectiveTimeEnd]')
      linkage.hide('invalidDay')
    } else {
      linkage.hide('[effectiveTimeStart, effectiveTimeEnd]')
      linkage.show('invalidDay')
    }
  })

  // 每日可领取量
  onFieldInputChange$('receiveCondition.conditionGetDay').subscribe((state) => {
    const { value } = state
    const conditionGetTotalValue = getFieldValue('receiveCondition.conditionGetTotal') // 每会员ID总共可领取;
    if (+value > +conditionGetTotalValue) {
      setFieldState('receiveCondition.conditionGetDay', (fieldState) => {
        FormPath.setIn(fieldState, 'errors', '每日可领取必须小于或等于总可领取量')
      })
    } else {
      actions.clearErrors('receiveCondition.conditionGetDay')
    }
  })

  // 每会员ID总共可领取
  onFieldInputChange$('receiveCondition.conditionGetTotal').subscribe((state) => {
    const { value } = state
    const conditionGetDayValue = getFieldValue('receiveCondition.conditionGetDay') // 每会员ID总共可领取;
    const quantityValue = getFieldValue('quantity') // 每会员ID总共可领取

    if (value && quantityValue) {
      if (+value > +quantityValue) {
        setFieldState('receiveCondition.conditionGetTotal', (fieldState) => {
          FormPath.setIn(fieldState, 'errors', '每会员ID总共可领取数量应该小于等于发券数量')
        })
      } else {
        actions.clearErrors('receiveCondition.conditionGetTotal')
      }
    }

    if (value && conditionGetDayValue) {
      if (+value < +conditionGetDayValue) {
        setFieldState('receiveCondition.conditionGetTotal', (fieldState) => {
          FormPath.setIn(fieldState, 'errors', '每会员ID总共可领取必须大于每日可领取')
        })
      } else {
        actions.clearErrors('receiveCondition.conditionGetTotal')
      }
    }
  })

  // 领(发)券起始时间
  onFieldValueChange$('[releaseTimeStart, releaseTimeEnd]').subscribe((state) => {
    const { value } = state
    const releaseTimeEndValue = value?.[1]
    const effectiveTime = getFieldValue('[effectiveTimeStart, effectiveTimeEnd]') // 券有效期
    const effectiveTimeEndValue = effectiveTime?.[1]

    if (releaseTimeEndValue && effectiveTimeEndValue && moment(releaseTimeEndValue) >= moment(effectiveTimeEndValue)) {
      setFieldState('[releaseTimeStart, releaseTimeEnd]', (fieldState) => {
        FormPath.setIn(fieldState, 'errors', '领(发)券截止时间应该小于券有效期截止时间')
      })
    } else {
      actions.clearErrors('[releaseTimeStart, releaseTimeEnd]')
    }
  })

  // 券有效期始时间
  onFieldValueChange$('[effectiveTimeStart, effectiveTimeEnd]').subscribe((state) => {
    const { value } = state
    const effectiveTimeEndValue = value?.[1]
    const releaseTime = getFieldValue('[releaseTimeStart, releaseTimeEnd]') // 券有效期
    const releaseTimeEndValue = releaseTime?.[1]

    if (effectiveTimeEndValue && releaseTimeEndValue && moment(effectiveTimeEndValue) <= moment(releaseTimeEndValue)) {
      setFieldState('[effectiveTimeStart, effectiveTimeEnd]', (fieldState) => {
        FormPath.setIn(fieldState, 'errors', '券有效期截止时间应该大于领(发)券截止时间')
      })
    } else {
      actions.clearErrors('[effectiveTimeStart, effectiveTimeEnd]')
    }
  })

  // 发券数量
  onFieldValueChange$('quantity').subscribe((state) => {
    const { value } = state
    const conditionGetTotalValue = getFieldValue('receiveCondition.conditionGetTotal') // 每会员ID总共可领取

    if (value && conditionGetTotalValue && +value <= +conditionGetTotalValue) {
      setFieldState('quantity', (fieldState) => {
        FormPath.setIn(fieldState, 'errors', '发券数量应该大于等于每会员ID总共可领取数量')
      })
    } else {
      actions.clearErrors('quantity')
    }
  })

  // 会员类型
  onFieldValueChange$('memberTypes').subscribe((state) => {
    const { value } = state
    setFieldState('applicationMemberLevel', (state) => {
      FormPath.setIn(state, 'props.x-component-props', {
        showMoreAction: true,
        extraParams: {
          memberTypes: Array.isArray(value) ? value.join(',') : value,
        },
        fetchOptions: fetchMemberOptions,
      })
    })
  })
}
