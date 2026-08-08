import { getIntl } from '@linkseeks/i18n'
import {
  ACTIVITY_TYPE_1,
  ACTIVITY_TYPE_2,
  ACTIVITY_TYPE_3,
  ACTIVITY_TYPE_4,
  ACTIVITY_TYPE_5,
  ACTIVITY_TYPE_6,
  ACTIVITY_TYPE_7,
  ACTIVITY_TYPE_8,
  ACTIVITY_TYPE_9,
  ACTIVITY_TYPE_10,
  ACTIVITY_TYPE_11,
  ACTIVITY_TYPE_12,
  ACTIVITY_TYPE_13,
  ACTIVITY_TYPE_14,
  ACTIVITY_TYPE_15,
  ACTIVITY_TYPE_16,
  MANLIANG_JIAN,
  MANLIANG_ZHE,
  MANE_JIAN,
  MANE_ZHE,
  MANE_ZENG,
  BUYPRODUCT_ZENG,
} from '@/constants/marketing'
const intl = getIntl()

/**
 * 活动类型
 */
type activityType = {
  lable: string
  value: number
}[]
export const ACTIVITYTYPEARRAY: activityType = [
  { lable: `${intl.formatMessage({ id: 'selfManagement.noSales' })}`, value: ACTIVITY_TYPE_1 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.straightDownThePromotion' })}`, value: ACTIVITY_TYPE_2 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.salesPromotion' })}`, value: ACTIVITY_TYPE_3 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.fullAmountOfThePromotion' })}`, value: ACTIVITY_TYPE_4 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.quotaPromotion' })}`, value: ACTIVITY_TYPE_5 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.giftPromotion' })}`, value: ACTIVITY_TYPE_6 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.moreThanAPromotion' })}`, value: ACTIVITY_TYPE_7 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.combinationOfPromotion' })}`, value: ACTIVITY_TYPE_8 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.spellGroup' })}`, value: ACTIVITY_TYPE_9 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.luckyDraw' })}`, value: ACTIVITY_TYPE_10 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.bargaining' })}`, value: ACTIVITY_TYPE_11 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.secondsKill' })}`, value: ACTIVITY_TYPE_12 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.buy' })}`, value: ACTIVITY_TYPE_13 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.openToBooking' })}`, value: ACTIVITY_TYPE_14 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.package' })}`, value: ACTIVITY_TYPE_15 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.theTrial' })}`, value: ACTIVITY_TYPE_16 },
]
/** 叠加活动类型 */
export const OVERLAYACTIVITYTYPE = (int) => {
  switch (Number(int)) {
    case ACTIVITY_TYPE_1:
    case ACTIVITY_TYPE_2:
    case ACTIVITY_TYPE_3:
      return {
        B: [
          { label: `${intl.formatMessage({ id: 'selfManagement.fullAmountOfThePromotion' })}`, value: ACTIVITY_TYPE_4 },
          { label: `${intl.formatMessage({ id: 'selfManagement.quotaPromotion' })}`, value: ACTIVITY_TYPE_5 },
        ],
        C: [
          { label: `${intl.formatMessage({ id: 'selfManagement.giftPromotion' })}`, value: ACTIVITY_TYPE_6 },
          { label: `${intl.formatMessage({ id: 'selfManagement.buy' })}`, value: ACTIVITY_TYPE_13 },
        ],
      }
    case ACTIVITY_TYPE_4:
    case ACTIVITY_TYPE_5:
      return {
        A: [
          { label: `${intl.formatMessage({ id: 'selfManagement.noSales' })}`, value: ACTIVITY_TYPE_1 },
          { label: `${intl.formatMessage({ id: 'selfManagement.straightDownThePromotion' })}`, value: ACTIVITY_TYPE_2 },
          { label: `${intl.formatMessage({ id: 'selfManagement.discountSalesPromotion' })}`, value: ACTIVITY_TYPE_3 },
        ],
        B: [{ label: `${intl.formatMessage({ id: 'selfManagement.giftPromotion' })}`, value: ACTIVITY_TYPE_6 }],
        C: [{ label: `${intl.formatMessage({ id: 'selfManagement.buy' })}`, value: ACTIVITY_TYPE_13 }],
      }
    case ACTIVITY_TYPE_6:
      return {
        A: [
          { label: `${intl.formatMessage({ id: 'selfManagement.noSales' })}`, value: ACTIVITY_TYPE_1 },
          { label: `${intl.formatMessage({ id: 'selfManagement.straightDownThePromotion' })}`, value: ACTIVITY_TYPE_2 },
          { label: `${intl.formatMessage({ id: 'selfManagement.discountSalesPromotion' })}`, value: ACTIVITY_TYPE_3 },
        ],
        B: [
          { label: `${intl.formatMessage({ id: 'selfManagement.fullAmountOfThePromotion' })}`, value: ACTIVITY_TYPE_4 },
          { label: `${intl.formatMessage({ id: 'selfManagement.quotaPromotion' })}`, value: ACTIVITY_TYPE_5 },
        ],
        C: [
          { label: `${intl.formatMessage({ id: 'selfManagement.moreThanAPromotion' })}`, value: ACTIVITY_TYPE_7 },
          { label: `${intl.formatMessage({ id: 'selfManagement.combinationOfPromotion' })}`, value: ACTIVITY_TYPE_8 },
          { label: `${intl.formatMessage({ id: 'selfManagement.buy' })}`, value: ACTIVITY_TYPE_13 },
        ],
      }
    case ACTIVITY_TYPE_7:
    case ACTIVITY_TYPE_8:
      return {
        B: [{ label: `${intl.formatMessage({ id: 'selfManagement.giftPromotion' })}`, value: ACTIVITY_TYPE_6 }],
        C: [{ label: `${intl.formatMessage({ id: 'selfManagement.buy' })}`, value: ACTIVITY_TYPE_13 }],
      }
    case ACTIVITY_TYPE_13:
      return {
        A: [
          { label: `${intl.formatMessage({ id: 'selfManagement.noSales' })}`, value: ACTIVITY_TYPE_1 },
          { label: `${intl.formatMessage({ id: 'selfManagement.straightDownThePromotion' })}`, value: ACTIVITY_TYPE_2 },
          { label: `${intl.formatMessage({ id: 'selfManagement.discountSalesPromotion' })}`, value: ACTIVITY_TYPE_3 },
        ],
        B: [
          { label: `${intl.formatMessage({ id: 'selfManagement.fullAmountOfThePromotion' })}`, value: ACTIVITY_TYPE_4 },
          { label: `${intl.formatMessage({ id: 'selfManagement.quotaPromotion' })}`, value: ACTIVITY_TYPE_5 },
        ],
        C: [
          { label: `${intl.formatMessage({ id: 'selfManagement.giftPromotion' })}`, value: ACTIVITY_TYPE_6 },
          { label: `${intl.formatMessage({ id: 'selfManagement.moreThanAPromotion' })}`, value: ACTIVITY_TYPE_7 },
          { label: `${intl.formatMessage({ id: 'selfManagement.combinationOfPromotion' })}`, value: ACTIVITY_TYPE_8 },
        ],
      }
  }
}
/** 超限规则 - 以作废 */
export const OVERRUNRULETYPE = (int) => {
  switch (Number(int)) {
    case ACTIVITY_TYPE_1:
    case ACTIVITY_TYPE_2:
    case ACTIVITY_TYPE_3:
    case ACTIVITY_TYPE_8:
    case ACTIVITY_TYPE_12:
      return [
        { label: `${intl.formatMessage({ id: 'selfManagement.theOriginalPriceToBuy' })}`, value: 1 },
        { label: `${intl.formatMessage({ id: 'selfManagement.doNotBuy' })}`, value: 2 },
      ]
    case ACTIVITY_TYPE_4:
    case ACTIVITY_TYPE_5:
    case ACTIVITY_TYPE_6:
    case ACTIVITY_TYPE_7:
    case ACTIVITY_TYPE_13:
      return [
        { label: `${intl.formatMessage({ id: 'selfManagement.doNotBuy' })}`, value: 2 },
        {
          label: `${intl.formatMessage({ id: 'selfManagement.accordingIndividualPurchaseHighestDiscount' })}`,
          value: 1,
        },
      ]
  }
}
/** 满量/满额/赠送促销类型 */
export const PROMOTIONTYPE = (int) => {
  switch (Number(int)) {
    case ACTIVITY_TYPE_4:
      return {
        name: 'type',
        tooltip: `${intl.formatMessage({
          id: 'selfManagement.amountReducedRequirementsPurchaseNumberOrdersAmountDiscountAmountAmountAmountMultipliedDiscount',
        })}`,
        label: `${intl.formatMessage({ id: 'selfManagement.fullAmountPromotionalTypes' })}`,
        message: `${intl.formatMessage({ id: 'undefined' })}`,
        radio: [
          { label: `${intl.formatMessage({ id: 'selfManagement.fullAmountMinus' })}`, value: MANLIANG_JIAN },
          { label: `${intl.formatMessage({ id: 'selfManagement.fullAmount' })}`, value: MANLIANG_ZHE },
        ],
      }
    case ACTIVITY_TYPE_5:
      return {
        name: 'type',
        tooltip: `${intl.formatMessage({
          id: 'selfManagement.reducingAmountRequirementsPurchaseAmountDiscountAmountAmountMultipliedDiscount',
        })}`,
        label: `${intl.formatMessage({ id: 'selfManagement.quotaPromotionType' })}`,
        message: `${intl.formatMessage({ id: 'undefined' })}`,
        radio: [
          { label: `${intl.formatMessage({ id: 'selfManagement.quotaReduction' })}`, value: MANE_JIAN },
          { label: `${intl.formatMessage({ id: 'selfManagement.fullFold' })}`, value: MANE_ZHE },
        ],
      }
    case ACTIVITY_TYPE_6:
      return {
        name: 'giveType',
        tooltip: `${intl.formatMessage({
          id: 'selfManagement.purchasesRequirementsOfferingCouponPurchasesGoodsCoupon',
        })}`,
        label: `${intl.formatMessage({ id: 'selfManagement.giftPromotionType' })}`,
        message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectPromotion' })}`,
        radio: [
          { label: `${intl.formatMessage({ id: 'selfManagement.giveFull' })}`, value: MANE_ZENG },
          { label: `${intl.formatMessage({ id: 'selfManagement.buyGoodsGive' })}`, value: BUYPRODUCT_ZENG },
        ],
      }
  }
}
/** 满量/额减 */
export const LADDERBOLIST = (int, type = 1) => {
  switch (Number(int)) {
    case ACTIVITY_TYPE_4:
      return {
        tooltip:
          type === MANLIANG_JIAN
            ? `${intl.formatMessage({ id: 'selfManagement.discountAmountAmountDiscount' })}`
            : `${intl.formatMessage({ id: 'selfManagement.discountDiscountAmountOrderNumbers' })}`,
        label: `${intl.formatMessage({ id: 'selfManagement.FullAmount' })}${
          type === MANLIANG_JIAN
            ? `${intl.formatMessage({ id: 'selfManagement.reductionOf' })}`
            : `${intl.formatMessage({ id: 'selfManagement.fold' })}`
        }`,
        message: `${intl.formatMessage({ id: 'selfManagement.PleaseAddFullAmount' })}${
          type === MANLIANG_JIAN
            ? `${intl.formatMessage({ id: 'selfManagement.reductionOf' })}`
            : `${intl.formatMessage({ id: 'selfManagement.fold' })}`
        }`,
        addon: `${intl.formatMessage({ id: 'selfManagement.theNumberOf' })}`,
        addonAfter:
          type === MANLIANG_JIAN
            ? `${intl.formatMessage({ id: 'selfManagement.reductionOf' })}`
            : `${intl.formatMessage({ id: 'selfManagement.play' })}`,
        addonBefore:
          type === MANLIANG_JIAN
            ? `${intl.formatMessage({ id: 'selfManagement.yuan' })}`
            : `${intl.formatMessage({ id: 'selfManagement.fold' })}`,
      }
    case ACTIVITY_TYPE_5:
      return {
        tooltip:
          type === MANE_JIAN
            ? `${intl.formatMessage({ id: 'selfManagement.discountAmountAmountDiscount' })}`
            : `${intl.formatMessage({ id: 'selfManagement.discountDiscountAmountOrderNumbers' })}`,
        label: `${intl.formatMessage({ id: 'selfManagement.FullAmount2' })}${
          type === MANE_JIAN
            ? `${intl.formatMessage({ id: 'selfManagement.reductionOf' })}`
            : `${intl.formatMessage({ id: 'selfManagement.fold' })}`
        }`,
        message: `${intl.formatMessage({ id: 'selfManagement.PleaseAddFullAmount2' })}${
          type === MANE_JIAN
            ? `${intl.formatMessage({ id: 'selfManagement.reductionOf' })}`
            : `${intl.formatMessage({ id: 'selfManagement.fold' })}`
        }`,
        addon: `${intl.formatMessage({ id: 'selfManagement.yuan' })}`,
        addonAfter:
          type === MANE_JIAN
            ? `${intl.formatMessage({ id: 'selfManagement.reductionOf' })}`
            : `${intl.formatMessage({ id: 'selfManagement.play' })}`,
        addonBefore:
          type === MANE_JIAN
            ? `${intl.formatMessage({ id: 'selfManagement.yuan' })}`
            : `${intl.formatMessage({ id: 'selfManagement.fold' })}`,
      }
    case ACTIVITY_TYPE_7:
      return {
        tooltip: `${intl.formatMessage({ id: 'selfManagement.discountDiscountAmountOrderNumbers' })}`,
        label: `${intl.formatMessage({ id: 'selfManagement.preferentialRules' })}`,
        addon: `${intl.formatMessage({ id: 'selfManagement.a' })}`,
        message: `${intl.formatMessage({ id: 'selfManagement.pleaseAddPreferentialRules' })}`,
        addonAfter: `${intl.formatMessage({ id: 'selfManagement.play' })}`,
        addonBefore: `${intl.formatMessage({ id: 'selfManagement.fold' })}`,
      }
  }
}
