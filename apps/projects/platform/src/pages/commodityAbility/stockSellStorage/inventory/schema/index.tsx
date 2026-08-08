import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getIntl } from '@linkseeks/i18n'
export const inventorySchema: ISchema = {
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
            materielName: {
              type: 'string',
              'x-component': 'Search',
              'x-mega-props': {},
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'stockSellStorage.sousuo',
                }),
                tip: getIntl().formatMessage({
                  id: 'stockSellStorage.shuruhuopinmingcheng',
                }),
                // align: 'flex-left',
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
            goodsNo: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'stockSellStorage.huohao',
                }),
                allowClear: true,
              },
            },
            specifications: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'stockSellStorage.guigexinghao',
                }),
                allowClear: true,
              },
            },
            category: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'stockSellStorage.pinlei',
                }),
                allowClear: true,
              },
            },
            brand: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'stockSellStorage.pinpai',
                }),
                allowClear: true,
              },
            },
            warehouseId: {
              type: 'string',
              'x-component-props': {
                style: { width: '150px' },
                allowClear: true,
                placeholder: getIntl().formatMessage({
                  id: 'stockSellStorage.cangku',
                }),
              },
              enum: [],
            },
            materialGroupId: {
              type: 'string',
              'x-component': 'Cascader',
              'x-component-props': {
                placeholder: '物料组',
                allowClear: true,
                fieldNames: { label: 'name', value: 'id', children: 'children' },
                style: { width: '150px' },
                showSearch: true,
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

export const safetyModalSchema: ISchema = {
  type: 'object',
  properties: {
    MEAGLAYOUT: {
      type: 'object',
      'x-component': 'Mega-Layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        safetyInvoices: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'stockSellStorage.anquankucun' }),
          required: true,
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'stockSellStorage.qingshuru',
            }),
          },
          'x-rules': [
            {
              pattern: PATTERN_MAPS.weight,
              message: getIntl().formatMessage({
                id: 'stockSellStorage.qingshuruzhengshu',
              }),
            },
          ],
        },
      },
    },
  },
}
