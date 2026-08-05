import { getIntl } from '@linkseeks/i18n'

/**
 * @param ladders 打折（减免）的梯度数组
 * @returns 满量（额）折扣（减免元）梯度提示语
 */
const fnGetDiscount = (ladders: any, unit: string, reduction: number) => {
  const reductionMaps = {
    1: getIntl().formatMessage({ id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_unit_3' }),
    2: getIntl().formatMessage({ id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_unit_2' }),
  }
  let callBlackTips = ''
  ladders.forEach((item: any) => {
    const keys = Object.keys(item)[0]
    // reduction 1:折 2:元
    if (reduction === 1) {
      callBlackTips = getIntl().formatMessage({
        id: 'purchase_commonlyFn_callBlackTips_fnGetDiscount_1',
        callBlackTips,
        keys,
        unit,
        itemKeys: reduction === 1 ? item[keys] / 10 : item[keys],
        reductions: reductionMaps[reduction],
      })
    } else {
      callBlackTips = getIntl().formatMessage({
        id: 'purchase_commonlyFn_callBlackTips_fnGetDiscount_2',
        callBlackTips,
        keys,
        unit,
        itemKeys: reduction === 1 ? item[keys] / 10 : item[keys],
        reductions: reductionMaps[reduction],
      })
    }
  })
  return callBlackTips
}

/**
 *
 * @param newCommodity  当前商品
 * @returns 提示语
 */
const fnGetActivityTips = (newActivity: any) => {
  let callBlackTips = getIntl().formatMessage({ id: 'purchase_commonlyFn_fnGetEstimate' })
  if (newActivity.activityType === 4 && newActivity.concreteType === 1) {
    // 4 + 1 满量促销+满量减免
    callBlackTips = fnGetDiscount(
      newActivity.ladders,
      getIntl().formatMessage({ id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_unit_1' }),
      2,
    )
  } else if (newActivity.activityType === 4 && newActivity.concreteType === 2) {
    // 4 + 2 满量促销+满量折扣
    callBlackTips = fnGetDiscount(
      newActivity.ladders,
      getIntl().formatMessage({ id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_unit_1' }),
      1,
    )
  } else if (newActivity.activityType === 5 && newActivity.concreteType === 3) {
    // 5 + 3 满额促销+满额减免
    callBlackTips = fnGetDiscount(
      newActivity.ladders,
      getIntl().formatMessage({ id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_unit_2' }),
      2,
    )
  } else if (newActivity.activityType === 5 && newActivity.concreteType === 4) {
    // 5 + 4 满额促销+满额折扣
    callBlackTips = fnGetDiscount(
      newActivity.ladders,
      getIntl().formatMessage({ id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_unit_2' }),
      1,
    )
  } else if (newActivity.activityType === 7) {
    // 7 多件促销
    callBlackTips = fnGetDiscount(
      newActivity.ladders,
      getIntl().formatMessage({ id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_unit_1' }),
      1,
    )
  }
  return callBlackTips
}

export { fnGetActivityTips, fnGetDiscount }
