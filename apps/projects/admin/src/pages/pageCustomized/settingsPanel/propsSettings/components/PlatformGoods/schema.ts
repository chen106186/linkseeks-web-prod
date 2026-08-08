import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

// 商品列表高级搜索
export const productSchema: ISchema = {
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
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: '商品名称',
                align: 'flex-left',
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              justifyContent: 'flex-start',
              flexWrap: 'nowrap',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            categoryId: {
              type: 'string',
              'x-component': 'CustomCategorySearch',
              'x-component-props': {
                placeholder: '平台品类',
                showSearch: true,
                notFoundContent: null,
                style: { width: '174px' },
                dataoption: [],
                fieldNames: { label: 'name', value: 'id', children: 'children' },
              },
            },
            brandId: {
              type: 'string',
              'x-component': 'CustomInputSearch',
              'x-component-props': {
                placeholder: '商品品牌',
                showSearch: true,
                notFoundContent: null,
                style: { width: '174px' },
                dataoption: [],
                fieldNames: { label: 'brandName', value: 'brandId' },
                // showSearch: true,
                // showArrow: true,
                // defaultActiveFirstOption: false,
                // filterOption: false,
                // notFoundContent: null,
                // style: { width: '174px' },
                // searchValue: null,
                // dataoption: [],
                // fieldNames: { label: 'brandName', value: 'brandId'},
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: '供应会员',
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
