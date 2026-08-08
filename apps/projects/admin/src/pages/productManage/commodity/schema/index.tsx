import type { ISchema } from '@apps/formily'
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
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: '商家名称',
              },
            },
            brandId: {
              type: 'string',
              'x-component': 'CustomInputSearch',
              'x-component-props': {
                placeholder: '商品品牌',
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
            status: {
              type: 'string',
              enum: [
                // {
                //   label: '待提交审核',
                //   value: 1,
                // },
                {
                  label: '待审核',
                  value: 2,
                },
                {
                  label: '审核不通过',
                  value: 3,
                },
                {
                  label: '审核通过',
                  value: 4,
                },
                {
                  label: '上架',
                  value: 5,
                },
                {
                  label: '下架',
                  value: 6,
                },
              ],
              'x-component-props': {
                placeholder: '商品状态',
                style: { width: '174px' },
              },
            },
            NO_NAME_FIELD_$2: {
              type: 'object',
              'x-component': 'layout',
              'x-component-props': {
                style: { width: '174px', display: 'flex', justifyContent: 'flex-start' },
              },
              properties: {
                min: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: '最低价',
                    type: 'number',
                    min: 0,
                    style: { width: '70px', textAlign: 'center', borderRight: 0 },
                  },
                },
                gap: {
                  type: 'string',
                  'x-component-props': {
                    style: {
                      width: '34px',
                      borderLeft: 0,
                      borderRight: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff',
                      textAlign: 'center',
                    },
                    placeholder: '~',
                    disabled: true,
                  },
                },
                max: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: '最高价',
                    type: 'number',
                    min: 0,
                    style: { width: '70px', textAlign: 'center', borderLeft: 0 },
                  },
                },
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

// 待审核商品列表高级搜索
export const productWillSchema: ISchema = {
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
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: '商家名称',
              },
            },
            brandId: {
              type: 'string',
              'x-component': 'CustomInputSearch',
              'x-component-props': {
                placeholder: '商品品牌',
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
            NO_NAME_FIELD_$2: {
              type: 'object',
              'x-component': 'layout',
              'x-component-props': {
                style: { width: '174px', display: 'flex', justifyContent: 'flex-start' },
              },
              properties: {
                min: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: '最低价',
                    type: 'number',
                    min: 0,
                    style: { width: '70px', textAlign: 'center', borderRight: 0 },
                  },
                },
                gap: {
                  type: 'string',
                  'x-component-props': {
                    style: {
                      width: '34px',
                      borderLeft: 0,
                      borderRight: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff',
                      textAlign: 'center',
                    },
                    placeholder: '~',
                    disabled: true,
                  },
                },
                max: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: '最高价',
                    type: 'number',
                    min: 0,
                    style: { width: '70px', textAlign: 'center', borderLeft: 0 },
                  },
                },
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
