import { getIntl } from '@linkseeks/i18n'

/**
 * 保留两位小数
 */
const fnKeepTwo = (stringPri: number) => {
  return (Math.round(Number(stringPri) * 100) / 100).toFixed(2)
}

/**
 *  获取优惠金额
 */
const fnGetPromotionAmount = (shopMessageStore: any, keepPoint = true) => {
  let promotionAmount = 0
  Object.keys(shopMessageStore).forEach((key: string) => {
    shopMessageStore[key].forEach((item: any) => {
      if (!item.saleTotalAmount) {
        // 没有优惠
        return
      }
      promotionAmount += item.saleTotalAmount
    })
  })
  return keepPoint ? fnKeepTwo(promotionAmount) : promotionAmount
  // return 0; // 防止错误 直接给0
}

/**
 *  获取促销活动
 */
const fnGetCgbAmount = (shopMessageStore: any, keepPoint = true) => {
	let promotionAmount = 0
	Object.keys(shopMessageStore).forEach((key: string) => {
		shopMessageStore[key].forEach((item: any) => {
			if (!item.handPrice || item.handPrice === item.basePrice) {
				// 没有优惠
				return
			}
			promotionAmount += (item.handPrice - item.basePrice) * item.count
		})
	})
	return keepPoint ? fnKeepTwo(promotionAmount) : promotionAmount
	// return 0; // 防止错误 直接给0
}

// 获取会员折扣金额
const fnGetMemberDisCountAmount = (shopMessageStore: any, keepPoint = true) => {
  let memberDiscountAmount = 0
  Object.keys(shopMessageStore).forEach((key: string) => {
    shopMessageStore[key].forEach((item: any) => {
      if (!item.memberDiscountAmount) {
        // 没有优惠
        return
      }
      memberDiscountAmount += item.memberDiscountAmount
    })
  })
  return keepPoint ? fnKeepTwo(memberDiscountAmount) : memberDiscountAmount
  // return 0; // 防止错误 直接给0
}

/**
 * 获取优惠卷优惠的金额
 */
const fnGetselectCouponMoney = (couponList: any) => {
  let moneyNumber = 0
  couponList.forEach((item: any) => {
    if (item && item.denomination) {
      moneyNumber += item.denomination
    }
  })
  return fnKeepTwo(moneyNumber)
}

/**
 * 获取积分抵扣优惠的金额
 */
const fnGetselectIntegralMoney = (couponList: any) => {
  let moneyNumber = 0
  couponList.forEach((item: any) => {
    if (item && item.enableDeductionAmount) {
      moneyNumber += item.enableDeductionAmount
    }
  })
  return fnKeepTwo(moneyNumber)
}

/**
 * 获取skuId
 */
const fnGetSkuId = (skuId: any) => {
  try {
    return Number(`${skuId.split('_')[0]}`)
  } catch (error) {
    return skuId
  }
}
/**
 *
 * @param lintMoney 当前的到手价
 * @param mainCom 主商品
 * @param getType 获取类型 为true的时候 会返回计件还是计价
 */
const fnGetLimtArr = (lintMoney: number, mainCom: any, getType = false) => {
  const arrDesc: any = []
  const numberPiece = [8, 9, 10] // 梯度是计算件数的
  let lintMoneyDesc = 0
  let typeIsCount = true
  mainCom.activityDetails.forEach((item: any) => {
    if (item.activityType === 13) {
      if (numberPiece.indexOf(item.concreteType) !== -1) {
        // 计件
        lintMoneyDesc = mainCom.count
      } else {
        lintMoneyDesc = mainCom.count * mainCom.estimatePrice // 计总额
        typeIsCount = false
      }
      item?.ladders.forEach((second: any) => {
        if (second.limitValue <= lintMoneyDesc) {
          second.list.forEach((thirth: any) => {
            arrDesc.push(thirth.skuId)
          })
        }
      })
    }
  })
  if (arrDesc.length === 0 && mainCom.topActivityDetail?.activityType === 13) {
    if (numberPiece.indexOf(mainCom.topActivityDetail.concreteType) !== -1) {
      // 计件
      lintMoneyDesc = mainCom.count
    } else {
      lintMoneyDesc = mainCom.count * mainCom.estimatePrice // 计总额
      typeIsCount = false
    }
    mainCom.topActivityDetail?.ladders.forEach((second: any) => {
      if (second.limitValue <= lintMoneyDesc) {
        second.list.forEach((thirth: any) => {
          arrDesc.push(thirth.skuId)
        })
      }
    })
  }
  if (getType) {
    return {
      typeIsCount,
      arrDesc,
    }
  }
  return arrDesc
}

/**
 * @param skuList
 * 获取sku属性
 */
const fnGetSku = (skuList: any) => {
	try {
		if (!skuList || skuList.length === 0) {
			return ''
		}
		const str = skuList.map((item: any) => `${item.name}:${item.value}`)
		return str.join(',')
	} catch (error) {
		return getIntl().formatMessage({ id: 'confirmOrder_components_commodutyCard_fnGetSku' })
	}
}
/**
 *  价格区间
 */
const fnGetPriceSection = (str: string, key: number) => {
	if (!str) {
		return 0
	}
	const arrStr = `${str}`.split('.')
	if (key === 1 && !arrStr[key]) {
		return `00`
	}
	return arrStr[key]
}
/**
 * @param item 当前商品
 * @returns 返回当前价格
 */
const fnGetNewEstimatePrice = (item: any) => {
	const { handPrice, estimatePrice, newPrice } = item
	return handPrice || estimatePrice || newPrice
}
export {
	fnKeepTwo,
	fnGetPromotionAmount,
	fnGetCgbAmount,
	fnGetselectCouponMoney,
	fnGetselectIntegralMoney,
	fnGetSkuId,
	fnGetLimtArr,
  fnGetMemberDisCountAmount,
	fnGetSku,
	fnGetPriceSection,
	fnGetNewEstimatePrice,
}
