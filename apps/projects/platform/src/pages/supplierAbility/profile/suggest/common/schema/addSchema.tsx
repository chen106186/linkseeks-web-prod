import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'

const intl = getIntl()

export const complaintAddSchema: ISchema = {
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
            layout: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                full: true,
                wrapperCol: 10,
                labelAlign: 'left',
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
                      label: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.schema.add.suggest' })}`,
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
                  title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.caseClass' })}`,
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
                      label: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.schema.add.other' })}`,
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
                  title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.caseTopic' })}`,
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
                    placeholder: `${intl.formatMessage({
                      id: 'member.memberEvaluate.schema.add.max40CharOr20ChineseChar',
                    })}`,
                  },
                },
                memberName: {
                  title: `${intl.formatMessage({
                    id: 'supplier.supplierEvaluate.hooks.useGetDetailCommon.uppersupplierName',
                  })}`,
                  type: 'string',
                  'x-component-props': {
                    disabled: true,
                    addonAfter: '{{connectMember}}',
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'supplier.supplierEvaluate.schema.add.plzChoosesupplier',
                      })}`,
                    },
                  ],
                },
                memberId: {
                  title: `${intl.formatMessage({ id: 'member.memberQuery.suggest.common.schema.supMemberId' })}`,
                  type: 'string',
                  display: false,
                },
                roleId: {
                  title: `${intl.formatMessage({ id: 'member.memberQuery.suggest.common.schema.supMemberRoleId' })}`,
                  type: 'string',
                  display: false,
                },
                eventTime: {
                  title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.caseTime' })}`,
                  type: 'date',
                  'x-component-props': {
                    format: 'YYYY-MM-DD HH:mm:ss',
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'member.memberQuery.suggest.common.schema.eventTime.required',
                        defaultMessage: '请填写事件时间',
                      })}`,
                    },
                  ],
                },
                byUserEditName: {
                  type: 'string',
                  title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.proposer' })}`,
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
                byUserId: {
                  title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.schema.add.ProposerId' })}`,
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
                byUserEditPhone: {
                  type: 'string',
                  title: `${intl.formatMessage({
                    id: 'member.complaintsAndSuggests.common.columns.index.proposePhone',
                  })}`,
                  'x-component-props': {},
                },
                eventSuggest: {
                  title: `${intl.formatMessage({
                    id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.caseSuggest',
                  })}`,
                  type: 'textarea',
                  'x-component-props': {
                    style: {
                      width: '100%',
                    },
                    placeholder: intl.formatMessage({
                      id: 'member.complaintsAndSuggests.common.schema.add.noMore120CharOr60ChineseChar',
                    }),
                  },
                  'x-rules': [
                    {
                      limitByte: true, // 自定义校验规则
                      maxByte: 120,
                    },
                  ],
                },
                eventDesc: {
                  title: `${intl.formatMessage({
                    id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.caseDesc',
                  })}`,
                  type: 'textarea',
                  'x-component-props': {
                    placeholder: intl.formatMessage({
                      id: 'member.complaintsAndSuggests.common.schema.add.noMore120CharOr60ChineseChar',
                    }),
                  },
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
}
