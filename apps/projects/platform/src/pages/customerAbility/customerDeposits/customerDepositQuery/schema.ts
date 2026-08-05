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
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
export const maintainSchema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'Mega-Layout',
      properties: {
        controllerWrap: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'ImportBtn',
            },
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.management.maintain.query.name.placeholder',
                }),
                tip: intl.formatMessage({
                  id: 'customerAbility.management.maintain.query.name.placeholder-tip',
                }),
                allowClear: true,
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'Flex-Layout',
          'x-component-props': {
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            subMemberId: {
              type: 'number',
              default: undefined,
              'x-component-props': {
                placeholder: translate('web.resource.member.memberId'),
                allowClear: true,
                style: {
                  width: 120,
                },
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
                style: {
                  width: 180,
                },
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
                style: {
                  width: 180,
                },
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

export const createQuerySchema = (registerFields: ElementType[]): ISchema => ({
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'Mega-layout',
      properties: {
        controllerWrap: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'ImportBtn',
            },
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.management.maintain.query.name.placeholder',
                }),
                tip: intl.formatMessage({
                  id: 'customerAbility.management.maintain.query.name.placeholder-tip',
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
                columns: 5,
              },
              properties: {
                memberId: {
                  type: 'number',
                  default: undefined,
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
    },
  },
})
