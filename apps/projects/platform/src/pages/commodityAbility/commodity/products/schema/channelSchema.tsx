import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'

// 渠道商品列表高级搜索
export const channelSchema: ISchema = {
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
                placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.channelSchema.name' }),
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'wrap',
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
                style: { width: 174 },
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.channelSchema.memberName' }),
                style: { width: 174 },
              },
            },
            memberRoleName: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.channelSchema.memberRoleName' }),
                style: { width: 174 },
              },
            },
            brandId: {
              type: 'string',
              'x-component': 'CustomInputSearch',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.channelSchema.brandId' }),
                showSearch: true,
                showArrow: true,
                defaultActiveFirstOption: false,
                filterOption: false,
                notFoundContent: null,
                style: { width: 174 },
                searchValue: null,
                dataoption: [],
              },
            },
            customerCategoryId: {
              type: 'string',
              'x-component': 'CustomCategorySearch',
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'commodity.products.schema.channelSchema.customerCategoryId',
                }),
                showSearch: true,
                notFoundContent: null,
                style: { width: 174 },
                dataoption: [],
                fieldNames: { label: 'name', value: 'id', children: 'children' },
              },
            },
            source: {
              type: 'string',
              enum: [
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.channelSchema.source.1' }),
                  value: 1,
                },
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.channelSchema.source.2' }),
                  value: 2,
                },
              ],
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'commodity.products.schema.channelSchema.source.placeholder',
                }),
                style: { width: 174 },
              },
            },
            statusList: {
              type: 'string',
              enum: [
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.channelSchema.statusList.1' }),
                  value: 7,
                },
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.channelSchema.statusList.2' }),
                  value: 5,
                },
                {
                  label: getIntl().formatMessage({ id: 'commodity.products.schema.channelSchema.statusList.3' }),
                  value: 6,
                },
              ],
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'commodity.products.schema.channelSchema.statusList.placeholder',
                }),
                style: { width: 174 },
              },
            },
            // priceTypeList: {
            //   type: 'string',
            //   enum: [
            //     {
            //       label: '现货价格',
            //       value: 1,
            //     },
            //     // {
            //     //   label: '价格需要询价',
            //     //   value: 2,
            //     // },
            //     {
            //       label: '积分兑换商品',
            //       value: 3,
            //     }
            //   ],
            //   'x-component-props': {
            //     placeholder: '产品定价',
            //     // style: { width: '174px' },
            //   },
            // },
            '[min, max]': {
              type: 'number',
              'x-component': 'NumberRange',
              'x-component-props': {
                placeholder: [
                  getIntl().formatMessage({ id: 'commodity.products.schema.channelSchema.min' }),
                  getIntl().formatMessage({ id: 'commodity.products.schema.channelSchema.max' }),
                ],
                style: { width: '230px' },
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'commodity.products.schema.channelSchema.submit' }),
              },
            },
          },
        },
      },
    },
  },
}

// 添加渠道商品模态框高级筛选
export const addChannelSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.addChannelSchema.name' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        customerCategoryName: {
          type: 'string',
          // "x-component": 'SearchSelect',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.products.schema.addChannelSchema.customerCategoryName',
            }),
            // className: 'fixed-ant-selected-down',
            // fetchSearch: getProductSelectGetSelectCategory,
          },
        },
        brandName: {
          type: 'string',
          // "x-component": 'SearchSelect',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.addChannelSchema.brandName' }),
            // fetchSearch: getProductSelectGetSelectBrand,
          },
        },
        parentMemberId: {
          type: 'string',
          enum: [],
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'commodity.products.schema.addChannelSchema.parentMemberId' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: getIntl().formatMessage({ id: 'commodity.products.schema.addChannelSchema.submit' }),
          },
        },
      },
    },
  },
}
