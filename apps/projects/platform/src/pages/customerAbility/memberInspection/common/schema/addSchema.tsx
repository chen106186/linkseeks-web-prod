import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import React from 'react'
import { getWebIntl } from '@apps/locales'
import { dateLocale } from '@/components/NiceForm/utils/locale'

const intl = getIntl()
const translate = getWebIntl()
export const InspectionAddSchema: ISchema = {
  type: 'object',
  properties: {
    tabs: {
      type: 'object',
      'x-component': 'tab',
      // "x-component-props": {
      //   "defaultActiveKey": "tab-2"
      // },
      properties: {
        'tab-1': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.baseInfo' })}`,
          },
          properties: {
            layout: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 10,
                labelAlign: 'left',
              },
              properties: {
                subject: {
                  title: `${intl.formatMessage({
                    id: 'member.memberInspection.common.columns.index.investigateTopic',
                  })}`,
                  type: 'string',
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'member.memberInspection.common.schema.add.plzFillTopic',
                      })}`,
                    },
                    {
                      limitByte: true, // 自定义校验规则
                      maxByte: 40,
                    },
                  ],
                  'x-component-props': {
                    placeholder: `${intl.formatMessage({
                      id: 'member.memberEvaluate.schema.add.max40CharOr20ChineseChar',
                    })}`,
                  },
                },
                name: {
                  title: translate('web.resource.member.memberName'),
                  type: 'string',
                  'x-component-props': {
                    disabled: true,
                    addonAfter: '{{connectMember}}',
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'supplier.supplierInspection.common.schema.add.plzChoosesupplier',
                      })}`,
                    },
                  ],
                },
                subMemberId: {
                  title: `${intl.formatMessage({ id: 'supplier.management.import.query.supplierId' })}`,
                  type: 'string',
                  display: false,
                },
                subRoleId: {
                  title: `${intl.formatMessage({ id: 'supplier.supplierInspection.common.schema.add.subRoleId' })}`,
                  type: 'string',
                  display: false,
                },
                inspectType: {
                  type: 'string',
                  title: `${intl.formatMessage({
                    id: 'member.memberInspection.common.columns.index.investigateType',
                  })}`,
                  enum: [],
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'member.memberInspection.common.schema.add.plzChooseType',
                      })}`,
                    },
                  ],
                },
                inspectDay: {
                  type: 'date',
                  title: `${intl.formatMessage({
                    id: 'member.memberInspection.common.columns.index.investigateDate',
                  })}`,
                  'x-component-props': {
                    style: {
                      width: '100%',
                    },
                    locale: dateLocale(),
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'member.memberInspection.common.schema.add.plzChooseDate',
                      })}`,
                    },
                  ],
                },
                userName: {
                  title: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.represent' })}`,
                  type: 'string',
                  'x-component-props': {
                    // disabled: true,
                    addonAfter: '{{connectUser}}',
                  },
                },
                userId: {
                  title: `${intl.formatMessage({ id: 'supplier.management.import.query.supplierId' })}`,
                  type: 'string',
                  display: false,
                },
                reason: {
                  title: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.reason' })}`,
                  type: 'textarea',
                  'x-component-props': {
                    placeholder: `${intl.formatMessage({
                      id: 'member.memberInspection.common.schema.add.reason.placeholder',
                      defaultMessage: '在此输入你的内容，最长120个字符，60个汉字',
                    })}`,
                  },
                  'x-rules': [
                    {
                      limitByte: true, // 自定义校验规则
                      maxByte: 120,
                    },
                  ],
                },
                attachments: {
                  title: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.appendix' })}`,
                  type: 'object',
                  'x-component': 'FormilyUploadFiles',
                },
              },
            },
          },
        },
        'tab-2': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.detail' })}`,
          },
          properties: {
            layout: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 10,
                labelAlign: 'left',
              },
              properties: {
                score: {
                  type: 'string',
                  title: `${intl.formatMessage({
                    id: 'member.memberInspection.common.columns.index.investigateScore',
                  })}`,
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'member.memberInspection.common.schema.add.plzInputScore',
                      })}`,
                    },
                    {
                      pattern: /^((\d|[1-9]\d)(\.\d{1,2})?|100)$/,
                      message: `${intl.formatMessage({
                        id: 'member.memberInspection.common.schema.add.plzFillNumberNoMore100Len',
                      })}`,
                    },
                  ],
                },
                result: {
                  type: 'textarea',
                  title: `${intl.formatMessage({
                    id: 'member.memberInspection.common.columns.index.investigateResult',
                  })}`,
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'member.memberInspection.common.schema.add.plzInputResult',
                      })}`,
                    },
                    {
                      limitByte: true, // 自定义校验规则
                      maxByte: 60,
                    },
                  ],
                  'x-component-props': {
                    placeholder: `${intl.formatMessage({ id: 'detail.purchase.placeholder4' })}`,
                  },
                },
                reports: {
                  title: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.report' })}`,
                  type: 'array',
                  required: true,
                  'x-component': 'FormilyUploadFiles',
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'member.memberInspection.common.schema.add.plzUploadFile',
                      })}`,
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
}

export const memberSchema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        rowStyle: {
          justifyContent: 'flex-start',
        },
      },
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: `${intl.formatMessage({
              id: 'supplier.supplierInspection.common.schema.add.searchsupplierName',
            })}`,
            tip: translate('web.resource.member.tip_kehumingchen'),
            advanced: false,
          },
        },
      },
    },
  },
}

/**
 * 选择用户
 */
export const userSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: `${intl.formatMessage({ id: 'supplier.supplierInspection.common.schema.add.searchName' })}`,
            align: 'flex-left',
            tip: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.searchForName' })}`,
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            // full: true,
            inline: true,
            // autoRow: true,
            // columns: 3,
          },
          properties: {
            orgName: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'member.memberInspection.common.columns.userColumns.agency',
                })}`,
                allowClear: true,
              },
            },
            jobTitle: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.post' })}`,
                allowClear: true,
              },
            },

            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.query' })}`,
              },
            },
          },
        },
      },
    },
  },
}
