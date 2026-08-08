/**
 * 加工商品schema
 */

import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const productSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'handling.order.search.product' }),
            align: 'flex-left',
            tip: intl.formatMessage({ id: 'handling.order.search.product.tips' }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            columns: 3,
          },
          properties: {
            customerCategoryId: {
              type: 'string',
              'x-component': 'Cascader',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.order.search.product.category' }),
                allowClear: true,
                style: {
                  width: '160px',
                  // margin: '0 20px 0 0'
                },
                fieldNames: { label: 'name', value: 'id', children: 'children' },
              },
            },
            brandId: {
              type: 'string',
              // 'x-component': 'Select',
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.order.search.product.brand' }),
                allowClear: true,
                showSearch: true,
                optionFilterProp: 'children',
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
