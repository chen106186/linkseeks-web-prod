/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-27 17:47:42
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-08 14:49:50
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
        parentMemberName: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'payandSettle.creditApplication.quotaMenage.schema.listSearchSchema.parentMemberName',
            }),
            align: 'flex-left',
            tip: intl.formatMessage({
              id: 'payandSettle.creditApplication.quotaMenage.schema.listSearchSchema.parentMemberName.tip',
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
            rePayStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.creditApplication.quotaMenage.schema.listSearchSchema.rePayStatus',
                }),
                allowClear: true,
              },
            },
            status: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.creditApplication.quotaMenage.schema.listSearchSchema.status',
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
                  id: 'payandSettle.creditApplication.quotaMenage.schema.listSearchSchema.submit',
                }),
              },
            },
          },
        },
      },
    },
  },
}
