/**
 * 订单能力 - 送货计划协同 - 待确认送货计划 - Schema
 * @author: Gavin
 */
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const deliveryPlanCollaborationAwaitSchema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        planCode: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            allowClear: true,
            align: 'flex-left',
            placeholder: translate('web.resource.order.qingshurujihuabianhaochaxun'),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            digest: {
              type: 'string',
              'x-component-props': {
                allowClear: true,
                placeholder: translate('web.resource.order.jihuazhaiyao'),
              },
            },
            '[startTime, endTime]': {
              type: 'daterange',
              'x-component-props': {
                allowClear: true,
                placeholder: [
                  translate('web.resource.order.jihuakaishiriqi'),
                  translate('web.resource.order.jihuajieshuriqi'),
                ],
              },
            },
            supplyMember: {
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
