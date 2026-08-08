import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { UPLOAD_TYPE } from '@/constants'
import { PATTERN_MAPS } from '@/constants/regExp'
import { createMemberSchema, GroupItem } from '../../../../utils'

export const initDetailSchema = (props: GroupItem[]) => {
  let tabSchema: ISchema = {
    properties: {
      'tab-1': {
        type: 'object',
        'x-component': 'TabPane',
        'x-component-props': {
          tab: '基本信息',
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
                required: true,
                title: '会员类型',
                enum: [],
                'x-component-props': {
                  placeholder: '请选择',
                },
              },
              roleId: {
                type: 'string',
                required: true,
                title: '会员角色',
                enum: [],
                'x-component-props': {
                  placeholder: '请选择',
                },
                'x-props': {
                  hasFeedback: true,
                },
              },
              level: {
                type: 'string',
                title: '会员等级',
                enum: [],
                'x-component-props': {
                  placeholder: '请选择',
                  allowClear: true,
                },
                'x-props': {
                  hasFeedback: true,
                },
              },
              MEGA_LAYOUT1_1: {
                type: 'object',
                'x-component': 'Mega-Layout',
                'x-component-props': {
                  label: '注册手机',
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
                        'x-component-props': {
                          placeholder: '请选择',
                        },
                        required: true,
                      },
                      phone: {
                        type: 'string',
                        'x-mega-props': {
                          span: 2,
                        },
                        'x-component-props': {
                          placeholder: '请输入你的手机号码',
                        },
                        'x-rules': [
                          {
                            required: true,
                            message: '请输入你的手机号码',
                          },
                        ],
                      },
                    },
                  },
                },
              },
              email: {
                type: 'string',
                title: '邮箱',
                'x-component-props': {},
                'x-rules': [
                  {
                    pattern: PATTERN_MAPS.email,
                    message: '请输入正确格式的邮箱',
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
      tabSchema.properties![`tab-${index + 2}`] = {
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
        },
        ...tabSchema,
      },
    },
  }
  const maintianDetailSchema: ISchema = detailSchema
  return maintianDetailSchema
}
