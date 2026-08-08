import { getIntl } from '@linkseeks/i18n'
import { MARKETING_COMPONENTS_NAMES } from '@apps/design-ui'
import icon1 from '@/assets/couponIcons/marketing-1.svg'
import icon2 from '@/assets/couponIcons/marketing-2.svg'
import icon3 from '@/assets/couponIcons/marketing-3.svg'
import icon4 from '@/assets/couponIcons/marketing-4.svg'
import icon5 from '@/assets/couponIcons/marketing-5.svg'
import icon6 from '@/assets/couponIcons/marketing-6.svg'
import icon7 from '@/assets/couponIcons/marketing-7.svg'
import icon8 from '@/assets/couponIcons/marketing-8.svg'
import icon9 from '@/assets/couponIcons/marketing-9.svg'
import icon10 from '@/assets/couponIcons/marketing-10.svg'
import icon11 from '@/assets/couponIcons/marketing-11.svg'
import icon12 from '@/assets/couponIcons/marketing-12.svg'
import icon13 from '@/assets/couponIcons/marketing-13.svg'
import icon14 from '@/assets/couponIcons/marketing-14.svg'
import icon15 from '@/assets/couponIcons/marketing-15.svg'
import icon16 from '@/assets/couponIcons/marketing-16.svg'
import icon17 from '@/assets/couponIcons/marketing-17.svg'
import icon18 from '@/assets/couponIcons/marketing-18.svg'
import icon19 from '@/assets/couponIcons/marketing-19.svg'

const intl = getIntl()

const ICON_CONFIGS = [
  {
    type: 1,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_1' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_1' }),
    icon: icon1,
    key: MARKETING_COMPONENTS_NAMES.SpecialOffer,
  },
  {
    type: 2,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_2' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_2' }),
    icon: icon2,
    key: MARKETING_COMPONENTS_NAMES.Plummet,
  },
  {
    type: 3,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_3' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_3' }),
    icon: icon3,
    key: MARKETING_COMPONENTS_NAMES.FullQuantitySub,
  },
  {
    type: 4,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_4' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_4' }),
    icon: icon4,
    key: MARKETING_COMPONENTS_NAMES.Discount,
  },
  {
    type: 5,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_5' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_4' }),
    icon: icon5,
    key: MARKETING_COMPONENTS_NAMES.FullQuantityDiscount,
  },
  {
    type: 6,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_6' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_3' }),
    icon: icon6,
    key: MARKETING_COMPONENTS_NAMES.FullMoneySub,
  },
  {
    type: 7,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_7' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_4' }),
    icon: icon7,
    key: MARKETING_COMPONENTS_NAMES.FullMoneyDiscount,
  },
  {
    type: 8,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_8' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_8' }),
    icon: icon8,
    key: MARKETING_COMPONENTS_NAMES.GiveProduct,
  },
  {
    type: 9,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_9' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_9' }),
    icon: icon9,
    key: MARKETING_COMPONENTS_NAMES.GiveCoupon,
  },
  {
    type: 10,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_10' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_10' }),
    icon: icon10,
    key: MARKETING_COMPONENTS_NAMES.MorePiece,
  },
  {
    type: 11,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_11' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_11' }),
    icon: icon11,
    key: MARKETING_COMPONENTS_NAMES.Combination,
  },
  {
    type: 12,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_12' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_12' }),
    icon: icon12,
    key: MARKETING_COMPONENTS_NAMES.SecKill,
  },
  {
    type: 13,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_13' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_13' }),
    icon: icon13,
    key: MARKETING_COMPONENTS_NAMES.GroupPurchase,
  },
  {
    type: 14,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_14' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_14' }),
    icon: icon14,
    key: MARKETING_COMPONENTS_NAMES.FullSwap,
  },
  {
    type: 15,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_15' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_15' }),
    icon: icon15,
    key: MARKETING_COMPONENTS_NAMES.BuySwap,
  },
  {
    type: 18,
    title: intl.formatMessage({ id: 'editor.marketing.type_title_18' }),
    explain: intl.formatMessage({ id: 'editor.marketing.type_explain_18' }),
    icon: icon18,
    key: MARKETING_COMPONENTS_NAMES.SetMeal,
  },
]

export default ICON_CONFIGS
