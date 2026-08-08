import { ISchema } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
export const warehouseDetailSchema: ISchema = {
  type: 'object',
  properties: {
    BASIC_INFO: {
      type: 'object',
      'x-component': 'MellowCard',
      'x-component-props': {
        title: getIntl().formatMessage({ id: 'stockSellStorage.jibenxinxi' }),
      },
      properties: {
        MEGA_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelCol: 4,
            wrapperCol: 20,
            labelAlign: 'left',
            grid: true,
            full: true,
            autoRow: true,
            columns: 2,
          },
          properties: {
            name: {
              type: 'string',
              title: getIntl().formatMessage({ id: 'stockSellStorage.cangkumingcheng' }),
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.qingshuru' }),
              },
              'x-rules': [
                {
                  required: true,
                  message: getIntl().formatMessage({ id: 'stockSellStorage.qingshurucangkumingcheng' }),
                },
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 20,
                },
              ],
              required: true,
            },
            principal: {
              type: 'string',
              title: getIntl().formatMessage({ id: 'stockSellStorage.cangkufuzhairen' }),
              'x-component-props': {},
              'x-rules': [
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 16,
                },
              ],
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
            MEGA_LAYOUT1: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                label: '{{AddressLabel}}',
                wrapperCol: 24,
                columns: 1,
              },
              required: true,
              properties: {
                MEGA_LAYOUT1_1: {
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
                        placeholder: getIntl().formatMessage({ id: 'stockSellStorage.sheng' }),
                      },
                      'x-linkages': [
                        {
                          type: 'value:linkage',
                          condition: '{{!!$value}}',
                          origin: 'provinceCode',
                          target: 'cityCode',
                        },
                      ],
                      'x-rules': [
                        {
                          required: true,
                          message: getIntl().formatMessage({ id: 'common.text.pleaseSelect' }),
                        },
                      ],
                    },
                    cityCode: {
                      type: 'string',
                      enum: [],
                      'x-component-props': {
                        placeholder: getIntl().formatMessage({ id: 'stockSellStorage.shi1' }),
                      },
                      'x-linkages': [
                        {
                          type: 'value:linkage',
                          condition: '{{!!$value}}',
                          origin: 'cityCode',
                          target: 'areaCode',
                        },
                      ],
                      'x-rules': [
                        {
                          required: true,
                          message: getIntl().formatMessage({ id: 'common.text.pleaseSelect' }),
                        },
                      ],
                    },
                    areaCode: {
                      type: 'string',
                      enum: [],
                      'x-component-props': {
                        placeholder: getIntl().formatMessage({ id: 'stockSellStorage.xianqu' }),
                      },
                      'x-linkages': [
                        {
                          type: 'value:linkage',
                          condition: '{{!!$value}}',
                          origin: 'areaCode',
                          target: 'streetCode',
                        },
                      ],
                      'x-rules': [
                        {
                          required: true,
                          message: getIntl().formatMessage({ id: 'common.text.pleaseSelect' }),
                        },
                      ],
                    },
                    streetCode: {
                      type: 'string',
                      enum: [],
                      'x-component-props': {
                        placeholder: getIntl().formatMessage({ id: 'stockSellStorage.jiedao' }),
                      },
                      'x-rules': [
                        {
                          required: false,
                          message: getIntl().formatMessage({ id: 'common.text.pleaseSelect' }),
                        },
                      ],
                    },
                  },
                },
                address: {
                  type: 'string',
                  required: true,
                  'x-component': 'TextArea',
                  'x-component-props': {
                    placeholder: getIntl().formatMessage({ id: 'stockSellStorage.qingshuruxiangxidizhi' }),
                    rows: 5,
                  },
                  'x-rules': [
                    {
                      limitByte: true, // 自定义校验规则
                      maxByte: 50,
                    },
                  ],
                },
              },
            },
            MEGA_LAYOUT2: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                label: getIntl().formatMessage({ id: 'stockSellStorage.lianxidianhua' }),
              },
              properties: {
                MEGA_LAYOUT2_1: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  'x-component-props': {
                    grid: true,
                    full: true,
                    autoRow: true,
                    columns: 4,
                  },
                  properties: {
                    telCode: {
                      type: 'string',
                      enum: [],
                      'x-component-props': {
                        placeholder: getIntl().formatMessage({ id: 'stockSellStorage.qingxuanze' }),
                      },
                    },
                    tel: {
                      type: 'string',
                      'x-mega-props': {
                        span: 3,
                      },
                      'x-component-props': {
                        placeholder: getIntl().formatMessage({ id: 'stockSellStorage.qingshurunideshoujihao' }),
                      },
                      // 'x-rules': [
                      //   {
                      //     pattern: PATTERN_MAPS.phone,
                      //     message: getIntl().formatMessage({ id: 'stockSellStorage.qingshuruzhengquegeshide' }),
                      //   },
                      // ],
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
