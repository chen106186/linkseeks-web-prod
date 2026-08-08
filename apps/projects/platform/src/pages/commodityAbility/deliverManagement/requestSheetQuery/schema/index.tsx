import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'
import { getIntl } from '@linkseeks/i18n'

const translate = getWebIntl()
export const requestSheetQuerySchema = (site?: string) => {
  return {
    type: 'object',
    properties: {
      mageLayout: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          topLayout: {
            type: 'object',
            'x-component': 'Mega-Layout',
            'x-component-props': {
              grid: false,
              className: 'useMegaStart',
            },
            properties: {
              ctl: {
                type: 'object',
                'x-component': 'Children',
                'x-component-props': {
                  children: '{{controllerBtns}}',
                },
                display: false,
              },
              deliveryNo: {
                type: 'string',
                'x-component': 'Search',
                'x-component-props': {
                  allowClear: true,
                  placeholder: translate('web.resource.commodity.tip_songyangxuqiudanhao'),
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
                  placeholder: '供应商',
                },
              },
              outerStatus: {
                type: 'string',
                'x-component-props': {
                  placeholder: getIntl().formatMessage({ id: 'table.purchase.externalStatus' }),
                  style: {
                    width: 160,
                  },
                },
                display: !site,
                enum: [],
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
}
