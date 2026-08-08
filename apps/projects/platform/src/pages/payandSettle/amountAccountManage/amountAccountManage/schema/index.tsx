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
            memberName: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.memberAccountManage.schema.searchSchema.memberName',
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
            memberType: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.memberAccountManage.schema.searchSchema.memberType',
                }),
                style: {
                  width: 174,
                },
              },
            },
            memberRoleId: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.memberAccountManage.schema.searchSchema.memberRoleId',
                }),
                style: {
                  width: 174,
                },
              },
            },
            memberLevel: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.memberAccountManage.schema.searchSchema.memberLevel',
                }),
                style: {
                  width: 174,
                },
              },
              visible: false,
            },
            memberStatus: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.memberAccountManage.schema.searchSchema.memberStatus',
                }),
                style: { width: '174px' },
              },
              enum: [
                {
                  label: intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.memberAccountManage.schema.searchSchema.memberStatus.1',
                  }),
                  value: 1,
                },
                {
                  label: intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.memberAccountManage.schema.searchSchema.memberStatus.2',
                  }),
                  value: 2,
                },
              ],
            },
            accountStatus: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.memberAccountManage.schema.searchSchema.accountStatus',
                }),
                style: { width: '174px' },
              },
              enum: [
                {
                  label: intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.memberAccountManage.schema.searchSchema.accountStatus.1',
                  }),
                  value: 1,
                },
                {
                  label: intl.formatMessage({
                    id: 'payandSettle.amountAccountManage.memberAccountManage.schema.searchSchema.accountStatus.2',
                  }),
                  value: 2,
                },
              ],
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.memberAccountManage.schema.searchSchema.submit',
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
          title: intl.formatMessage({
            id: 'payandSettle.amountAccountManage.memberAccountManage.schema.rechargeSchema.money',
          }),
          'x-component-props': {
            addonBefore: translate('web.common.currencySymbol'),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.amountAccountManage.memberAccountManage.schema.rechargeSchema.money.message',
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
          title: intl.formatMessage({
            id: 'payandSettle.amountAccountManage.memberAccountManage.schema.rechargeSchema.type',
          }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.amountAccountManage.memberAccountManage.schema.rechargeSchema.type.message',
              }),
            },
          ],
        },
      },
    },
  },
}
