/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-05 14:02:46
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-02 10:30:49
 * @Description:
 */
import type { ISchema } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
export const createSchema = (addressType = 2, editAddressFromType = 'default'): ISchema => {
  const intl = getIntl()
  const typeCN =
    addressType === 2
      ? intl.formatMessage({ id: 'components.fahuo' })
      : intl.formatMessage({ id: 'components.shouhuo' })
  const operator =
    addressType === 2
      ? intl.formatMessage({ id: 'components.jijian' })
      : intl.formatMessage({ id: 'components.shoujian' })
  const defaultFrom = {
    type: 'object',
    properties: {
      MEGA_LAYOUT: {
        type: 'object',
        'x-component': 'Mega-Layout',
        'x-component-props': {
          grid: false,
        },
        properties: {
          ADDRESS_LIST: {
            type: 'object',
            'x-component': 'FlagBox',
            'x-component-props': {
              title: `${intl.formatMessage({
                id: 'components.xuanze',
              })}${typeCN}${intl.formatMessage({ id: 'components.dizhi' })}`,
              border: false,
            },
            properties: {
              MEGA_LAYOUT_1: {
                type: 'object',
                'x-component': 'Mega-Layout',
                'x-component-props': {
                  wrapperCol: 24,
                },
                properties: {
                  address: {
                    type: 'string',
                    'x-component': 'AddressRadioGroup',
                    'x-component-props': {
                      onClickEdit: '{{ handleEditAddress }}',
                    },
                  },
                },
              },
            },
          },
          ADD_ACTION: {
            type: 'object',
            'x-component': 'AddButton',
          },
          ADDRESS_NEW: {
            type: 'object',
            'x-component': 'FlagBox',
            'x-component-props': {
              title: `${intl.formatMessage({
                id: 'components.tianxie',
              })}${typeCN}${intl.formatMessage({ id: 'components.xinxi' })}`,
              border: false,
            },
            visible: false,
            properties: {
              MEGA_LAYOUT_2: {
                type: 'object',
                'x-component': 'mega-layout',
                'x-component-props': {
                  full: false,
                  labelCol: 4,
                  wrapperCol: 20,
                  labelAlign: 'left',
                },
                properties: {
                  name: {
                    type: 'string',
                    title: `${operator}${intl.formatMessage({ id: 'components.ren' })}`,
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'components.qingshuru' }),
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: `${intl.formatMessage({
                          id: 'components.qingshuru',
                        })}${operator}${intl.formatMessage({ id: 'components.ren' })}`,
                      },
                      {
                        limitByte: true, // 自定义校验规则
                        maxByte: 40,
                      },
                    ],
                    required: true,
                  },
                  countryCode: {
                    type: 'string',
                    enum: [],
                    title: translate('web.resource.logistics.guojia_diqu'),
                    required: true,
                    'x-rules': [
                      {
                        required: true,
                        message: translate.formatFormSelectTip(translate('web.resource.logistics.guojia_diqu')),
                      },
                    ],
                  },
                  MEGA_LAYOUT_2_1: {
                    type: 'object',
                    'x-component': 'mega-layout',
                    'x-component-props': {
                      label: '{{AreaLabel}}',
                      wrapperCol: 24,
                    },
                    required: true,
                    properties: {
                      MEGA_LAYOUT_2_1_1: {
                        type: 'object',
                        'x-component': 'mega-layout',
                        'x-component-props': {
                          grid: true,
                          full: true,
                          autoRow: true,
                          columns: 4,
                        },
                        properties: {
                          provinceCode: {
                            type: 'string',
                            enum: [],
                            'x-component-props': {
                              placeholder: intl.formatMessage({
                                id: 'components.shengfenzhixiashi',
                              }),
                              allowClear: true,
                              notFoundContent: '{{NotFoundContent}}',
                            },
                            'x-linkages': [
                              {
                                type: 'value:areaEnum',
                                condition: '{{ !!$value }}', // $self.value 不生效不知道咋滴
                                origin: 'provinceCode',
                                target: 'cityCode',
                              },
                            ],
                            required: true,
                          },
                          cityCode: {
                            type: 'string',
                            enum: [],
                            'x-component-props': {
                              placeholder: intl.formatMessage({ id: 'components.shi' }),
                              allowClear: true,
                              notFoundContent: '{{NotFoundContent}}',
                            },
                            'x-linkages': [
                              {
                                type: 'value:areaEnum',
                                condition: '{{ !!$value }}', // $self.value 不生效不知道咋滴
                                origin: 'cityCode',
                                target: 'districtCode',
                              },
                            ],
                            required: true,
                          },
                          districtCode: {
                            type: 'string',
                            enum: [],
                            'x-component-props': {
                              placeholder: intl.formatMessage({ id: 'components.qu' }),
                              allowClear: true,
                              notFoundContent: '{{NotFoundContent}}',
                            },
                            'x-linkages': [
                              {
                                type: 'value:areaEnum',
                                condition: '{{ !!$value }}', // $self.value 不生效不知道咋滴
                                origin: 'districtCode',
                                target: 'streetCode',
                              },
                            ],
                            required: true,
                          },
                          streetCode: {
                            type: 'string',
                            enum: [],
                            'x-component-props': {
                              placeholder: intl.formatMessage({ id: 'components.jiedao' }),
                              allowClear: true,
                              notFoundContent: '{{NotFoundContent}}',
                            },
                            required: false,
                          },
                        },
                      },
                    },
                  },
                  detailed: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'components.xiangxidizhi' }),
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'components.qingshuruxiangxidizhi' }),
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'components.qingshuruxiangxidizhi1' }),
                      },
                      {
                        limitByte: true, // 自定义校验规则
                        maxByte: 60,
                      },
                    ],
                  },
                  postalCode: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'components.youbian' }),
                    'x-component-props': {},
                    'x-rules': [
                      {
                        limitByte: true, // 自定义校验规则
                        maxByte: 20,
                      },
                    ],
                  },
                  MEGA_LAYOUT_2_2: {
                    type: 'object',
                    'x-component': 'mega-layout',
                    'x-component-props': {
                      label: '{{PhoneLabel}}',
                      wrapperCol: 24,
                    },
                    properties: {
                      MEGA_LAYOUT2_1: {
                        type: 'object',
                        'x-component': 'mega-layout',
                        'x-component-props': {
                          grid: true,
                          columns: 3,
                          full: true,
                        },
                        properties: {
                          areaCode: {
                            type: 'string',
                            enum: [],
                            'x-mega-props': {
                              span: 1,
                            },
                            'x-component-props': {
                              placeholder: intl.formatMessage({ id: 'components.qingxuanze' }),
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
                              placeholder: intl.formatMessage({
                                id: 'components.qingshurunideshoujihao',
                              }),
                              maxLength: 11,
                            },
                            // 'x-rules': [
                            //   {
                            //     pattern: PATTERN_MAPS.phone,
                            //     message: intl.formatMessage({
                            //       id: 'components.qingshuruzhengquegeshide',
                            //     }),
                            //   },
                            // ],
                          },
                        },
                      },
                    },
                  },
                  tel: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'components.dianhuahaoma' }),
                    'x-component-props': {},
                    'x-rules': [
                      {
                        pattern: PATTERN_MAPS.tel,
                        message: intl.formatMessage({ id: 'components.qingshuruzhengquegeshide1' }),
                      },
                    ],
                  },
                  isDefault: {
                    type: 'boolean',
                    title: intl.formatMessage({ id: 'components.shifoumoren' }),
                    'x-component': 'Switch',
                  },
                },
              },
            },
          },
        },
      },
    },
  }
  const modalFrom = {
    type: 'object',
    properties: {
      MEGA_LAYOUT: {
        type: 'object',
        'x-component': 'Mega-Layout',
        'x-component-props': {
          grid: false,
        },
        properties: {
          ADDRESS_LIST: {
            type: 'object',
            'x-component': 'FlagBox',
            'x-component-props': {
              title: `${intl.formatMessage({ id: 'components.xuanze' })}${intl.formatMessage({
                id: 'components.dizhi',
              })}`,
              border: false,
            },
            properties: {
              MEGA_LAYOUT_1: {
                type: 'object',
                'x-component': 'Mega-Layout',
                'x-component-props': {
                  wrapperCol: 24,
                },
                properties: {
                  address: {
                    type: 'string',
                    'x-component': 'AddressRadioGroup',
                    'x-component-props': {
                      onClickEdit: '{{ handleEditAddress }}',
                      editBtnText: '{{editBtnText}}',
                      deleteBtnText: '{{deleteBtnText}}',
                    },
                  },
                },
              },
            },
          },
          ADD_ACTION: {
            type: 'object',
            'x-component': 'AddButton',
          },
          ADDRESS_NEW: {
            type: 'object',
            'x-component': 'CustomModalForm',
            'x-component-props': {
              title: `${intl.formatMessage({
                id: 'components.tianxie',
              })}${typeCN}${intl.formatMessage({ id: 'components.xinxi' })}`,
              currentRef: '{{customModalFormRef}}',
              modalTitle: '新增地址',
              schema: {
                type: 'object',
                properties: {
                  MEGA_LAYOUT_2: {
                    type: 'object',
                    'x-component': 'mega-layout',
                    'x-component-props': {
                      full: false,
                      labelCol: 4,
                      wrapperCol: 24,
                      labelAlign: 'top',
                    },
                    properties: {
                      name: {
                        type: 'string',
                        title: `${typeCN}${intl.formatMessage({ id: 'components.ren' })}`,
                        'x-component-props': {
                          placeholder: intl.formatMessage({ id: 'components.qingshuru' }),
                        },
                        'x-rules': [
                          {
                            required: true,
                            message: `${intl.formatMessage({
                              id: 'components.qingshuru',
                            })}${operator}${intl.formatMessage({ id: 'components.ren' })}`,
                          },
                          {
                            limitByte: true, // 自定义校验规则
                            maxByte: 40,
                          },
                        ],
                        required: true,
                      },
                      countryCode: {
                        type: 'string',
                        enum: [],
                        title: translate('web.resource.logistics.guojia_diqu'),
                        required: true,
                        'x-rules': [
                          {
                            required: true,
                            message: translate.formatFormSelectTip(translate('web.resource.logistics.guojia_diqu')),
                          },
                        ],
                      },
                      MEGA_LAYOUT_2_1: {
                        type: 'object',
                        'x-component': 'mega-layout',
                        'x-component-props': {
                          label: '{{AreaLabel}}',
                          wrapperCol: 24,
                        },
                        required: true,
                        properties: {
                          MEGA_LAYOUT_2_1_1: {
                            type: 'object',
                            'x-component': 'mega-layout',
                            'x-component-props': {
                              grid: true,
                              full: true,
                              autoRow: true,
                              columns: 4,
                            },
                            properties: {
                              provinceCode: {
                                type: 'string',
                                enum: [],
                                'x-component-props': {
                                  placeholder: intl.formatMessage({
                                    id: 'components.shengfenzhixiashi',
                                  }),
                                  allowClear: true,
                                },
                                'x-linkages': [
                                  {
                                    type: 'value:areaEnum',
                                    condition: '{{ !!$value }}', // $self.value 不生效不知道咋滴
                                    origin: 'provinceCode',
                                    target: 'cityCode',
                                  },
                                ],
                                required: true,
                              },
                              cityCode: {
                                type: 'string',
                                enum: [],
                                'x-component-props': {
                                  placeholder: intl.formatMessage({ id: 'components.shi' }),
                                  allowClear: true,
                                },
                                'x-linkages': [
                                  {
                                    type: 'value:areaEnum',
                                    condition: '{{ !!$value }}', // $self.value 不生效不知道咋滴
                                    origin: 'cityCode',
                                    target: 'districtCode',
                                  },
                                ],
                                required: true,
                              },
                              districtCode: {
                                type: 'string',
                                enum: [],
                                'x-component-props': {
                                  placeholder: intl.formatMessage({ id: 'components.qu' }),
                                  allowClear: true,
                                },
                                'x-linkages': [
                                  {
                                    type: 'value:areaEnum',
                                    condition: '{{ !!$value }}', // $self.value 不生效不知道咋滴
                                    origin: 'districtCode',
                                    target: 'streetCode',
                                  },
                                ],
                                required: true,
                              },
                              streetCode: {
                                type: 'string',
                                enum: [],
                                'x-component-props': {
                                  placeholder: intl.formatMessage({ id: 'components.jiedao' }),
                                  allowClear: true,
                                },
                                required: false,
                              },
                            },
                          },
                        },
                      },
                      detailed: {
                        type: 'string',
                        title: intl.formatMessage({ id: 'components.xiangxidizhi' }),
                        'x-component-props': {
                          placeholder: intl.formatMessage({
                            id: 'components.qingshuruxiangxidizhi',
                          }),
                        },
                        'x-rules': [
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'components.qingshuruxiangxidizhi1',
                            }),
                          },
                          {
                            limitByte: true, // 自定义校验规则
                            maxByte: 60,
                          },
                        ],
                      },

                      MEGA_LAYOUT_2_2: {
                        type: 'object',
                        'x-component': 'mega-layout',
                        'x-component-props': {
                          label: '{{PhoneLabel}}',
                          wrapperCol: 24,
                        },
                        properties: {
                          MEGA_LAYOUT2_1: {
                            type: 'object',
                            'x-component': 'mega-layout',
                            'x-component-props': {
                              grid: true,
                              columns: 3,
                              full: true,
                            },
                            properties: {
                              areaCode: {
                                type: 'string',
                                enum: [],
                                'x-mega-props': {
                                  span: 1,
                                },
                                'x-component-props': {
                                  placeholder: intl.formatMessage({ id: 'components.qingxuanze' }),
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
                                  placeholder: intl.formatMessage({
                                    id: 'components.qingshurunideshoujihao',
                                  }),
                                  maxLength: 11,
                                },
                                // 'x-rules': [
                                //   {
                                //     pattern: PATTERN_MAPS.phone,
                                //     message: intl.formatMessage({
                                //       id: 'components.qingshuruzhengquegeshide',
                                //     }),
                                //   },
                                // ],
                              },
                            },
                          },
                        },
                      },
                      tel: {
                        type: 'string',
                        title: intl.formatMessage({ id: 'components.dianhuahaoma' }),
                        'x-component-props': {},
                        'x-rules': [
                          {
                            pattern: PATTERN_MAPS.tel,
                            message: intl.formatMessage({
                              id: 'components.qingshuruzhengquegeshide1',
                            }),
                          },
                        ],
                      },
                      MEGA_LAYOUT_2_3: {
                        type: 'object',
                        'x-component': 'mega-layout',
                        'x-component-props': {
                          wrapperCol: 24,
                        },
                        properties: {
                          MEGA_LAYOUT_2_3_1: {
                            type: 'object',
                            'x-component': 'mega-layout',
                            'x-component-props': {
                              grid: true,
                              columns: 2,
                              full: false,
                              labelAlign: 'top',
                              labelWidth: 300,
                            },
                            properties: {
                              postalCode: {
                                type: 'string',
                                title: intl.formatMessage({ id: 'components.youbian' }),
                                'x-component-props': {},
                                'x-rules': [
                                  {
                                    limitByte: true, // 自定义校验规则
                                    maxByte: 20,
                                  },
                                ],
                              },
                              isDefault: {
                                type: 'boolean',
                                title: intl.formatMessage({ id: 'components.shifoumoren' }),
                                'x-component': 'Switch',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              actions: '{{formActions}}',
              effects: '{{useSchemaEffects}}',
              onSubmit: '{{handleSubmit}}',
              confirm: '{{modalConfirm}}',
            },
            visible: false,
          },
        },
      },
    },
  }
  const from = {
    default: defaultFrom,
    modal: modalFrom,
  }
  if (!from[editAddressFromType]) {
    return defaultFrom
  }
  return from[editAddressFromType]
}
