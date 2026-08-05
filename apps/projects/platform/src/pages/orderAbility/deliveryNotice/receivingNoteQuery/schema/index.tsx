/**
 * 订单能力 -送货通知单协同 - 待确认送货通知单 - Schema
 * @author: Gavin
 */
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const receivingNoteQuerySchema: ISchema = {
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
            // ctl: {
            //   type: 'object',
            //   'x-component': 'Children',
            //   'x-component-props': {
            //     children: '{{controllerBtns}}',
            //   },
            // },
            receiveNo: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                allowClear: true,
                placeholder: translate('web.resource.order.qingshurushouhuodanhao'),
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
                placeholder: translate('web.resource.logistics.shouhuodanzhaiyao'),
              },
            },
            '[startDate, endDate]': {
              type: 'daterange',
              'x-component-props': {
                allowClear: true,
                placeholder: [
                  translate('web.resource.order.shouhuokaishiriqi'),
                  translate('web.resource.order.shouhuojieshuriqi'),
                ],
              },
            },
            vendorMemberName: {
              type: 'string',
              'x-component-props': {
                allowClear: true,
                placeholder: translate('web.resource.order.caigouhuiyuan'),
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: '查询',
              },
            },
          },
        },
      },
    },
  },
}
