/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-24 14:05:57
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 20:16:53
 * @Description:
 */
import { ISchema } from '@apps/formily'
import moment from 'moment'
import themeConfig from '@apps/config/lingxi.theme.config'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const schema: ISchema = {
  type: 'object',
  properties: {
    BASIC_INFO: {
      type: 'object',
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: `${intl.formatMessage({ id: 'merchantCoupon.baseInfo' })}`,
        id: 'basicInfo',
        style: {
          marginBottom: themeConfig['@margin-md'],
        },
      },
      properties: {
        MEGA_LADYOUT_1: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
            full: true,
            columns: 2,
            autoRow: true,
            labelCol: 6,
            labelAlign: 'left',
          },
          properties: {
            type: {
              title: `${intl.formatMessage({ id: 'merchantCoupon.couponTypeName' })}`,
              type: 'string',
              enum: [],
              required: true,
              'x-component-props': {
                allowClear: false,
              },
            },
            name: {
              title: `${intl.formatMessage({ id: 'merchantCoupon.coupanName' })}`,
              type: 'string',
              required: true,
              'x-component-props': {
                allowClear: false,
              },
              'x-rules': [
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 60,
                },
              ],
            },
            denomination: {
              title: `${intl.formatMessage({ id: 'merchantCoupon.moneySize' })}`,
              type: 'string',
              required: true,
              'x-component-props': {
                allowClear: false,
                addonAfter: `${intl.formatMessage({ id: 'merchantCoupon.yuan' })}`,
              },
              'x-rules': [
                {
                  pattern: PATTERN_MAPS.money,
                  message: `${intl.formatMessage({ id: 'merchantCoupon.Pleaseenterthecorrectformatofthecoupon' })}`,
                },
              ],
            },
            quantity: {
              title: `${intl.formatMessage({ id: 'merchantCoupon.couponAmount' })}`,
              type: 'string',
              required: true,
              'x-component-props': {
                allowClear: false,
              },
              'x-rules': [
                {
                  pattern: PATTERN_MAPS.quantity,
                  message: `${intl.formatMessage({ id: 'merchantCoupon.Pleaseentertheinteger' })}`,
                },
                {
                  max: 9,
                },
              ],
            },
            '[releaseTimeStart, releaseTimeEnd]': {
              title: intl.formatMessage({ id: 'merchantCoupon.giveCouponTime' }),
              type: 'string',
              required: true,
              'x-component': 'FormilyRangeTime',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'merchantCoupon.giveCouponStartTime' }),
                  intl.formatMessage({ id: 'merchantCoupon.giveCouponEndTime' }),
                ],
                showTime: true,
              },
            },
          },
        },
      },
    },
    COUPON_RULES: {
      type: 'object',
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: intl.formatMessage({ id: 'merchantCoupon.couponRules' }),
        id: 'couponRules',
        style: {
          marginBottom: themeConfig['@margin-md'],
        },
      },
      properties: {
        COLUMN_LAYOUT: {
          'x-component': 'ColumnLayout',
          'x-component-props': {
            column: 2,
          },
          properties: {
            MEGA_LADYOUT_1: {
              type: 'object',
              'x-component': 'Mega-Layout',
              'x-component-props': {
                labelCol: 6,
                labelAlign: 'left',
              },
              properties: {
                getWay: {
                  title: intl.formatMessage({ id: 'merchantCoupon.getCouponsWay' }),
                  type: 'string',
                  enum: [],
                  required: true,
                  'x-component-props': {
                    allowClear: false,
                  },
                },
                receiveCondition: {
                  title: `${intl.formatMessage({ id: 'merchantCoupon.Couponcondition' })}`,
                  type: 'object',
                  required: true,
                  visible: false,
                  properties: {
                    MEGA_LADYOUT_1_1: {
                      'x-component': 'Mega-Layout',
                      'x-component-props': {
                        grid: true,
                        full: true,
                        columns: 1,
                        autoRow: true,
                      },
                      properties: {
                        conditionGetTotal: {
                          type: 'string',
                          required: true,
                          'x-mega-props': {
                            addonBefore: `${intl.formatMessage({
                              id: 'marketingAbility.meihuiyuanIDzonggongkelingqu',
                            })}`,
                          },
                          'x-component-props': {
                            allowClear: false,
                            addonAfter: `${intl.formatMessage({ id: 'merchantCoupon.zhang' })}`,
                          },
                          'x-rules': [
                            {
                              pattern: PATTERN_MAPS.quantity,
                              message: `${intl.formatMessage({ id: 'merchantCoupon.Pleaseentertheinteger' })}`,
                            },
                          ],
                        },
                        conditionGetDay: {
                          type: 'string',
                          required: true,
                          'x-mega-props': {
                            addonBefore: `${intl.formatMessage({ id: 'merchantCoupon.Canreceivedaily' })}`,
                          },
                          'x-component-props': {
                            allowClear: false,
                            addonAfter: `${intl.formatMessage({ id: 'merchantCoupon.zhang' })}`,
                          },
                          'x-rules': [
                            {
                              pattern: PATTERN_MAPS.quantity,
                              message: `${intl.formatMessage({ id: 'merchantCoupon.Pleaseentertheinteger' })}`,
                            },
                          ],
                        },
                      },
                    },
                  },
                },
                MEGA_LADYOUT_1_2: {
                  type: 'object',
                  'x-component': 'Mega-Layout',
                  'x-component-props': {
                    labelCol: 6,
                    labelAlign: 'left',
                  },
                  properties: {
                    useConditionMoney: {
                      title: `${intl.formatMessage({ id: 'merchantCoupon.useCondition' })}`,
                      type: 'string',
                      required: true,
                      'x-mega-props': {
                        wrapperCol: 12,
                        addonBefore: `${intl.formatMessage({ id: 'merchantCoupon.OrderFull' })}`,
                        addonAfter: `${intl.formatMessage({ id: 'merchantCoupon.use' })}`,
                      },
                      'x-component-props': {
                        allowClear: false,
                        addonAfter: `${intl.formatMessage({ id: 'merchantCoupon.yuan' })}`,
                      },
                      'x-rules': [
                        {
                          pattern: PATTERN_MAPS.money,
                          message: `${intl.formatMessage({
                            id: 'merchantCoupon.Pleaseentertheconditionoftheproperformat',
                          })}`,
                        },
                      ],
                    },
                    useConditionDesc: {
                      title: intl.formatMessage({ id: 'merchantCoupon.instructions' }),
                      type: 'string',
                      'x-mega-props': {
                        span: 1,
                      },
                      'x-component': 'TextArea',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'merchantCoupon.inputBetween500and1000' }),
                        rows: 4,
                      },
                      'x-rules': [
                        {
                          limitByte: true, // 自定义校验规则
                          maxByte: 1000,
                        },
                      ],
                    },
                  },
                },
              },
            },
            MEGA_LADYOUT_2: {
              type: 'object',
              'x-component': 'Mega-Layout',
              'x-component-props': {
                labelCol: 6,
                wrapperCol: 18,
                labelAlign: 'left',
                full: true,
              },
              properties: {
                effectiveType: {
                  title: `${intl.formatMessage({ id: 'merchantCoupon.Vouchervalidity' })}`,
                  type: 'string',
                  enum: [
                    {
                      label: `${intl.formatMessage({ id: 'merchantCoupon.Fixedvalidityperiod' })}`,
                      value: 1,
                    },
                    {
                      label: `${intl.formatMessage({ id: 'merchantCoupon.Fixeddays' })}`,
                      value: 2,
                    },
                  ],
                  required: true,
                  'x-component': 'RadioGroup',
                  'x-component-props': {
                    optionType: 'button',
                  },
                },
                '[effectiveTimeStart, effectiveTimeEnd]': {
                  title: ' ',
                  type: 'string',
                  'x-component': 'FormilyRangeTime',
                  'x-component-props': {
                    placeholder: [
                      `${intl.formatMessage({ id: 'merchantCoupon.effectiveTimeEnd' })}`,
                      `${intl.formatMessage({ id: 'merchantCoupon.effectiveTimeEnd' })}`,
                    ],
                    showTime: true,
                  },
                },
                invalidDay: {
                  title: ' ',
                  type: 'string',
                  visible: false,
                  // todo 在visible：false 情况中还显示bug
                  // 'x-mega-props': {
                  //   addonBefore: `${intl.formatMessage({ id: 'merchantCoupon.Afterreceiving' })}`,
                  //   addonAfter: `${intl.formatMessage({ id: 'merchantCoupon.PostFailure' })}`,
                  // },
                  'x-component-props': {
                    allowClear: false,
                    addonAfter: `${intl.formatMessage({ id: 'merchantCoupon.day' })}`,
                  },
                  'x-rules': [
                    {
                      pattern: PATTERN_MAPS.quantity,
                      message: `${intl.formatMessage({ id: 'merchantCoupon.Pleaseentertheinteger' })}`,
                    },
                    {
                      validator(value) {
                        return !value
                          ? `${intl.formatMessage({ id: 'merchantCoupon.Pleaseenterthevalidityperiod' })}`
                          : ''
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    APPLICABLE_SHOP_LISE: {
      type: 'object',
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: `${intl.formatMessage({ id: 'merchantCoupon.suitMall' })}`,
        id: 'applicableShopList',
        style: {
          marginBottom: themeConfig['@margin-md'],
        },
      },
      properties: {
        MEGA_LADYOUT_1: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            labelCol: 3,
            labelAlign: 'left',
          },
          properties: {
            suitableMallTypes: {
              type: 'string',
              enum: [],
              required: true,
              'x-component': 'ApplicableList',
              'x-component-props': {},
            },
          },
        },
      },
    },
    APPLICABLE_GOODS: {
      type: 'object',
      visible: false,
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: `${intl.formatMessage({ id: 'merchantCoupon.suitCommodity' })}`,
        id: 'applicableGoods',
        style: {
          marginBottom: themeConfig['@margin-md'],
        },
      },
      properties: {
        goodsList: {
          type: 'array',
          'x-component': 'ApplicableGoodsFormItem',
          'x-component-props': {},
          required: true,
        },
      },
    },
    APPLICABLE_CATEGORIES: {
      type: 'object',
      visible: false,
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: `${intl.formatMessage({ id: 'merchantCoupon.suitVariable' })}`,
        id: 'applicableCategories',
        style: {
          marginBottom: themeConfig['@margin-md'],
        },
      },
      properties: {
        MEGA_LADYOUT_1: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {},
          properties: {
            applicableCategories: {
              type: 'array',
              required: true,
              'x-component': 'CategoriesList',
              'x-component-props': {},
              items: {
                type: 'object',
                properties: {
                  MEGA_LADYOUT_1_1: {
                    type: 'object',
                    'x-component': 'Mega-Layout',
                    'x-component-props': {},
                    properties: {
                      category: {
                        type: 'string',
                        enum: [],
                        required: true,
                        'x-component': 'CascaderFormItem',
                        'x-component-props': {
                          fieldNames: { label: 'name', value: 'id', children: 'children' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    APPLICABLE_BRANDS: {
      type: 'object',
      visible: false,
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: `${intl.formatMessage({ id: 'merchantCoupon.suitBrand' })}`,
        id: 'applicableBrands',
        style: {
          marginBottom: themeConfig['@margin-md'],
        },
      },
      properties: {
        MEGA_LADYOUT_1: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {},
          properties: {
            applicableBrands: {
              type: 'array',
              required: true,
              'x-component': 'CategoriesList',
              'x-component-props': {},
              items: {
                type: 'object',
                properties: {
                  brand: {
                    type: 'string',
                    enum: [],
                    required: true,
                    'x-component-props': {
                      allowClear: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    APPLICABLE_MEMBER: {
      type: 'object',
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: `${intl.formatMessage({ id: 'merchantCoupon.suitUsers' })}`,
        id: 'applicableMember',
        style: {
          marginBottom: themeConfig['@margin-md'],
        },
      },
      properties: {
        MEGA_LADYOUT_1: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            labelCol: 3,
            labelAlign: 'left',
          },
          properties: {
            suitableMemberTypes: {
              title: `${intl.formatMessage({ id: 'merchantCoupon.suitUsers' })}`,
              type: 'string',
              enum: [],
              default: [],
              required: true,
              'x-component': 'TofuCheckGroup',
              'x-component-props': {},
            },
            applicationMemberLevel: {
              type: 'string',
              required: true,
              'x-component': 'MemberCheckboxGroup',
              'x-component-props': {
                showMoreAction: true,
              },
            },
          },
        },
      },
    },
  },
}

export default schema
