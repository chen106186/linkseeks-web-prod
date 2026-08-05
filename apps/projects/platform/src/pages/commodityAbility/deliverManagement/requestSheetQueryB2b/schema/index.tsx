import type { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
export const requestSheetQuery: ISchema = {
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
            ctl: {
              type: 'object',
              'x-component': 'Children',
              'x-component-props': {
                children: '{{controllerBtns}}',
              },
            },
            deliveryNo: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                allowClear: true,
                placeholder: translate('web.resource.commodity.tip_xuqiudanhaochaxun'),
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
            },
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            summary: {
              type: 'string',
              'x-component-props': {
                allowClear: true,
                placeholder: '送样需求单摘要',
              },
            },
            '[demandDateStart, demandDateEnd]': {
              type: 'daterange',
              'x-component-props': {
                allowClear: true,
                placeholder: ['需求开始日期', '需求结束日期'],
              },
            },
            vendorMemberName: {
              type: 'string',
              'x-component-props': {
                allowClear: true,
                placeholder: '供应商会员名称',
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
