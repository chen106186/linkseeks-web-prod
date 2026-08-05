import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

export const searchSchema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            memberName: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.paymentWithdraw.schema.searchSchema.memberName',
                }),
                align: 'flex-left',
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
              justifyContent: 'end',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            status: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.paymentWithdraw.schema.searchSchema.status',
                }),
                style: { width: '174px' },
              },
              enum: [
                {
                  label: intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.paymentWithdraw.schema.searchSchema.status.1',
                  }),
                  value: 2,
                },
                {
                  label: intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.paymentWithdraw.schema.searchSchema.status.2',
                  }),
                  value: 4,
                },
                {
                  label: intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.paymentWithdraw.schema.searchSchema.status.3',
                  }),
                  value: 5,
                },
              ],
            },
            '[startTime,endTime]': {
              type: 'array',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.paymentWithdraw.schema.searchSchema.startTime',
                  }),
                  intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.paymentWithdraw.schema.searchSchema.endTime',
                  }),
                ],
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.paymentWithdraw.schema.searchSchema.submit',
                }),
              },
            },
          },
        },
      },
    },
  },
}
