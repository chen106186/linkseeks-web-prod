import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getProductSelectGetSelectBrand } from '@apps/apis'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
// 列表高级筛选
export const schema: ISchema = {
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
                placeholder: getIntl().formatMessage({
                  id: 'priceManage.schema.schema.name',
                }),
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
            commodityName: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'priceManage.schema.schema.commodityName',
                }),
                style: { width: '174px' },
              },
            },
            // priceType: {
            //   type: 'string',
            //   enum: [
            //     {
            //       label: getIntl().formatMessage({
            //         id: 'priceManage.schema.schema.priceType.1',
            //       }),
            //       value: 0,
            //     },
            //     {
            //       label: getIntl().formatMessage({
            //         id: 'priceManage.schema.schema.priceType.2',
            //       }),
            //       value: 1,
            //     },
            //     {
            //       label: getIntl().formatMessage({
            //         id: 'priceManage.schema.schema.priceType.3',
            //       }),
            //       value: 2,
            //     },
            //     // {
            //     //   label: '积分兑换商品',
            //     //   value: 3,
            //     // }
            //   ],
            //   'x-component-props': {
            //     placeholder: getIntl().formatMessage({
            //       id: 'priceManage.schema.schema.priceType',
            //     }),
            //     allowClear: true,
            //     style: { width: '174px' },
            //   },
            // },
            brandId: {
              type: 'string',
              'x-component': 'CustomInputSearch',
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'priceManage.schema.schema.brandId',
                }),
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
                  id: 'priceManage.schema.schema.customerCategoryId',
                }),
                showSearch: true,
                notFoundContent: null,
                style: { width: '174px' },
                dataoption: [],
                fieldNames: {
                  label: 'name',
                  value: 'id',
                  children: 'children',
                },
              },
            },
            '[min, max]': {
              type: 'number',
              'x-component': 'NumberRange',
              'x-component-props': {
                placeholder: [
                  getIntl().formatMessage({
                    id: 'priceManage.schema.schema.min',
                  }),
                  getIntl().formatMessage({
                    id: 'priceManage.schema.schema.max',
                  }),
                ],
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({
                  id: 'priceManage.schema.schema.submit',
                }),
              },
            },
          },
        },
      },
    },
  },
}

// 设置价格 schema
export const setPriceSchema: ISchema = {
  type: 'object',
  properties: {
    STRATEGY_TABS: {
      type: 'object',
      'x-component': 'tab',
      'x-component-props': {
        type: 'card',
      },
      properties: {
        'tab-1': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({
              id: 'priceManage.schema.setPriceSchema.tab-1',
            }),
          },
          properties: {
            MEGA_LAYOUT1: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 8,
                labelAlign: 'left',
              },
              properties: {
                name: {
                  type: 'string',
                  title: '{{questionNameLabel}}',
                  'x-component-props': {
                    placeholder: getIntl().formatMessage({
                      id: 'priceManage.schema.setPriceSchema.name',
                    }),
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: getIntl().formatMessage({
                        id: 'priceManage.schema.setPriceSchema.name.rule',
                      }),
                    },
                    {
                      limitByte: true,
                      maxByte: 60,
                    },
                  ],
                },
                shopId: {
                  type: 'number',
                  enum: [],
                  title: getIntl().formatMessage({
                    id: 'priceManage.schema.setPriceSchema.shopId',
                  }),
                  'x-component-props': {
                    disabled: false,
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: getIntl().formatMessage({
                        id: 'member.management.import.query.form.placeholder-select',
                      }),
                    },
                  ],
                },
                priceType: {
                  type: 'radio',
                  title: '{{questionPriceTypeLabel}}',
                  required: true,
                  enum: [
                    {
                      label: getIntl().formatMessage({
                        id: 'priceManage.schema.setPriceSchema.priceType.1',
                      }),
                      value: 1,
                    },
                    // {
                    //   label: getIntl().formatMessage({
                    //     id: 'priceManage.schema.setPriceSchema.priceType.2',
                    //   }),
                    //   value: 2,
                    // },
                  ],
                  default: 1,
                  'x-component-props': {
                    disabled: false,
                  },
                },
                productName: {
                  type: 'string',
                  title: getIntl().formatMessage({
                    id: 'priceManage.schema.setPriceSchema.productName',
                  }),
                  'x-mega-props': {
                    full: true,
                  },
                  'x-component-props': {
                    disabled: true,
                    addonAfter: '{{connectProduct}}',
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: getIntl().formatMessage({
                        id: 'member.management.import.query.form.placeholder-select',
                      }),
                    },
                  ],
                },
                productId: {
                  type: 'string',
                  display: false,
                },
                minOrder: {
                  type: 'number',
                  display: false,
                },
              },
            },
          },
        },
        'tab-2': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({
              id: 'priceManage.schema.setPriceSchema.tab-2',
            }),
          },
          properties: {
            MEGA_LAYOUT2: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                labelAlign: 'left',
              },
              properties: {
                memberUnitPriceList: {
                  type: 'array',
                  'x-component': 'MultTable',
                  'x-component-props': {
                    rowKey: 'id',
                    columns: '{{columnsUnitProduct}}',
                    prefix: '{{batchPriceButton}}',
                    pagination: false,
                  },
                },
              },
            },
          },
        },
        'tab-3': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({
              id: 'priceManage.schema.setPriceSchema.tab-3',
            }),
          },
          properties: {
            MEGA_LAYOUT3: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                labelAlign: 'left',
              },
              properties: {
                applyType: {
                  title: translate('web.resource.commodity.shiyongleixing'),
                  'x-component': 'RadioGroup',
                  enum: [
                    { label: translate('web.resource.member.huiyuan'), value: 1 },
                    { label: translate('web.resource.member.level'), value: 2 },
                  ],
                  default: 1,
                },
                // 选择会员数据字段
                commodityMemberList: {
                  type: 'array:number',
                  visible: false,
                  'x-component': 'MultTable',
                  'x-component-props': {
                    rowKey: 'memberId',
                    columns: '{{memberColumns}}',
                    prefix: '{{tableAddMemberButton}}',
                  },
                },
                // 选择会员等级数据字段
                commodityMemberLevelList: {
                  type: 'array:number',
                  visible: false,
                  'x-component': 'MultTable',
                  'x-component-props': {
                    rowKey: 'levelId',
                    columns: '{{memberLevelColumns}}',
                    prefix: '{{tableAddMemberLevelButton}}',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}

// 选择商品和会员高级筛选
export const formSearchMemberLevel: ISchema = {
  type: 'object',
  properties: {
    levelTag: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: getIntl().formatMessage({
          id: 'priceManage.schema.formSearch.levelTag',
        }),
        align: 'flex-left',
        advanced: false,
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
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: getIntl().formatMessage({
              id: 'priceManage.schema.formSearch.submit',
            }),
          },
        },
      },
    },
  },
}
export const formSearch: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: getIntl().formatMessage({
          id: 'priceManage.schema.formSearch.name',
        }),
        align: 'flex-left',
        advanced: false,
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
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: getIntl().formatMessage({
              id: 'priceManage.schema.formSearch.submit',
            }),
          },
        },
      },
    },
  },
}
export const formProduct: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: getIntl().formatMessage({
          id: 'priceManage.schema.formProduct.submit',
        }),
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
        customerCategoryId: {
          type: 'string',
          'x-component': 'CustomCategorySearch',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'priceManage.schema.formProduct.customerCategoryId',
            }),
            showSearch: true,
            notFoundContent: null,
            style: { width: '174px' },
            dataoption: [],
            fieldNames: { label: 'name', value: 'id', children: 'children' },
          },
        },
        brandId: {
          type: 'string',
          'x-component': 'SearchSelect',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'priceManage.schema.formProduct.brandId',
            }),
            fetchSearch: getProductSelectGetSelectBrand,
            style: {
              width: 160,
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: getIntl().formatMessage({
              id: 'priceManage.schema.formProduct.submit',
            }),
          },
        },
      },
    },
  },
}

// 价格库
export const librarySearch: ISchema = {
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
            code: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                align: 'flex-left',
                placeholder: getIntl().formatMessage({ id: 'priceManage.schema.formProduct.wuliaobianhao' }),
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
                placeholder: getIntl().formatMessage({ id: 'priceManage.schema.formProduct.wuliaomingcheng' }),
              },
            },
            customerCategoryId: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'priceManage.schema.formProduct.pinlei' }),
              },
            },
            uppreMemberName: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'priceManage.schema.formProduct.gongyinghuiyuanmingcheng' }),
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({
                  id: 'priceManage.schema.schema.submit',
                }),
              },
            },
          },
        },
      },
    },
  },
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
            commodityId: {
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
