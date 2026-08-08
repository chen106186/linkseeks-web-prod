/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-29 10:03:06
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-08 14:47:30
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

export const listSearchSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        memberName: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'payandSettle.creditManage.schema.listSearchSchema.memberName' }),
            align: 'flex-left',
            tip: intl.formatMessage({ id: 'payandSettle.creditManage.schema.listSearchSchema.memberName.tip' }),
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
            applyNo: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'payandSettle.creditManage.schema.listSearchSchema.applyNo' }),
                allowClear: true,
              },
            },
            '[startTime, endTime]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'payandSettle.creditManage.schema.listSearchSchema.time' }),
                allowClear: true,
              },
            },
            applyType: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'payandSettle.creditManage.schema.listSearchSchema.applyType' }),
                allowClear: true,
              },
            },
            level: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'payandSettle.creditManage.schema.listSearchSchema.level' }),
                allowClear: true,
              },
            },
            memberType: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.creditManage.schema.listSearchSchema.memberTypeId',
                }),
                allowClear: true,
              },
            },
            subRoleId: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'payandSettle.creditManage.schema.listSearchSchema.subRoleId' }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'payandSettle.creditManage.schema.listSearchSchema.submit' }),
              },
            },
          },
        },
      },
    },
  },
}
