import { ISchema } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const shipperAddress: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        wrapperCol: 8,
        labelAlign: 'left',
      },
      properties: {
        shipperName: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.fahuoren' }),
          'x-component-props': {},
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'logistics.qingshurufahuo' }),
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 20,
            },
          ],
        },
        MEGA_LAYOUT1: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            label: '{{AddressLabel}}',
            wrapperCol: 24,
          },
          properties: {
            MEGA_LAYOUT1_1: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                grid: true,
                full: true,
                columns: 3,
              },
              properties: {
                provinceCode: {
                  type: 'string',
                  enum: [],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'logistics.shengfen/zhi' }),
                  },
                  'x-linkages': [
                    {
                      type: 'value:linkage',
                      condition: '{{!!$self.value}}',
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
                    placeholder: intl.formatMessage({ id: 'logistics.shiqu' }),
                  },
                  'x-linkages': [
                    {
                      type: 'value:linkage',
                      condition: '{{!!$self.value}}',
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
                    placeholder: intl.formatMessage({ id: 'logistics.qu' }),
                  },
                  required: true,
                },
              },
            },
          },
        },
        address: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.xiangxidizhi' }),
          'x-component': 'TextArea',
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'logistics.qingshuruxiangxi' }),
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 60,
            },
          ],
        },
        postalCode: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.youbian' }),
          'x-component-props': {},
          'x-rules': [
            {
              limitByte: true, // 自定义校验规则
              maxByte: 20,
            },
          ],
        },
        MEGA_LAYOUT2: {
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
                full: true,
                columns: 2,
              },
              properties: {
                areaCode: {
                  type: 'string',
                  enum: [],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'logistics.qingxuanze' }),
                  },
                },
                phone: {
                  type: 'string',
                  required: true,
                  'x-mega-props': {
                    span: 3,
                  },
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'logistics.qingshurunide' }),
                    maxLength: 11,
                  },
                  // 'x-rules': [
                  //   {
                  //     pattern: PATTERN_MAPS.phone,
                  //     message: intl.formatMessage({ id: 'logistics.qingshuruzhengque' }),
                  //   },
                  // ],
                },
              },
            },
          },
        },
        tel: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.dianhuahaoma' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.qingshurunide1' }),
          },
          'x-rules': [
            {
              pattern: PATTERN_MAPS.tel,
              message: intl.formatMessage({ id: 'logistics.qingshuruzhengque1' }),
            },
          ],
        },
        isDefault: {
          title: intl.formatMessage({ id: 'logistics.shifoumoren' }),
          'x-component': 'Switch',
          'x-component-props': {
            style: { maxWidth: 36 },
          },
        },
      },
    },
  },
}

export const receiverAddress: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        wrapperCol: 8,
        labelAlign: 'left',
      },
      properties: {
        receiverName: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.shouhuoren' }),
          'x-component-props': {},
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'logistics.qingshurushouhuo' }),
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 20,
            },
          ],
        },
        MEGA_LAYOUT1: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            label: '{{AddressLabel}}',
            wrapperCol: 24,
          },
          properties: {
            MEGA_LAYOUT1_1: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                grid: true,
                full: true,
                columns: 3,
              },
              properties: {
                provinceCode: {
                  type: 'string',
                  enum: [],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'logistics.shengfen/zhi' }),
                  },
                  'x-linkages': [
                    {
                      type: 'value:linkage',
                      condition: '{{!!$self.value}}',
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
                    placeholder: intl.formatMessage({ id: 'logistics.shiqu' }),
                  },
                  'x-linkages': [
                    {
                      type: 'value:linkage',
                      condition: '{{!!$self.value}}',
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
                    placeholder: intl.formatMessage({ id: 'logistics.qu' }),
                  },
                  required: true,
                },
              },
            },
          },
        },
        address: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.xiangxidizhi' }),
          'x-component': 'TextArea',
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'logistics.qingshuruxiangxi' }),
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 60,
            },
          ],
        },
        postalCode: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.youbian' }),
          'x-component-props': {},
          'x-rules': [
            {
              limitByte: true, // 自定义校验规则
              maxByte: 20,
            },
          ],
        },
        MEGA_LAYOUT2: {
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
                full: true,
                columns: 2,
              },
              properties: {
                areaCode: {
                  type: 'string',
                  enum: [],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'logistics.qingxuanze' }),
                  },
                },
                phone: {
                  type: 'string',
                  required: true,
                  'x-mega-props': {
                    span: 3,
                  },
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'logistics.qingshurunide' }),
                    maxLength: 11,
                  },
                  // 'x-rules': [
                  //   {
                  //     pattern: PATTERN_MAPS.phone,
                  //     message: intl.formatMessage({ id: 'logistics.qingshuruzhengque' }),
                  //   },
                  // ],
                },
              },
            },
          },
        },
        tel: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.dianhuahaoma' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.qingshurunide1' }),
          },
          'x-rules': [
            {
              pattern: PATTERN_MAPS.tel,
              message: intl.formatMessage({ id: 'logistics.qingshuruzhengque1' }),
            },
          ],
        },
        isDefault: {
          title: intl.formatMessage({ id: 'logistics.shifoumoren' }),
          'x-component': 'Switch',
          'x-component-props': {
            style: { maxWidth: 36 },
          },
        },
      },
    },
  },
}

export const SHIPPER_ADDRESS__ISCHEMA: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 16,
        labelAlign: 'left',
      },
      properties: {
        shipperName: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.fahuoren' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'logistics.qingshurufahuo' }),
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 20,
            },
          ],
        },
        MEGA_LAYOUT1: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            label: '{{AddressLabel}}',
            wrapperCol: 24,
          },
          properties: {
            MEGA_LAYOUT1_1: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                grid: true,
                full: true,
                columns: 4,
              },
              properties: {
                provinceCode: {
                  type: 'string',
                  enum: [],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'logistics.shengfen/zhi' }),
                  },
                },
                cityCode: {
                  type: 'string',
                  enum: [],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'logistics.shiqu' }),
                  },
                },
                districtCode: {
                  type: 'string',
                  enum: [],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'logistics.qu' }),
                  },
                },
                streetCode: {
                  type: 'string',
                  enum: [],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'logistics.jiedao' }),
                  },
                },
                // provinceCode: {
                //   type: 'string',
                //   enum: [],
                //   'x-component-props': {
                //     placeholder: intl.formatMessage({ id: 'logistics.shengfen/zhi' }),
                //   },
                //   'x-linkages': [
                //     {
                //       type: 'value:linkage',
                //       condition: '{{!!$self.value}}',
                //       origin: 'provinceCode',
                //       target: 'cityCode',
                //     },
                //   ],
                //   required: true,
                // },
                // cityCode: {
                //   type: 'string',
                //   enum: [],
                //   'x-component-props': {
                //     placeholder: intl.formatMessage({ id: 'logistics.shiqu' }),
                //   },
                //   'x-linkages': [
                //     {
                //       type: 'value:linkage',
                //       condition: '{{!!$self.value}}',
                //       origin: 'cityCode',
                //       target: 'districtCode',
                //     },
                //   ],
                //   required: true,
                // },
                // districtCode: {
                //   type: 'string',
                //   enum: [],
                //   'x-component-props': {
                //     placeholder: intl.formatMessage({ id: 'logistics.qu' }),
                //   },
                //   required: true,
                // },
              },
            },
          },
        },
        address: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.xiangxidizhi' }),
          'x-component': 'TextArea',
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'logistics.qingshuruxiangxi' }),
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 60,
            },
          ],
        },
        postalCode: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.youbian' }),
          'x-component-props': {},
          'x-rules': [
            {
              limitByte: true, // 自定义校验规则
              maxByte: 20,
            },
          ],
        },
        tel: {
          type: 'string',
          title: intl.formatMessage({ id: 'logistics.dianhuahaoma' }),
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.qingshurunide1' }),
          },
          'x-rules': [
            {
              pattern: PATTERN_MAPS.tel,
              message: intl.formatMessage({ id: 'logistics.qingshuruzhengque1' }),
            },
          ],
        },
        isDefault: {
          title: intl.formatMessage({ id: 'logistics.shifoumoren' }),
          'x-component': 'Switch',
          'x-component-props': {
            style: { maxWidth: 36 },
          },
        },
      },
    },
  },
}
