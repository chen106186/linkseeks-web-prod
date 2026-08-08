/**
 * 加工商品schema
 */

import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { ORDER_TYPE } from '@/constants/order'
import { getIntl } from '@linkseeks/i18n'

const ORDER_ENUM = ORDER_TYPE.filter(Boolean).map((_item, index) => ({
  label: _item,
  value: index + 1,
}))

const intl = getIntl()

export const orderSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        orderNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'handling.order.search.orderNo' }),
            align: 'flex-left',
            tip: intl.formatMessage({ id: 'handling.order.search.orderNo.tips' }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            inline: true,
            full: true,
          },
          properties: {
            orderThe: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.description' }),
              },
            },
            membersName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.purchasing.member' }),
              },
            },
            type: {
              type: 'string',
              enum: ORDER_ENUM,
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.order.type' }),
                allowClear: true,
                style: {
                  width: 150,
                },
              },
            },
            '[startCreateTime, endCreateTime]': {
              type: 'daterange',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'handling.order.search.startTime' }),
                  intl.formatMessage({ id: 'handling.order.search.endTime' }),
                ],
                style: {
                  width: '300px',
                },
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'common.button.search' }),
              },
            },
          },
        },
      },
    },
  },
}
