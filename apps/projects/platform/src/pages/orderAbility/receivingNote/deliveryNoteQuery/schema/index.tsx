/**
 * 订单能力 - 收货单 - 送货单查询 - Schema
 * @author: Gavin
 */
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const deliveryNoteQuerySchema: ISchema = {
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
            className: 'useMegaStart',
          },
          properties: {
            deliveryNo: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                allowClear: true,
                placeholder: translate('web.resource.order.qingshurusonghuodanhaochaxun'),
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
              justifyContent: 'flex-end',
            },
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            digest: {
              type: 'string',
              'x-component-props': {
                allowClear: true,
                placeholder: translate('web.resource.logistics.songhuodanzhaiyao'),
              },
            },
            '[startDate, endDate]': {
              type: 'daterange',
              'x-component-props': {
                allowClear: true,
                placeholder: [
                  translate('web.resource.order.songhuokaishiriqi'),
                  translate('web.resource.order.songhuojieshuriqi'),
                ],
              },
            },
            buyerMemberName: {
              type: 'string',
              'x-component-props': {
                allowClear: true,
                placeholder: translate('web.resource.member.gongyinghuiyuan'),
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: translate('web.common.chaxun'),
              },
            },
          },
        },
      },
    },
  },
}
