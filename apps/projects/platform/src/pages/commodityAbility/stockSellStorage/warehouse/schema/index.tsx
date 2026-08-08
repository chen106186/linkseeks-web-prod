import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getIntl } from '@linkseeks/i18n'
export const warehouseSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        search: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'stockSellStorage.sousuo' }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          visible: false,
          'x-component-props': {
            inline: true,
          },
          properties: {
            invoicesNo: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.danjuhao' }),
                style: {
                  width: 160,
                },
              },
            },
            invoicesAbstract: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.danjuzhaiyao' }),
                style: {
                  width: 160,
                },
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.huiyuanmingcheng' }),
                style: {
                  width: 160,
                },
              },
            },
            orderNo: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.dingdanhao' }),
                style: {
                  width: 160,
                },
              },
            },
            invoicesType: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.qingxuanzedanjuleixing' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
            inventory: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.qingxuanzeduiyingcangku' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
            state: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.qingxuanzedanjuzhuangtai' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
            time: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.qingxuanzejiaoyishijian' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
          },
        },
      },
    },
  },
}

export const searchSchema: ISchema = {
  type: 'object',
  properties: {
    searchWrap: {
      type: 'object',
      'x-component': 'Mega-Layout',
      'x-component-props': {
        grid: true,
      },
      properties: {
        actions: {
          type: 'object',
          'x-component': 'Children',
          'x-component-props': {
            children: '{{Actions}}',
          },
        },
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'stockSellStorage.sousuo' }),
            tip: getIntl().formatMessage({ id: 'stockSellStorage.shurucangkumingcheng' }),
            advanced: false,
          },
        },
      },
    },
  },
}
