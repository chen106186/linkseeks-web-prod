/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-04 11:49:18
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-29 16:52:00
 * @Description:
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
            placeholder: intl.formatMessage({ id: 'customerAbility.management.maintain.query.name.placeholder' }),
            align: 'flex-left',
            tip: intl.formatMessage({ id: 'customerAbility.management.maintain.query.name.placeholder-tip' }),
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
            memberType: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'customerAbility.management.maintain.query.memberTypeId.placeholder',
                }),
                allowClear: true,
              },
            },
            roleId: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'customerAbility.management.maintain.query.roleId.placeholde' }),
                allowClear: true,
              },
            },
            level: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'customerAbility.management.maintain.query.level.placeholder' }),
                allowClear: true,
              },
            },
            source: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'customerAbility.management.maintain.query.source.placeholder' }),
                allowClear: true,
              },
            },
            innerStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'customerAbility.management.maintain.query.innerStatus.placeholder',
                }),
                allowClear: true,
              },
            },
            outerStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'customerAbility.management.maintain.query.outerStatus.placeholder',
                }),
                allowClear: true,
              },
            },
            status: {
              type: 'string',
              enum: [],
              default: undefined,
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'customerAbility.management.maintain.query.status.placeholder' }),
                allowClear: true,
              },
            },
            '[startDate, endDate]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'customerAbility.management.maintain.query.date.placeholder' }),
                allowClear: true,
              },
            },
            code: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'customerAbility.management.maintain.query.code.placeholder',
                  defaultMessage: '会员编码',
                }),
              },
            },
            currencyType: {
              type: 'string',
              enum: [],
              default: undefined,
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'customerAbility.management.maintain.query.currencyType.placeholder',
                  defaultMessage: '币别(全部)',
                }),
                allowClear: true,
              },
            },
            categoryId: {
              type: 'string',
              'x-component': 'Cascader',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'customerAbility.management.maintain.query.categoryId.placeholder',
                  defaultMessage: '主营品类(全部)',
                }),
                allowClear: true,
                showSearch: true,
                fieldNames: { label: 'name', value: 'id', children: 'children' },
                changeOnSelect: true,
                expandTrigger: 'hover',
                multiple: false,
              },
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
                children: intl.formatMessage({ id: 'customerAbility.management.maintain.query.query' }),
              },
            },
          },
        },
      },
    },
  },
})
