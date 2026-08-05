import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
export const billsSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
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
            invoicesNo: {
              type: 'string',
              'x-component': 'Search',
              'x-mega-props': {},
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.sousuo' }),
                tip: getIntl().formatMessage({ id: 'stockSellStorage.shurudanjuhao' }),
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
            invoicesAbstract: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.danjuzhaiyao' }),
                style: {
                  width: 160,
                },
              },
            },
            invoicesTypeId: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.danjuleixing' }),
                allowClear: true,
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
            warehouseId: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.duiyingcangku' }),
                allowClear: true,
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
            '[invoicesTimeStart, invoicesTimeEnd]': {
              type: 'string',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.jiaoyishijian' }),
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'stockSellStorage.chaxun' }),
              },
            },
          },
        },
      },
    },
  },
}
