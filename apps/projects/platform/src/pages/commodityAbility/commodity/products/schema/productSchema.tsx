import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
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
                placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.name' }),
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
              visibility: 'hidden',
            },
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            productId: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.productId' }),
              },
            },
            priceTypeList: {
              type: 'string',
              enum: [
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.priceTypeList.1' }),
                  value: 1,
                },
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.priceTypeList.2' }),
                  value: 2,
                },
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.priceTypeList.3' }),
                  value: 3,
                },
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.priceTypeList.4' }),
                  value: 4,
                },
              ],
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'commodity.products.schema.productSchema.priceTypeList.placeholder',
                }),
                style: { width: '174px' },
                getPopupContainer: () => document.querySelector('main'),
              },
            },
            brandId: {
              type: 'string',
              'x-component': 'CustomInputSearch',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.brandId' }),
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
                placeholder: getIntl().formatMessage({
                  id: 'commodity.products.schema.productSchema.customerCategoryId',
                }),
                showSearch: true,
                notFoundContent: null,
                style: { width: '174px' },
                dataoption: [],
                fieldNames: { label: 'name', value: 'id', children: 'children' },
              },
            },
            statusList: {
              type: 'string',
              enum: [
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.1' }),
                  value: 1,
                },
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.2' }),
                  value: 2,
                },
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.3' }),
                  value: 3,
                },
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.4' }),
                  value: 4,
                },
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.5' }),
                  value: 5,
                },
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.6' }),
                  value: 6,
                },
              ],
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'commodity.products.schema.productSchema.statusList.placeholder',
                }),
                style: { width: '174px' },
                getPopupContainer: () => document.querySelector('main'),
              },
            },
            '[min, max]': {
              type: 'number',
              'x-component': 'NumberRange',
              'x-component-props': {
                placeholder: [
                  getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.min' }),
                  getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.max' }),
                ],
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.submit' }),
              },
            },
          },
        },
      },
    },
  },
}

export const getSchema = (extraSchema?: any) => {
  const schema: ISchema = {
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
                  placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.name' }),
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              colStyle: {
                marginLeft: 20,
              },
            },
            properties: {
              productId: {
                type: 'string',
                'x-component-props': {
                  placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.productId' }),
                },
              },
              priceTypeList: {
                type: 'string',
                enum: [
                  {
                    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.priceTypeList.1' }),
                    value: 1,
                  },
                  {
                    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.priceTypeList.2' }),
                    value: 2,
                  },
                  {
                    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.priceTypeList.3' }),
                    value: 3,
                  },
                  {
                    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.priceTypeList.4' }),
                    value: 4,
                  },
                ],
                'x-component-props': {
                  placeholder: getIntl().formatMessage({
                    id: 'commodity.products.schema.productSchema.priceTypeList.placeholder',
                  }),
                  style: { width: '174px' },
                  allowClear: true,
                },
              },
              brandId: {
                type: 'string',
                'x-component': 'CustomInputSearch',
                'x-component-props': {
                  placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.brandId' }),
                  showSearch: true,
                  showArrow: true,
                  defaultActiveFirstOption: false,
                  filterOption: false,
                  notFoundContent: null,
                  style: { width: '174px' },
                  searchValue: null,
                  dataoption: [],
                  allowClear: true,
                },
              },
              customerCategoryId: {
                type: 'string',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: getIntl().formatMessage({
                    id: 'commodity.products.schema.productSchema.customerCategoryId',
                  }),
                  showSearch: true,
                  style: { width: '174px' },
                  fieldNames: { label: 'name', value: 'id', children: 'children' },
                },
              },
              statusList: {
                type: 'string',
                enum: [
                  {
                    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.1' }),
                    value: 1,
                  },
                  {
                    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.2' }),
                    value: 2,
                  },
                  {
                    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.3' }),
                    value: 3,
                  },
                  {
                    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.4' }),
                    value: 4,
                  },
                  {
                    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.5' }),
                    value: 5,
                  },
                  {
                    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.6' }),
                    value: 6,
                  },
                ],
                'x-component-props': {
                  placeholder: getIntl().formatMessage({
                    id: 'commodity.products.schema.productSchema.statusList.placeholder',
                  }),
                  style: { width: '174px' },
                  allowClear: true,
                },
              },
              '[min, max]': {
                type: 'number',
                'x-component': 'NumberRange',
                'x-component-props': {
                  placeholder: [
                    getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.min' }),
                    getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.max' }),
                  ],
                },
              },
              ...extraSchema,
              submit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.submit' }),
                },
              },
            },
          },
        },
      },
    },
  }
  return schema
}

export const mixSchema = (data: any) => {
  const schema: ISchema = {}
  for (let key in data) {
    if (data[key].type === 1) {
      //单选
      schema[`customerCategoryId${data[key].id}t${data[key].type}`] = {
        type: 'string',
        enum: data[key].attributeValueList,
        'x-component-props': {
          placeholder: data[key].name,
          allowClear: true,
          showSearch: true,
          style: { width: '150px' },
          fieldNames: { label: 'value', value: 'id' },
        },
      }
    } else if (data[key].type === 2) {
      //多选
      schema[`customerCategoryId${data[key].id}t${data[key].type}`] = {
        type: 'string',
        enum: data[key].attributeValueList,
        'x-component-props': {
          placeholder: data[key].name,
          allowClear: true,
          showSearch: true,
          style: { width: '150px' },
          fieldNames: { label: 'value', value: 'id' },
        },
      }
    } else {
      //3 -输入
      schema[`customerCategoryId${data[key].id}t${data[key].type}`] = {
        type: 'string',
        'x-component-props': {
          placeholder: data[key].name,
          allowClear: true,
        },
      }
    }
  }
  return schema
}

// 快捷修改单价高级筛选
export const fastSchema: ISchema = {
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
                placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.fastSchema.name' }),
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
            productId: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.productId' }),
              },
            },
            priceTypeList: {
              type: 'string',
              enum: [
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.fastSchema.priceTypeList.1' }),
                  value: 0,
                },
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.fastSchema.priceTypeList.2' }),
                  value: 1,
                },
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.fastSchema.priceTypeList.3' }),
                  value: 3,
                },
              ],
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'commodity.products.schema.fastSchema.priceTypeList.placeholder',
                }),
                style: { width: '174px' },
              },
            },
            brandId: {
              type: 'string',
              'x-component': 'CustomInputSearch',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.fastSchema.brandId' }),
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
                placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.fastSchema.customerCategoryId' }),
                showSearch: true,
                notFoundContent: null,
                style: { width: '174px' },
                dataoption: [],
                fieldNames: { label: 'name', value: 'id', children: 'children' },
              },
            },
            '[min, max]': {
              type: 'number',
              'x-component': 'NumberRange',
              'x-component-props': {
                placeholder: [
                  getIntl().formatMessage({ id: 'commodity.products.schema.fastSchema.min' }),
                  getIntl().formatMessage({ id: 'commodity.products.schema.fastSchema.max' }),
                ],
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'commodity.products.schema.fastSchema.submit' }),
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
                placeholder: getIntl().formatMessage({ id: 'commodity.checkProduct.schema.name' }),
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
            productId: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.productId' }),
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.checkProduct.schema.memberName' }),
              },
            },
            brandId: {
              type: 'string',
              'x-component': 'CustomInputSearch',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.checkProduct.schema.brandId' }),
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
                placeholder: getIntl().formatMessage({ id: 'commodity.checkProduct.schema.categoryId' }),
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
                    placeholder: getIntl().formatMessage({ id: 'commodity.checkProduct.schema.min' }),
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
                    placeholder: getIntl().formatMessage({ id: 'commodity.checkProduct.schema.max' }),
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
                children: getIntl().formatMessage({ id: 'commodity.checkProduct.schema.submit' }),
              },
            },
          },
        },
      },
    },
  },
}
