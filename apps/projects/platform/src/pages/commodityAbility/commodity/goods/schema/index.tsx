import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'

export const goodsSchema: ISchema = {
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
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.goods.schema.goodsSchema.materialName' }),
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
            code: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.goods.schema.goodsSchema.materialCode' }),
              },
            },
            brandId: {
              type: 'string',
              'x-component': 'CustomInputSearch',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.goods.schema.goodsSchema.brandId' }),
                showSearch: true,
                showArrow: true,
                defaultActiveFirstOption: false,
                filterOption: false,
                notFoundContent: null,
                style: { width: '174px' },
                searchValue: null,
                dataoption: [],
              },
            },
            customerCategoryId: {
              type: 'string',
              'x-component': 'CustomCategorySearch',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.goods.schema.goodsSchema.customerCategoryId' }),
                showSearch: true,
                notFoundContent: null,
                style: { width: '174px' },
                dataoption: [],
                fieldNames: { label: 'name', value: 'id', children: 'children' },
              },
            },
            materialGroupId: {
              type: 'string',
              'x-component': 'CustomCategorySearch',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.goods.schema.goodsSchema.goodsGroupId' }),
                showSearch: true,
                notFoundContent: null,
                style: { width: '174px' },
                dataoption: [],
                fieldNames: { label: 'name', value: 'id', children: 'children' },
              },
            },
            batch: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.goods.schema.goodsSchema.batch' }),
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'commodity.goods.schema.goodsSchema.submit' }),
              },
            },
          },
        },
      },
    },
  },
}
