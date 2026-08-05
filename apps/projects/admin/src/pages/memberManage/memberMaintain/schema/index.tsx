import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { UPLOAD_TYPE } from '@/constants'
import { PATTERN_MAPS } from '@/constants/regExp'

export const importSchema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'Children',
              'x-component-props': {
                children: '{{controllerBtns}}',
              },
            },
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: '搜索',
                tip: '输入 会员名称 进行搜索',
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            memberType: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '会员类型(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            roleId: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '会员角色(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            level: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '会员等级(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            source: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '申请来源(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            innerStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '内部状态(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            outerStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '外部状态(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            status: {
              type: 'string',
              enum: [],
              default: undefined,
              'x-component-props': {
                placeholder: '会员状态(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            '[startDate, endDate]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '时间范围(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: '查询',
              },
            },
          },
        },
      },
    },
  },
}

export const auditModalSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        reason: {
          type: 'string',
          title: '会员解冻原因',
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: '在此输入你的内容，最长120个字符，60个汉字',
            rows: 5,
          },
          'x-rules': [
            {
              required: true,
              message: '请填写原因',
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
}

const FIELD_TYPE_MAP = {
  string: 'string',
  long: 'string',
  upload: 'customUpload',
}

const getXComponentProps = (type, item) => {
  const MAP = {
    string: {
      placeholder: item.fieldRemark,
    },
    upload: {
      listType: 'card',
      action: '/api/support/file/upload',
      data: { fileType: UPLOAD_TYPE },
      fileList: [],
      onChange: (file) => console.log(file),
    },
  }
  return MAP[type]
}

const getCompnentValue = (elements: any) => {
  const components = {}
  for (let item of elements) {
    // 先判断是否存在 type，防止不存在的 type 报错
    const realType = FIELD_TYPE_MAP[item.fieldType]
    if (realType) {
      components[item.fieldName] = {
        type: FIELD_TYPE_MAP[item.fieldType],
        required: item.fieldEmpty === 0,
        title: item.fieldCNName,
        'x-component-props': getXComponentProps(realType, item),
      }
    }
  }
  return components
}

export const initDetailSchema = (props: any) => {
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
                required: true,
                title: '会员等级',
                enum: [],
                'x-component-props': {
                  placeholder: '请选择',
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
                      countryCodeId: {
                        type: 'string',
                        enum: [],
                        'x-component-props': {
                          placeholder: '请选择',
                        },
                        required: true,
                      },
                      phone: {
                        type: 'string',
                        required: true,
                        'x-mega-props': {
                          span: 2,
                        },
                        'x-component-props': {
                          placeholder: '请输入你的手机号码',
                          maxLength: 11,
                        },
                        'x-rules': [
                          {
                            pattern: PATTERN_MAPS.phone,
                            message: '请输入正确格式的手机号',
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
              wrapperCol: 8,
              labelAlign: 'left',
            },
            properties: getCompnentValue(item.elements),
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
