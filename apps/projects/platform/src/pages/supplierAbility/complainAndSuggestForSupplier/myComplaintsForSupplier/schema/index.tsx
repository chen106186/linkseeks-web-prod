import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'
import { dateLocale } from '@/components/NiceForm/utils/locale'

const intl = getIntl()
const translate = getWebIntl()
export const complaintAddSchemaForSupplier: ISchema = {
  type: 'object',
  properties: {
    tabs: {
      type: 'object',
      'x-component': 'tab',
      properties: {
        'tab-1': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.baseInfo' })}`,
          },
          properties: {
            flexLayout: {
              type: 'object',
              'x-component': 'LeftRightLayout',
              'x-component-props': {
                leftProps: {
                  span: 12,
                },
                rightProps: {
                  span: 11,
                },
                wrapProps: {
                  align: 'start',
                  justify: 'space-between',
                },
              },
              properties: {
                layout: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  'x-component-props': {
                    labelCol: 6,
                    full: true,
                    labelAlign: 'left',
                    position: 'left',
                  },
                  properties: {
                    type: {
                      title: `${intl.formatMessage({
                        id: 'member.complaintsAndSuggests.common.columns.index.businessType',
                      })}`,
                      type: 'object',
                      'x-component': 'FormilyCustomizeRadioButton',
                      enum: [
                        {
                          label: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.schema.add.complaint',
                          })}`,
                          value: 1,
                        },
                        {
                          label: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.schema.add.suggest',
                          })}`,
                          value: 2,
                        },
                      ],
                      'x-rules': [
                        {
                          required: true,
                          message: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.schema.add.plzChooseBusinessType',
                          })}`,
                        },
                      ],
                    },
                    classify: {
                      title: `${intl.formatMessage({
                        id: 'member.complaintsAndSuggests.common.columns.index.caseClass',
                      })}`,
                      type: 'string',
                      enum: [
                        {
                          label: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.schema.add.aboutProduct',
                          })}`,
                          value: 1,
                        },
                        {
                          label: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.schema.add.aboutOrder',
                          })}`,
                          value: 2,
                        },
                        {
                          label: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.schema.add.aboutDelivery',
                          })}`,
                          value: 3,
                        },
                        {
                          label: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.schema.add.aboutAfterSale',
                          })}`,
                          value: 4,
                        },
                        {
                          label: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.schema.add.aboutService',
                          })}`,
                          value: 5,
                        },
                        {
                          label: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.schema.add.other',
                          })}`,
                          value: 6,
                        },
                      ],
                      'x-rules': [
                        {
                          required: true,
                          message: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.schema.add.plzChooseCaseClass',
                          })}`,
                        },
                      ],
                    },
                    subject: {
                      title: `${intl.formatMessage({
                        id: 'member.complaintsAndSuggests.common.columns.index.caseTopic',
                      })}`,
                      type: 'string',
                      'x-rules': [
                        {
                          required: true,
                          message: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.schema.add.plzFillCaseTopic',
                          })}`,
                        },
                        {
                          limitByte: true, // 自定义校验规则
                          maxByte: 40,
                        },
                      ],
                      'x-component-props': {
                        placeholder: `${intl.formatMessage({ id: 'detail.purchase.placeholder4' })}`,
                      },
                    },
                    eventDesc: {
                      title: `${intl.formatMessage({
                        id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.caseDesc',
                      })}`,
                      type: 'string',
                      'x-component': 'TextArea',
                      'x-rules': [
                        {
                          required: true,
                          message: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.schema.add.plzFillCaseDesc',
                          })}`,
                        },
                        {
                          limitByte: true, // 自定义校验规则
                          maxByte: 120,
                        },
                      ],
                      'x-component-props': {
                        rows: 1,
                        placeholder: `${intl.formatMessage({
                          id: 'member.complaintsAndSuggests.common.schema.add.noMore120CharOr60ChineseChar',
                        })}`,
                      },
                    },
                    upperName: {
                      title: translate('web.resource.member.guishucaigoushangmingcheng'),
                      type: 'string',
                      'x-component-props': {
                        disabled: true,
                        addonAfter: '{{connectMember}}',
                      },
                      'x-rules': [
                        {
                          required: true,
                          message: translate('web.resource.member.qingxuanzeguishucaigoushang'),
                        },
                      ],
                    },
                    byUserEditName: {
                      type: 'string',
                      title: `${intl.formatMessage({
                        id: 'member.complaintsAndSuggests.common.columns.index.proposer',
                      })}`,
                      'x-component-props': {
                        addonAfter: '{{connectUser}}',
                      },
                      'x-rules': [
                        {
                          required: true,
                          message: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.schema.add.plzFillProposer',
                          })}`,
                        },
                      ],
                    },
                    byUserEditPhone: {
                      type: 'string',
                      title: `${intl.formatMessage({
                        id: 'member.complaintsAndSuggests.common.columns.index.proposePhone',
                      })}`,
                      'x-component-props': {},
                    },
                    memberId: {
                      title: `${intl.formatMessage({
                        id: 'member.complaintsAndSuggests.common.schema.add.subMemberId',
                      })}`,
                      type: 'string',
                      display: false,
                    },
                    roleId: {
                      title: `${intl.formatMessage({
                        id: 'member.complaintsAndSuggests.common.schema.add.subMemberRoleId',
                      })}`,
                      type: 'string',
                      display: false,
                    },
                    byUserId: {
                      title: `${intl.formatMessage({
                        id: 'member.complaintsAndSuggests.common.schema.add.ProposerId',
                      })}`,
                      type: 'string',
                      display: false,
                    },
                    // phoneData: {
                    //   type: 'string',
                    //   title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.proposePhone'})}`,
                    //   'x-component': 'FormilyCountryPhone',
                    //   enum: [
                    //     {
                    //       label: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.schema.add.china'})}`,
                    //       value: '+86'
                    //     }
                    //   ]
                    // },
                  },
                },
                rightLayout: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  'x-component-props': {
                    labelCol: 6,
                    labelAlign: 'left',
                    position: 'right',
                    full: true,
                  },
                  properties: {
                    eventSuggest: {
                      title: `${intl.formatMessage({
                        id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.caseSuggest',
                      })}`,
                      type: 'textarea',
                      'x-component-props': {
                        rows: 1,
                        style: {
                          width: '100%',
                        },
                        placeholder: `${intl.formatMessage({
                          id: 'member.complaintsAndSuggests.common.schema.add.noMore120CharOr60ChineseChar',
                        })}`,
                      },
                      'x-rules': [
                        {
                          limitByte: true, // 自定义校验规则
                          maxByte: 120,
                        },
                      ],
                    },
                    eventTime: {
                      title: `${intl.formatMessage({
                        id: 'member.complaintsAndSuggests.common.columns.index.caseTime',
                      })}`,
                      type: 'date',
                      'x-component-props': {
                        placeholder: `${intl.formatMessage({
                          id: 'member.complaintsAndSuggests.common.columns.index.caseTime',
                        })}`,
                        format: 'YYYY-MM-DD HH:mm:ss',
                        locale: dateLocale(),
                      },
                      'x-rules': [
                        {
                          required: true,
                          message: `${intl.formatMessage({
                            id: 'member.complaintsAndSuggests.common.columns.index.caseTime',
                          })}`,
                        },
                      ],
                    },
                    attachments: {
                      title: `${intl.formatMessage({
                        id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.caseAppendix',
                      })}`,
                      type: 'object',
                      'x-component': 'FormilyUploadFiles',
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
}
