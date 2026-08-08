/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-07 15:23:11
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-13 15:35:58
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { PATTERN_MAPS } from '@/constants/regExp'
import {
  MEMBER_TAX_POINT,
  MEMBER_TAX_POINT_1,
  MEMBER_TAX_POINT_2,
  MEMBER_TAX_POINT_3,
  MEMBER_TAX_POINT_4,
  MEMBER_TAX_POINT_5,
} from '@/constants/member'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()

const TAX_POINT_OPTIONS = [
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
]

const translate = getWebIntl()
/**
 * 获取 schema
 * @param editable 是否可编辑的
 * @returns
 */
export const schema = (editable: boolean): ISchema => {
  return {
    type: 'object',
    properties: {
      MEGA_LAYOUT: {
        type: 'object',
        'x-component': 'Mega-Layout',
        'x-component-props': {
          grid: true,
          full: true,
          autoRow: true,
          columns: 2,
          labelWidth: 144,
          labelAlign: 'left',
        },
        properties: {
          code: {
            type: 'string',
            title: intl.formatMessage({ id: 'member.management.memberPrComingClassify.drawer.form.classify.code' }),
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
          currencyType: {
            type: 'string',
            title: translate('web.resource.member.bibie'),
            enum: [],
            'x-component-props': {
              placeholder: translate('web.common.qingxuanze'),
            },
            required: true,
          },
          ...(editable
            ? {
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
              }
            : {
                partnerTypeName: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'member.management.memberPrComingClassify.drawer.form.classify.partnerType',
                  }),
                  editable: false,
                },
              }),
          ...(editable
            ? {
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
                      MEGA_LAYOUT_AREA: {
                        type: 'object',
                        'x-component': 'Mega-Layout',
                        'x-props': {
                          width: '100%',
                        },
                        'x-component-props': {
                          grid: true,
                          full: true,
                          autoRow: true,
                          columns: 2,
                        },
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
                  },
                },
              }
            : {
                classifyAreas: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'member.management.memberPrComingClassify.drawer.form.classify.areaCodes',
                  }),
                  editable: false,
                },
              }),
          remark: {
            type: 'string',
            title: translate('web.common.remark'),
            'x-component': 'Textarea',
            'x-component-props': {
              placeholder: translate.formatByteLength({ byteNum: 200, chineseNum: 100 }),
              rows: 1,
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
            'x-mega-props': {
              span: 2,
              labelAlign: 'top',
            },
            'x-component': 'ArrayTable',
            'x-component-props': {
              renderMoveDown: () => null,
              renderMoveUp: () => null,
              renderAddition: '{{renderAddition}}',
              renderRemove: '{{renderRemove}}',
              operationsWidth: '128px',
              scroll: {
                x: 1200,
              },
            },
            items: {
              type: 'object',
              properties: {
                index: {
                  type: 'string',
                  title: translate('web.common.sortIndex'),
                  editable: false,
                  'x-component': 'IndexField',
                  'x-component-props': {
                    style: {
                      width: 64,
                    },
                  },
                },
                advanceCharge: {
                  type: 'string',
                  'x-component': 'string',
                  enum: [],
                  title: translate('web.resource.member.yufukuang'),
                  'x-rules': [
                    {
                      required: true,
                      message: translate.formatFormSelectTip(translate('web.resource.member.yufukuang')),
                    },
                  ],
                  'x-component-props': {
                    style: {
                      width: 114,
                    },
                  },
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
                  'x-component-props': {
                    style: {
                      width: 144,
                    },
                  },
                },
                payType: {
                  type: 'string',
                  enum: [],
                  'x-component': 'PayTypeFiled',
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
                  'x-component-props': {
                    contentStyle: {
                      width: 272,
                    },
                  },
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
                  'x-component-props': {
                    style: {
                      width: 176,
                    },
                  },
                },
                invoiceType: {
                  type: 'string',
                  enum: [],
                  title: intl.formatMessage({
                    id: 'member.management.memberPrComingClassify.drawer.form.classify.invoiceTypeName',
                  }),
                  required: true,
                  'x-component-props': {
                    style: {
                      width: 176,
                    },
                  },
                },
                taxPoint: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'member.management.memberPrComingClassify.drawer.form.classify.taxPoint',
                  }),
                  required: true,
                  enum: editable ? TAX_POINT_OPTIONS : undefined,
                  'x-component-props': {
                    style: {
                      width: 112,
                    },
                    addonAfter: editable ? '' : '%',
                  },
                },
                details: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'member.management.memberPrComingClassify.drawer.form.classify.category',
                  }),
                  'x-component': 'TreeSelectField',
                  'x-component-props': {
                    fieldNames: { label: 'title', value: 'id' },
                    style: {
                      width: 290,
                    },
                  },
                  required: true,
                },
              },
            },
          },
        },
      },
    },
  }
}
