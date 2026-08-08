import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'

export const schema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        applyNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'balance.components.writeOffDrawer.columns.applyNo',
              defaultMessage: '请款单号',
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
          justifyContent: 'flex-start',
          flexWrap: 'nowrap',
        },
        colStyle: {
          //改变间隔
          // marginRight: 20,
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
            rowStyle: {
              justifyContent: 'flex-start',
              flexWrap: 'nowrap',
            },
            colStyle: {
              //改变间隔
              marginRight: 20,
            },
          },
          properties: {
            applyAbstract: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'balance.businessRequestFundsCollaboration.detail.col.applyAbstract',
                  defaultMessage: '请款摘要',
                }),
              },
            },
            payee: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'balance.businessRequestFundsCollaboration.detail.col.payee',
                  defaultMessage: '收款方',
                }),
              },
            },
            '[createTimeStart,createTimeEnd]': {
              type: 'string',
              'x-component': 'daterange',
              'x-component-props': {
                placeholder: [
                  getIntl().formatMessage({ id: 'balance.createTimeStart', defaultMessage: '单据开始时间' }),
                  getIntl().formatMessage({ id: 'balance.createTimeEnd', defaultMessage: '单据结束时间' }),
                ],
              },
            },
            '[expectPayTimeStart,expectPayTimeEnd]': {
              type: 'string',
              'x-component': 'daterange',
              'x-component-props': {
                placeholder: [
                  getIntl().formatMessage({ id: 'balance.expectPayTimeStart', defaultMessage: '预计付款开始日期' }),
                  getIntl().formatMessage({ id: 'balance.expectPayTimeEnd', defaultMessage: '预计付款结束日期' }),
                ],
              },
            },
          },
        },
        sumbit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: getIntl().formatMessage({ id: 'dealAbility.chaxun' }),
          },
        },
      },
    },
  },
}
