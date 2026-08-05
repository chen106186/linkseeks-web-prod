/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-07 15:23:11
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-13 15:35:58
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import {
  MEMBER_TAX_POINT_1,
  MEMBER_TAX_POINT_2,
  MEMBER_TAX_POINT_3,
  MEMBER_TAX_POINT_4,
  MEMBER_TAX_POINT_5,
  MEMBER_TAX_POINT,
} from '@/constants/member'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
export const schema: ISchema = {
  type: 'object',
  properties: {
    INVESTIGATE_INFO: {
      type: 'object',
      'x-component': 'FlagBox',
      'x-component-props': {
        title: intl.formatMessage({
          id: 'member.management.memberPrComingClassify.drawer.form.classify',
        }),
      },
      properties: {
        MEGA_LAYOUT: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            labelCol: 4,
            wrapperCol: 20,
            labelAlign: 'left',
          },
          properties: {
            code: {
              type: 'string',
              title: intl.formatMessage({
                id: 'supplier.management.supplierPrComingClassify.drawer.form.classify.code',
              }),
              required: true,
              description: '{{MemberCodeDescription}}',
              'x-rules': [
                {
                  pattern: /^[a-zA-Z0-9_-]{1,10}$/,
                  message: intl.formatMessage({
                    id: 'member.management.memberPrComingClassify.drawer.form.classify.code.rules-legal',
                  }),
                },
              ],
            },
            partnerType: {
              type: 'string',
              enum: [],
              title: intl.formatMessage({
                id: 'member.management.memberPrComingClassify.drawer.form.classify.partnerType',
              }),
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.management.memberPrComingClassify.drawer.form.select.placeholder',
                }),
              },
              required: true,
            },
            maxAmount: {
              type: 'string',
              title: intl.formatMessage({
                id: 'member.management.memberPrComingClassify.drawer.form.classify.maxAmount',
              }),
              required: true,
              'x-component-props': {
                addonBefore: intl.formatMessage({ id: 'common.money' }),
              },
              description: '{{MemberCypher}}',
              'x-rules': [
                {
                  pattern: PATTERN_MAPS.money,
                  message: intl.formatMessage({
                    id: 'member.management.memberPrComingClassify.drawer.form.classify.maxAmount.rules-legal',
                  }),
                },
                {
                  max: 8,
                  message: intl.formatMessage({
                    id: 'member.management.memberPrComingClassify.drawer.form.classify.maxAmount.rules-max',
                  }),
                },
              ],
            },
            areaCodes: {
              type: 'array',
              title: intl.formatMessage({
                id: 'member.management.memberPrComingClassify.drawer.form.classify.areaCodes',
              }),
              required: true,
              'x-component': 'CustomAddArray',
              default: [],
              items: {
                type: 'object',
                properties: {
                  provinceCode: {
                    type: 'string',
                    enum: [],
                    'x-component-props': {
                      allowClear: true,
                    },
                  },
                  cityCode: {
                    type: 'string',
                    enum: [],
                    'x-component-props': {
                      allowClear: true,
                    },
                  },
                },
              },
            },
            currencyType: {
              type: 'string',
              title: translate('web.resource.member.bibie'),
              enum: [],
              'x-component-props': {
                placeholder: translate('web.common.qingxuanze'),
              },
              required: true,
            },
            remark: {
              type: 'string',
              title: translate('web.common.remark'),
              'x-component': 'Textarea',
              'x-component-props': {
                placeholder: translate.formatByteLength({ byteNum: 200, chineseNum: 100 }),
                rows: 5,
              },
              'x-rules': [
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 200,
                },
              ],
            },
            categories: {
              type: 'array',
              title: intl.formatMessage({
                id: 'member.management.memberPrComingClassify.drawer.form.classify.categories',
              }),
              required: true,
              'x-component': 'ArrayCards',
              'x-component-props': {
                title: ' ',
                renderMoveDown: () => null,
                renderMoveUp: () => null,
              },
              items: {
                type: 'object',
                'x-mega-props': {
                  labelCol: 5,
                  wrapperCol: 19,
                },
                properties: {
                  category: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'member.management.memberPrComingClassify.drawer.form.classify.category',
                    }),
                    'x-component': 'CascaderFormItem',
                    'x-component-props': {
                      fieldNames: {
                        label: 'title',
                        value: 'id',
                        children: '123',
                      }, // 这里的 '123' 是故意给的，目的是为了只展示一级层级
                      changeOnSelect: true,
                      expandTrigger: 'hover',
                    },
                    required: true,
                  },
                  // CATEGORY_LAYOUT: {
                  //   type: 'object',
                  //   'x-component': 'Mega-Layout',
                  //   'x-component-props': {
                  //     grid: true,
                  //     full: true,
                  //     autoRow: true,
                  //     columns: 3,
                  //     label: '品类',
                  //   },
                  //   properties: {
                  //     aaa: {
                  //       type: 'string',
                  //       'x-component': 'CascaderFormItem',
                  //       'x-component-props': {

                  //       },
                  //     },
                  //     provinceId: {
                  //       type: 'string',
                  //       enum: [],
                  //       'x-component-props': {
                  //         placeholder: '请选择',
                  //       },
                  //       required: true,
                  //     },
                  //     cityId: {
                  //       type: 'string',
                  //       enum: [],
                  //       'x-component-props': {
                  //         placeholder: '请选择',
                  //       },
                  //       required: true,
                  //     },
                  //     areaId: {
                  //       type: 'string',
                  //       enum: [],
                  //       'x-component-props': {
                  //         placeholder: '请选择',
                  //       },
                  //       required: true,
                  //     },
                  //   },
                  // },
                  advanceCharge: {
                    type: 'string',
                    'x-component': 'Radio',
                    enum: [],
                    title: translate('web.resource.member.yufukuang'),
                    'x-rules': [
                      {
                        required: true,
                        message: translate.formatFormSelectTip(translate('web.resource.member.yufukuang')),
                      },
                    ],
                  },
                  settlementDocuments: {
                    type: 'string',
                    title: translate('web.resource.member.jiesuandanju'),
                    enum: [],
                    'x-rules': [
                      {
                        required: true,
                        message: translate.formatFormSelectTip(translate('web.resource.member.jiesuandanju')),
                      },
                    ],
                  },
                  payType: {
                    type: 'string',
                    enum: [],
                    'x-component': 'Radio',
                    title: intl.formatMessage({
                      id: 'member.management.memberPrComingClassify.drawer.form.classify.payType',
                      defaultMessage: '结算方式',
                    }),
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'member.management.memberPrComingClassify.drawer.form.classify.payType.required',
                          defaultMessage: '请选择结算方式',
                        }),
                      },
                    ],
                  },
                  PAYMENT_DAYS_MONTH_WRAP: {
                    type: 'object',
                    'x-component': 'Mega-Layout',
                    'x-component-props': {
                      grid: true,
                      full: true,
                      autoRow: true,
                      columns: 2,
                      label: ' ',
                      labelCol: 8,
                    },
                    properties: {
                      month: {
                        type: 'string',
                        title: '',
                        'x-component-props': {
                          addonAfter: intl.formatMessage({
                            id: 'member.management.memberPrComingClassify.drawer.form.classify.month.addonAfter',
                            defaultMessage: '个月',
                          }),
                        },
                        'x-rules': [
                          {
                            pattern: PATTERN_MAPS.quantity,
                            message: intl.formatMessage({
                              id: 'member.management.memberPrComingClassify.drawer.form.classify.month.legal',
                              defaultMessage: '请输入正整数',
                            }),
                          },
                        ],
                      },
                      monthDay: {
                        type: 'string',
                        title: intl.formatMessage({
                          id: 'member.management.memberPrComingClassify.drawer.form.classify.monthDay',
                          defaultMessage: '结算日',
                        }),
                        'x-component-props': {
                          addonAfter: intl.formatMessage({
                            id: 'member.management.memberPrComingClassify.drawer.form.classify.monthDay.addonAfter',
                            defaultMessage: '号',
                          }),
                        },
                        'x-rules': [
                          {
                            pattern: PATTERN_MAPS.quantity,
                            message: intl.formatMessage({
                              id: 'member.management.memberPrComingClassify.drawer.form.classify.monthDay.legal',
                              defaultMessage: '请输入正整数',
                            }),
                          },
                          {
                            validator(value) {
                              const intVal = +value
                              return intVal > 31 || intVal < 0
                                ? intl.formatMessage({
                                    id: 'member.management.memberPrComingClassify.drawer.form.classify.monthDay.limit',
                                    defaultMessage: '请输入大于0 小于等于 31的数值',
                                  })
                                : ''
                            },
                          },
                        ],
                      },
                    },
                    visible: false,
                  },
                  PAYMENT_DAYS_DAY_WRAP: {
                    type: 'object',
                    'x-component': 'Mega-Layout',
                    'x-component-props': {
                      grid: true,
                      full: true,
                      autoRow: true,
                      columns: 2,
                      label: ' ',
                      labelCol: 8,
                    },
                    properties: {
                      days: {
                        type: 'string',
                        title: '',
                        'x-component-props': {
                          addonAfter: intl.formatMessage({
                            id: 'member.management.memberPrComingClassify.drawer.form.classify.days.addonAfter',
                            defaultMessage: '天',
                          }),
                        },
                        'x-rules': [
                          {
                            pattern: PATTERN_MAPS.quantity,
                            message: intl.formatMessage({
                              id: 'member.management.memberPrComingClassify.drawer.form.classify.days.legal',
                              defaultMessage: '请输入正整数',
                            }),
                          },
                        ],
                      },
                    },
                    visible: false,
                  },
                  MONTHLY_TATEMENT_WRAP: {
                    type: 'object',
                    'x-component': 'Mega-Layout',
                    'x-component-props': {
                      grid: true,
                      full: true,
                      autoRow: true,
                      columns: 2,
                      label: ' ',
                      labelCol: 8,
                    },
                    properties: {
                      monthDay: {
                        type: 'string',
                        title: intl.formatMessage({
                          id: 'member.management.memberPrComingClassify.drawer.form.classify.monthDay',
                          defaultMessage: '结算日',
                        }),
                        'x-component-props': {
                          addonAfter: intl.formatMessage({
                            id: 'member.management.memberPrComingClassify.drawer.form.classify.monthDay.addonAfter',
                            defaultMessage: '号',
                          }),
                        },
                        'x-rules': [
                          {
                            pattern: PATTERN_MAPS.quantity,
                            message: intl.formatMessage({
                              id: 'member.management.memberPrComingClassify.drawer.form.classify.monthDay.legal',
                              defaultMessage: '请输入正整数',
                            }),
                          },
                          {
                            validator(value) {
                              const intVal = +value
                              return intVal > 31 || intVal < 0
                                ? intl.formatMessage({
                                    id: 'member.management.memberPrComingClassify.drawer.form.classify.monthDay.limit',
                                    defaultMessage: '请输入大于0 小于等于 31的数值',
                                  })
                                : ''
                            },
                          },
                        ],
                      },
                    },
                    visible: false,
                  },
                  paymentType: {
                    type: 'string',
                    title: translate('web.resource.member.fukuanfangshi'),
                    enum: [],
                    'x-rules': [
                      {
                        required: true,
                        message: translate.formatFormSelectTip(translate('web.resource.member.fukuanfangshi')),
                      },
                    ],
                  },
                  invoiceType: {
                    type: 'string',
                    enum: [],
                    title: intl.formatMessage({
                      id: 'member.management.memberPrComingClassify.drawer.form.classify.invoiceTypeName',
                    }),
                    required: true,
                  },
                  taxPoint: {
                    type: 'string',
                    title: intl.formatMessage({
                      id: 'member.management.memberPrComingClassify.drawer.form.classify.taxPoint',
                    }),
                    enum: [
                      {
                        label: MEMBER_TAX_POINT[MEMBER_TAX_POINT_1],
                        value: MEMBER_TAX_POINT_1,
                      },
                      {
                        label: MEMBER_TAX_POINT[MEMBER_TAX_POINT_2],
                        value: MEMBER_TAX_POINT_2,
                      },
                      {
                        label: MEMBER_TAX_POINT[MEMBER_TAX_POINT_3],
                        value: MEMBER_TAX_POINT_3,
                      },
                      {
                        label: MEMBER_TAX_POINT[MEMBER_TAX_POINT_4],
                        value: MEMBER_TAX_POINT_4,
                      },
                      {
                        label: MEMBER_TAX_POINT[MEMBER_TAX_POINT_5],
                        value: MEMBER_TAX_POINT_5,
                      },
                    ],
                    required: true,
                  },
                },
              },
            },
          },
        },
      },
    },
    VERIFY_APPLY: {
      type: 'object',
      'x-component': 'FlagBox',
      'x-component-props': {
        title: intl.formatMessage({
          id: 'member.management.memberPrComingClassify.drawer.form.verify',
        }),
      },
      properties: {
        MEGA_LAYOUT: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            labelCol: 4,
            wrapperCol: 18,
            labelAlign: 'left',
          },
          properties: {
            agree: {
              type: 'string',
              title: intl.formatMessage({
                id: 'member.management.memberPrComingClassify.drawer.form.verify.agree',
              }),
              default: 1,
              'x-component': 'Radio',
              required: true,
              enum: [
                {
                  label: intl.formatMessage({
                    id: 'member.management.memberPrComingClassify.drawer.form.verify.agree.pass',
                  }),
                  value: 1,
                },
                {
                  label: intl.formatMessage({
                    id: 'member.management.memberPrComingClassify.drawer.form.verify.agree.noPass',
                  }),
                  value: 0,
                },
              ],
              'x-component-props': {},
            },
            reason: {
              type: 'string',
              title: intl.formatMessage({
                id: 'member.management.memberPrComingClassify.drawer.form.verify.reason',
              }),
              'x-component': 'Textarea',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.management.memberPrComingClassify.drawer.form.verify.placeholder',
                }),
                rows: 5,
              },
              'x-rules': [
                {
                  required: true,
                },
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 120,
                },
              ],
            },
          },
        },
      },
    },
  },
}
