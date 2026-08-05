/**
 * 订单能力 - 送货通知单管理 - 送货通知单查询 - Schema
 * @author: Gavin
 */
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const deliveryNoticeManagementQuerySchema: ISchema = {
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
            noticeNo: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                allowClear: true,
                placeholder: translate('web.resource.order.qingshurutongzhidanhao'),
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
                placeholder: translate('web.resource.order.tongzhidanzhaiyao'),
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
            memberName: {
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
                children: translate('web.common.chaxun'),
              },
            },
          },
        },
      },
    },
  },
}
