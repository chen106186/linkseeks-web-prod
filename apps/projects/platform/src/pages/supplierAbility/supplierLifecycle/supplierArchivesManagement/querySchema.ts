/*
 * @Description: 列表查询 schema
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createRegisterFieldsSchema, ElementType } from '@/utils/createRegisterFieldSchema'

const intl = getIntl()

export const createQuerySchema = (registerFields: ElementType[]): ISchema => ({
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
            placeholder: intl.formatMessage({ id: 'supplier.profile.name' }),
            align: 'flex-left',
            tip: intl.formatMessage({ id: 'supplier.query.name.tip' }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 5,
          },
          properties: {
            subMemberId: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'supplier.profile.supplierId', defaultMessage: '供应商ID' }),
                allowClear: true,
              },
            },
            code: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'supplier.classify.code', defaultMessage: '供应商编码' }),
              },
            },
            '[startDate, endDate]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'supplier.query.date', defaultMessage: '时间范围(全部)' }),
                allowClear: true,
              },
            },
            categoryId: {
              type: 'string',
              'x-component': 'Cascader',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'supplier.query.categoryId', defaultMessage: '主营品类(全部)' }),
                allowClear: true,
                showSearch: true,
                fieldNames: { label: 'name', value: 'id', children: 'children' },
                changeOnSelect: true,
                expandTrigger: 'hover',
                multiple: false,
              },
            },
            currencyType: {
              type: 'string',
              enum: [],
              default: undefined,
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'supplier.query.currencyType', defaultMessage: '币别(全部)' }),
                allowClear: true,
              },
            },
            innerStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'supplier.query.innerStatus', defaultMessage: '内部状态(全部)' }),
                allowClear: true,
              },
            },
            outerStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'supplier.query.outerStatus', defaultMessage: '外部状态(全部)' }),
                allowClear: true,
              },
            },
            roleId: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                allowClear: true,
              },
              display: false,
            },
            ...(registerFields.length
              ? {
                  memberConfigs: {
                    type: 'object',
                    'x-mega-props': {
                      span: 5,
                    },
                    properties: {
                      ...createRegisterFieldsSchema(registerFields),
                    },
                  },
                }
              : {}),
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'member.management.maintain.query.query', defaultMessage: '查询' }),
              },
            },
          },
        },
      },
    },
  },
})
