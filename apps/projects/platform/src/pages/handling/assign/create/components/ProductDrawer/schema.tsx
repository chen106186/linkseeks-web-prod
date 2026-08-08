import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const schema: ISchema = {
  type: 'object',
  properties: {
    basicInfo: {
      type: 'string',
      'x-component': 'FlagBox',
      'x-component-props': {
        title: intl.formatMessage({ id: 'handling.docApproval' }),
      },
      properties: {
        MEGA_LAYOUT: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            labelCol: 4,
            wrapperCol: 18,
            labelAlign: 'left',
          },
          properties: {
            skuid: {
              type: 'string',
              title: 'skuId',
              display: false,
            },
            commodityId: {
              type: 'string',
              title: intl.formatMessage({ id: 'handling.assign.add.product.id' }),
              editable: false,
            },
            name: {
              title: intl.formatMessage({ id: 'handling.assign.add.product.name' }),
              type: 'string',
              editable: false,
            },
            category: {
              title: intl.formatMessage({ id: 'handling.assign.add.product.category' }),
              type: 'string',
              editable: false,
            },
            brand: {
              title: intl.formatMessage({ id: 'handling.assign.add.product.brandName' }),
              type: 'string',
              editable: false,
            },
          },
        },
      },
    },
    productProps: {
      type: 'string',
      'x-component': 'formilyProductAttrsLayout',
    },
    files: {
      type: 'string',
      'x-component': 'FlagBox',
      'x-component-props': {
        title: intl.formatMessage({ id: 'handling.assign.add.files' }),
      },
      properties: {
        enclosure: {
          'x-component': 'FormilyUploadFiles',
        },
      },
    },
    processRequire: {
      type: 'string',
      'x-component': 'FlagBox',
      'x-component-props': {
        title: intl.formatMessage({ id: 'handling.process.require' }),
      },
      properties: {
        MEGA_LAYOUT: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            labelCol: 4,
            wrapperCol: 18,
            labelAlign: 'left',
          },
          properties: {
            unitName: {
              type: 'string',
              title: intl.formatMessage({ id: 'handling.assign.add.product.unitName' }),
              editable: false,
            },
            processNum: {
              type: 'string',
              title: intl.formatMessage({ id: 'handling.assign.add.product.processNum' }),
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.assign.add.product.processNum.requireMsg' }),
                },
                {
                  pattern: /^[1-9][0-9]*(\.[0-9]{1,3})?$/,
                  message: intl.formatMessage({ id: 'handling.rules.threeDecimal' }),
                },
              ],
            },
            processUnitPrice: {
              title: intl.formatMessage({ id: 'handling.assign.add.product.processUnitPrice' }),
              type: 'string',
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.assign.add.product.processUnitPrice.requireMsg' }),
                },
                {
                  pattern: /^[1-9][0-9]*(\.[0-9]{1,3})?$/,
                  message: intl.formatMessage({ id: 'handling.rules.threeDecimal' }),
                },
              ],
            },
            isHasTax: {
              title: intl.formatMessage({ id: 'handling.assign.add.isHasTax' }),
              type: 'radio',
              enum: [
                {
                  label: intl.formatMessage({ id: 'common.button.yes' }),
                  value: 1,
                },
                {
                  label: intl.formatMessage({ id: 'common.button.no' }),
                  value: 0,
                },
              ],
              required: true,
              'x-linkages': [
                {
                  type: 'value:schema',
                  target: 'taxRate',
                  condition: `{{ $value === 1 }}`,
                  schema: {
                    'x-rules': [
                      {
                        required: true,
                      },
                    ],
                  },
                  otherwise: {
                    'x-rules': [
                      {
                        required: false,
                      },
                    ],
                  },
                },
              ],
            },
            taxRate: {
              title: intl.formatMessage({ id: 'handling.assign.add.taxRate' }),
              type: 'string',
              'x-component-props': {
                addonAfter: '%',
              },
              'x-rules': [
                {
                  pattern: /^[1-9][0-9]*(\.[0-9]{1,2})?$/,
                  message: intl.formatMessage({ id: 'handling.rules.twoDecimal' }),
                },
              ],
            },
          },
        },
      },
    },
  },
}

export default schema
