import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'
import { createMemberSchema, GroupItem } from '../../../../../utils'

export const initDetailSchema = (props: GroupItem[]) => {
  const intl = getIntl()
  let tabSchema: ISchema = {
    properties: {
      'tab-1': {
        type: 'object',
        'x-component': 'TabPane',
        'x-component-props': {
          tab: intl.formatMessage({ id: 'customerAbility.management.import.query.form.basic' }),
        },
        properties: {
          MEGA_LAYOUT1: {
            type: 'object',
            'x-component': 'Mega-Layout',
            'x-component-props': {
              labelCol: 4,
              wrapperCol: 8,
              labelAlign: 'left',
            },
            properties: {
              memberType: {
                type: 'string',
                title: intl.formatMessage({ id: 'customerAbility.management.import.query.form.basic.memberTypeId' }),
                enum: [],
                'x-component-props': {
                  placeholder: intl.formatMessage({
                    id: 'customerAbility.management.import.query.form.placeholder-select',
                  }),
                  notFoundContent: '{{NotFoundContent}}',
                },
                'x-rules': [
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'customerAbility.management.import.query.form.placeholder-select',
                    }),
                  },
                ],
              },
              roleId: {
                type: 'string',
                title: intl.formatMessage({ id: 'customerAbility.management.import.query.form.basic.roleId' }),
                enum: [],
                'x-component-props': {
                  placeholder: intl.formatMessage({
                    id: 'customerAbility.management.import.query.form.placeholder-select',
                  }),
                },
                'x-rules': [
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'customerAbility.management.import.query.form.placeholder-select',
                    }),
                  },
                ],
                'x-props': {
                  hasFeedback: true,
                  notFoundContent: '{{NotFoundContent}}',
                },
              },
              level: {
                type: 'string',
                title: intl.formatMessage({ id: 'customerAbility.management.import.query.form.basic.level' }),
                enum: [],
                'x-component-props': {
                  placeholder: intl.formatMessage({
                    id: 'customerAbility.management.import.query.form.placeholder-select',
                  }),
                  notFoundContent: '{{NotFoundContent}}',
                },
                'x-props': {
                  hasFeedback: true,
                },
              },
              MEGA_LAYOUT1_1: {
                type: 'object',
                'x-component': 'Mega-Layout',
                'x-component-props': {
                  label: intl.formatMessage({ id: 'customerAbility.management.import.query.form.basic.phone' }),
                  required: true,
                  wrapperCol: 24,
                },
                properties: {
                  MEGA_LAYOUT1_1_1: {
                    type: 'object',
                    'x-component': 'mega-layout',
                    'x-component-props': {
                      grid: true,
                      full: true,
                    },
                    properties: {
                      telCode: {
                        type: 'string',
                        enum: [],
                        'x-mega-props': {
                          span: 1,
                        },
                        'x-component-props': {
                          placeholder: intl.formatMessage({
                            id: 'customerAbility.management.import.query.form.placeholder-select',
                          }),
                          notFoundContent: '{{NotFoundContent}}',
                        },
                        'x-rules': [
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'customerAbility.management.import.query.form.placeholder-select',
                            }),
                          },
                        ],
                      },
                      phone: {
                        type: 'string',
                        'x-mega-props': {
                          span: 2,
                        },
                        'x-component-props': {
                          placeholder: intl.formatMessage({
                            id: 'customerAbility.management.import.query.form.basic.phone.placeholder',
                          }),
                          notFoundContent: '{{NotFoundContent}}',
                        },
                        'x-rules': [
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'customerAbility.management.import.query.form.basic.phone.placeholder',
                            }),
                          },
                        ],
                      },
                    },
                  },
                },
              },
              email: {
                type: 'string',
                title: intl.formatMessage({ id: 'customerAbility.management.import.query.form.basic.email' }),
                'x-component-props': {},
                'x-rules': [
                  {
                    pattern: PATTERN_MAPS.email,
                    message: intl.formatMessage({
                      id: 'customerAbility.management.import.query.form.basic.email.rules-fact',
                    }),
                  },
                ],
              },
              password: {
                type: 'string',
                title: intl.formatMessage({ id: 'supplier.profile.passwrod', defaultMessage: '登录密码' }),
                'x-component': 'PasswordInput',
                'x-rules': [
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'user.qingtianxiedenglumima' }),
                  },
                ],
                'x-component-props': {
                  type: 'password',
                  placeholder: intl.formatMessage({ id: 'user.qingshezhinidedenglumi' }),
                  size: 'middle',
                },
              },
            },
          },
        },
      },
      'tab-2': {
        type: 'object',
        'x-component': 'TabPane',
        'x-component-props': {
          tab: intl.formatMessage({ id: 'customerAbility.management.import.query.form.channel' }),
        },
        properties: {
          MEGA_LAYOUT1: {
            type: 'object',
            'x-component': 'Mega-Layout',
            'x-component-props': {
              labelCol: 4,
              wrapperCol: 12,
              labelAlign: 'left',
              full: true,
            },
            properties: {
              upperRelationId: {
                type: 'string',
                enum: [],
                title: intl.formatMessage({
                  id: 'customerAbility.management.import.query.form.channel.upperRelationId',
                }),
                required: true,
                'x-component-props': {},
              },
              channelLevel: {
                type: 'text',
                title: intl.formatMessage({ id: 'customerAbility.management.import.query.form.channel.channelLevel' }),
              },
              channelTypeId: {
                type: 'string',
                enum: [],
                title: intl.formatMessage({ id: 'customerAbility.management.import.query.form.channel.channelTypeId' }),
                required: true,
                'x-component-props': {},
              },
              areas: {
                type: 'array',
                title: intl.formatMessage({ id: 'customerAbility.management.import.query.form.channel.areas' }),
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
              remark: {
                type: 'string',
                title: intl.formatMessage({ id: 'customerAbility.management.import.query.form.channel.remark' }),
                required: true,
                'x-component': 'TextArea',
                'x-component-props': {
                  rows: 4,
                  placeholder: intl.formatMessage({
                    id: 'customerAbility.management.import.query.form.channel.remark.placeholder',
                  }),
                },
                'x-rules': [
                  {
                    limitByte: true, // 自定义校验规则
                    maxByte: 200,
                  },
                ],
              },
            },
          },
        },
      },
    },
  }

  if (Array.isArray(props)) {
    for (let [index, item] of props.entries()) {
      tabSchema.properties[`tab-${index + 3}`] = {
        type: 'object',
        'x-component': 'TabPane',
        'x-component-props': {
          tab: item.groupName,
        },
        properties: {
          [`MEGA_LAYOUT${index + 2}`]: {
            type: 'object',
            'x-component': 'Mega-Layout',
            'x-component-props': {
              labelCol: 4,
              wrapperCol: 20,
              labelAlign: 'left',
            },
            properties: createMemberSchema(item.elements),
          },
        },
      }
    }
  }

  let detailSchema: ISchema = {
    type: 'object',
    properties: {
      tabs: {
        type: 'object',
        'x-component': 'Tab',
        'x-component-props': {
          type: 'card',
          hiddenKeys: ['tab-2'],
        },
        ...tabSchema,
      },
    },
  }
  const maintianDetailSchema: ISchema = detailSchema
  return maintianDetailSchema
}
