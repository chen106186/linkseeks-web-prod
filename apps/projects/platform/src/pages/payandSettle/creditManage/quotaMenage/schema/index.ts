/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-27 17:47:42
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-08 14:48:06
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { UPLOAD_TYPE } from '@/constants'

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
            placeholder: intl.formatMessage({
              id: 'payandSettle.creditManage.quotaMenage.schema.listSearchSchema.memberName',
            }),
            align: 'flex-left',
            tip: intl.formatMessage({
              id: 'payandSettle.creditManage.quotaMenage.schema.listSearchSchema.memberName.tip',
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
            level: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.creditManage.quotaMenage.schema.listSearchSchema.level',
                }),
                allowClear: true,
              },
            },
            memberType: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.creditManage.quotaMenage.schema.listSearchSchema.memberTypeId',
                }),
                allowClear: true,
              },
            },
            subRoleId: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.creditManage.quotaMenage.schema.listSearchSchema.subRoleId',
                }),
                allowClear: true,
              },
            },
            rePayStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.creditManage.quotaMenage.schema.listSearchSchema.rePayStatus',
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
                  id: 'payandSettle.creditManage.quotaMenage.schema.listSearchSchema.status',
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
                  id: 'payandSettle.creditManage.quotaMenage.schema.listSearchSchema.submit',
                }),
              },
            },
          },
        },
      },
    },
  },
}
