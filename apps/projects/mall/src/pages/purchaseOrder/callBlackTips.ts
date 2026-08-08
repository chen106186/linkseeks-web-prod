/**
 * @param ladders 打折（减免）的梯度数组
 * @returns 满量（额）折扣（减免元）梯度提示语
 */
const fnGetDiscount = (ladders: any, unit: string, reduction: string) => {
  let callBlackTips = ''
  ladders.forEach((item: any, index: number) => {
    callBlackTips = `${callBlackTips}${item.desc}${index < ladders.length - 1 ? ' ; ' : ''}`
  })
  return callBlackTips
}

/**
 *
 * @param newCommodity  当前商品
 * @returns 提示语
 */
const fnGetActivityTips = (newActivity: any) => {
  let callBlackTips = '这种活动还没有做显示'
  if (newActivity.activityType === 4 && newActivity.concreteType === 1) {
    // 4 + 1 满量促销+满量减免
    callBlackTips = fnGetDiscount(newActivity.preferentialTagDescs, '件', '元')
  } else if (newActivity.activityType === 4 && newActivity.concreteType === 2) {
    // 4 + 2 满量促销+满量折扣
    callBlackTips = fnGetDiscount(newActivity.preferentialTagDescs, '件', '折')
  } else if (newActivity.activityType === 5 && newActivity.concreteType === 3) {
    // 5 + 3 满额促销+满额减免
    callBlackTips = fnGetDiscount(newActivity.preferentialTagDescs, '元', '元')
  } else if (newActivity.activityType === 5 && newActivity.concreteType === 4) {
    // 5 + 4 满额促销+满额折扣
    callBlackTips = fnGetDiscount(newActivity.preferentialTagDescs, '元', '折')
  } else if (newActivity.activityType === 7) {
    // 7 多件促销
    callBlackTips = fnGetDiscount(newActivity.preferentialTagDescs, '件', '折')
  }
  return callBlackTips
}

export { fnGetActivityTips, fnGetDiscount }
