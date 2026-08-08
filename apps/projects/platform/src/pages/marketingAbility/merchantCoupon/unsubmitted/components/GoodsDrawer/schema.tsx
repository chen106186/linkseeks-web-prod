/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-24 16:19:18
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 19:49:02
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        commodityName: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'merchantCoupon.Search' }),
            align: 'flex-left',
            tip: intl.formatMessage({ id: 'merchantCoupon.inputNameSearch' }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 6,
          },
          properties: {
            customerCategoryId: {
              type: 'string',
              'x-component': 'CustomCategorySearch',
              'x-component-props': {
                placeholder: `${intl.formatMessage({ id: 'merchantCoupon.Commercial' })}`,
                showSearch: true,
                notFoundContent: null,
                dataoption: [],
                fieldNames: { label: 'name', value: 'id', children: 'children' },
                changeOnSelect: true,
                expandTrigger: 'hover',
              },
            },
            brandId: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({ id: 'merchantCoupon.productbrand' })}`,
                allowClear: true,
              },
            },
            submit: {
              type: 'string',
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'merchantCoupon.inquery' }),
              },
            },
          },
        },
      },
    },
  },
}
