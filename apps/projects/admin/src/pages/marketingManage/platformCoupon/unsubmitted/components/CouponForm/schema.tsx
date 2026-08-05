/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-24 14:05:57
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 20:14:44
 * @Description:
 */
import { ISchema } from '@apps/formily'
import themeConfig from '@apps/config/lingxi.theme.config'
import { PATTERN_MAPS } from '@/constants/regExp'

function range(start, end) {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

const schema: ISchema = {
  type: 'object',
  properties: {
    BASIC_INFO: {
      type: 'object',
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: '基本信息',
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
              title: '优惠券类型',
              type: 'string',
              enum: [],
              required: true,
              'x-component-props': {
                allowClear: false,
              },
            },
            name: {
              title: '优惠券名称',
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
              title: '券面额',
              type: 'string',
              required: true,
              'x-component-props': {
                allowClear: false,
                addonAfter: '元',
              },
              'x-rules': [
                {
                  pattern: PATTERN_MAPS.money,
                  message: '请输入正确格式的券面额',
                },
              ],
            },
            quantity: {
              title: '发券数量',
              type: 'string',
              required: true,
              'x-component-props': {
                allowClear: false,
              },
              'x-rules': [
                {
                  pattern: PATTERN_MAPS.quantity,
                  message: '请输入正整数',
                },
              ],
            },
            '[releaseTimeStart, releaseTimeEnd]': {
              title: '领(发)券时间',
              type: 'string',
              required: true,
              'x-component': 'FormilyRangeTime',
              'x-component-props': {
                placeholder: ['领(发)券起始时间', '领(发)券截止时间'],
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
        title: '优惠券规则',
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
                  title: '领券方式',
                  type: 'string',
                  enum: [],
                  required: true,
                  'x-component-props': {
                    allowClear: false,
                  },
                },
                receiveCondition: {
                  title: '领券条件',
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
                          'x-component-props': {
                            allowClear: false,
                            addonBefore: '每会员ID总共可领取',
                            addonAfter: '张',
                          },
                          'x-rules': [
                            {
                              pattern: PATTERN_MAPS.quantity,
                              message: '请输入正整数',
                            },
                          ],
                        },
                        conditionGetDay: {
                          type: 'string',
                          required: true,
                          'x-component-props': {
                            allowClear: false,
                            addonBefore: '每日可领取',
                            addonAfter: '张',
                          },
                          'x-rules': [
                            {
                              pattern: PATTERN_MAPS.quantity,
                              message: '请输入正整数',
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
                  'x-mega-props': {
                    span: 1,
                  },
                  'x-component-props': {
                    labelCol: 6,
                    labelAlign: 'left',
                  },
                  properties: {
                    useConditionMoney: {
                      title: '使用条件',
                      type: 'string',
                      required: true,
                      'x-mega-props': {
                        wrapperCol: 12,
                        addonBefore: '订单满',
                        addonAfter: '使用',
                      },
                      'x-component-props': {
                        allowClear: false,
                        addonAfter: '元',
                      },
                      'x-rules': [
                        {
                          pattern: PATTERN_MAPS.money,
                          message: '请输入正确格式的使用条件',
                        },
                      ],
                    },
                    useConditionDesc: {
                      title: '使用说明',
                      type: 'string',
                      'x-mega-props': {
                        span: 1,
                      },
                      'x-component': 'TextArea',
                      'x-component-props': {
                        placeholder: '最长1000个字符，500个汉字',
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
                  title: '券有效期',
                  type: 'string',
                  enum: [
                    {
                      label: '固定有效期',
                      value: 1,
                    },
                    {
                      label: '固定天数',
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
                    placeholder: ['券有效期起始时间', '券有效期截止时间'],
                    showTime: true,
                  },
                },
                invalidDay: {
                  title: ' ',
                  type: 'string',
                  visible: false,
                  'x-mega-props': {
                    addonBefore: '自领取后',
                    addonAfter: '后失效',
                  },
                  'x-component-props': {
                    allowClear: false,
                    addonAfter: '天',
                  },
                  'x-rules': [
                    {
                      pattern: PATTERN_MAPS.quantity,
                      message: '请输入正整数',
                    },
                    {
                      validator(value) {
                        return !value ? '请输入券有效期' : ''
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
        title: '适用商城',
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
        title: '适用商品',
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
    APPLICABLE_MEMBER: {
      type: 'object',
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: '适用用户',
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
              title: '适用用户',
              type: 'string',
              enum: [],
              default: [],
              required: true,
              'x-component': 'TofuCheckGroup',
              'x-component-props': {},
            },
            memberTypes: {
              title: '适用会员类型',
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
