import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
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
            parentMemberName: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.capitalAccounts.eAccount.schema.searchSchema.parentMemberName',
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
            memberStatus: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.capitalAccounts.eAccount.schema.searchSchema.memberStatus',
                }),
                style: { width: '174px' },
              },
              enum: [
                {
                  label: intl.formatMessage({
                    id: 'payandSettle.capitalAccounts.eAccount.schema.searchSchema.memberStatus.1',
                  }),
                  value: 1,
                },
                {
                  label: intl.formatMessage({
                    id: 'payandSettle.capitalAccounts.eAccount.schema.searchSchema.memberStatus.2',
                  }),
                  value: 2,
                },
              ],
            },
            accountStatus: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.capitalAccounts.eAccount.schema.searchSchema.accountStatus',
                }),
                style: { width: '174px' },
              },
              enum: [
                {
                  label: intl.formatMessage({
                    id: 'payandSettle.capitalAccounts.eAccount.schema.searchSchema.accountStatus.1',
                  }),
                  value: 1,
                },
                {
                  label: intl.formatMessage({
                    id: 'payandSettle.capitalAccounts.eAccount.schema.searchSchema.accountStatus.2',
                  }),
                  value: 2,
                },
              ],
            },
            '[startTime,endTime]': {
              type: 'array',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'payandSettle.capitalAccounts.eAccount.schema.searchSchema.startTime' }),
                  intl.formatMessage({ id: 'payandSettle.capitalAccounts.eAccount.schema.searchSchema.endTime' }),
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
                  id: 'payandSettle.capitalAccounts.eAccount.schema.searchSchema.submit',
                }),
              },
            },
          },
        },
      },
    },
  },
}

export const rechargeSchema: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'left',
        labelCol: 24,
        wrapperCol: 24,
      },
      properties: {
        money: {
          type: 'string',
          title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.eAccount.schema.rechargeSchema.money' }),
          'x-component-props': {
            addonBefore: translate('web.common.currencySymbol'),
            // suffix: "RMB"
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.capitalAccounts.eAccount.schema.rechargeSchema.money.message.1',
              }),
            },
            {
              validator: (value) => {
                return isNaN(value)
              },
              message: intl.formatMessage({
                id: 'payandSettle.capitalAccounts.eAccount.schema.rechargeSchema.money.message.2',
              }),
            },
            {
              pattern: /^\d+(\.\d{1,2})?$/,
              message: intl.formatMessage({
                id: 'payandSettle.capitalAccounts.eAccount.schema.rechargeSchema.money.message.3',
              }),
            },
          ],
        },

        type: {
          type: 'array:number',
          'x-component': 'CardCheckBox',
          'x-component-props': {
            dataSource: [],
            type: 'radio', // CardCheckBox 单选模式
          },
          title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.eAccount.schema.rechargeSchema.type' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.capitalAccounts.eAccount.schema.rechargeSchema.type.message',
              }),
            },
          ],
        },
      },
    },
  },
}
