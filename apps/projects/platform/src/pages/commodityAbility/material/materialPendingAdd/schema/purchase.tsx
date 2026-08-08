import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

export const purchaseSchema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        userName: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'material.supplier.name', defaultMessage: '供应商名称' }),
            align: 'flex-left',
            // advanced: false
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            name: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'material.name', defaultMessage: '物料名称' }),
                allowClear: true,
              },
            },
            brandId: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'material.brand', defaultMessage: '品牌' }),
                allowClear: true,
                showSearch: true,
                style: { width: '150px' },
              },
            },
            categoryId: {
              type: 'string',
              'x-component': 'Cascader',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'material.category', defaultMessage: '品类' }),
                allowClear: true,
                style: { width: '150px' },
                showSearch: true,
                fieldNames: { label: 'name', value: 'id', children: 'children' },
              },
            },
            type: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'material.type', defaultMessage: '规格型号' }),
                allowClear: true,
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
