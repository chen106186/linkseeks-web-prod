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

const intl = getIntl()

export const memberAssignedSchema: ISchema = {
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
            placeholder: intl.formatMessage({
              id: 'member.management.maintain.query.name.placeholder',
            }),
            align: 'flex-left',
            tip: intl.formatMessage({
              id: 'supplier.management.maintain.query.name.placeholder-tip',
            }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 6,
          },
          properties: {
            memberType: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.management.maintain.query.memberTypeId.placeholder',
                }),
                allowClear: true,
              },
            },
            roleId: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.management.maintain.query.roleId.placeholde',
                }),
                allowClear: true,
              },
            },
            level: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.management.maintain.query.level.placeholder',
                }),
                allowClear: true,
              },
            },
            source: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.management.maintain.query.source.placeholder',
                }),
                allowClear: true,
              },
            },
            innerStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.management.maintain.query.innerStatus.placeholder',
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
                  id: 'member.management.maintain.query.outerStatus.placeholder',
                }),
                allowClear: true,
              },
            },
            status: {
              type: 'string',
              enum: [],
              default: undefined,
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'supplier.management.maintain.query.status.placeholder',
                }),
                allowClear: true,
              },
            },
            '[startDate, endDate]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.management.maintain.query.date.placeholder',
                }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({
                  id: 'member.management.maintain.query.query',
                }),
              },
            },
          },
        },
      },
    },
  },
}
