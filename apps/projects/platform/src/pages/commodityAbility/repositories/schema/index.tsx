import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { GlobalConfig } from '@/global/config'
import { SHOP_TYPES } from '@/constants'
import { padRequiredMessage } from '@/utils'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
// 将获取的商城转化为可用类型
const getShopTypeMap = (() => {
  console.log(SHOP_TYPES)
  return SHOP_TYPES
  // return GlobalConfig.web.shopInfo.reduce((prev, next) => {
  //   const shopTypeEnumValue = SHOP_TYPES.find((v) => v.value === next.type)
  //   if (!shopTypeEnumValue) {
  //     return prev
  //   }
  //   if (!prev.find((v) => v.value === shopTypeEnumValue.value)) {
  //     prev.push(shopTypeEnumValue)
  //   }
  //   return prev
  // }, [])
})()

export const repositSchema: ISchema = padRequiredMessage({
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
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-mega-props': {},
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'repositories.schema.repositSchema.name' }),
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
            id: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'repositories.schema.repositSchema.id' }),
              },
            },
            state: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'repositories.schema.repositSchema.state' }),
                allowClear: true,
                style: {
                  width: 160,
                },
              },
              enum: [
                { label: getIntl().formatMessage({ id: 'repositories.schema.repositSchema.state.1' }), value: 1 },
                { label: getIntl().formatMessage({ id: 'repositories.schema.repositSchema.state.2' }), value: 0 },
              ],
            },
            productSkuName: {
              type: 'string',
              'x-component-props': {
                allowClear: true,
                placeholder: translate('web.resource.commodity.guishushangpinguige'),
              },
            },
            productName: {
              type: 'string',
              'x-component-props': {
                allowClear: true,
                placeholder: translate('web.resource.commodity.name'),
              },
            },
            brand: {
              type: 'string',
              'x-component': 'CustomInputSearch',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'repositories.schema.repositSchema.brand' }),
                showSearch: true,
                showArrow: true,
                defaultActiveFirstOption: false,
                filterOption: false,
                notFoundContent: null,
                style: { width: '160px' },
                searchValue: null,
                dataoption: [],
              },
            },
            category: {
              type: 'string',
              'x-component': 'CustomCategorySearch',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'repositories.schema.repositSchema.category' }),
                showSearch: true,
                notFoundContent: null,
                style: { width: '174px' },
                dataoption: [],
                fieldNames: { label: 'name', value: 'id', children: 'children' },
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'repositories.schema.repositSchema.submit' }),
              },
            },
          },
        },
      },
    },
  },
})

// 新增仓位
export const repositDetailSchema: ISchema = padRequiredMessage({
  type: 'object',
  properties: {
    REPOSIT_TABS: {
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
            tab: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.tab.1' }),
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
                  // 'x-component': 'Input',
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.name' }),
                  'x-component-props': {
                    placeholder: getIntl().formatMessage({
                      id: 'repositories.schema.repositDetailSchema.name.placeholder',
                    }),
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.name.message' }),
                    },
                    {
                      limitByte: true,
                      maxByte: 60,
                    },
                  ],
                },
                shopType: {
                  type: 'number',
                  default: 1,
                  display: false,
                },
                warehouseId: {
                  type: 'string',
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.warehouseId' }),
                  enum: [],
                  'x-component-props': {
                    allowClear: true,
                  },
                },
                productSkuName: {
                  type: 'string',
                  display: false,
                },
                productName: {
                  type: 'string',
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.productName' }),
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
                      message: getIntl().formatMessage({ id: 'common.text.pleaseSelect' }),
                    },
                  ],
                },
                category: {
                  type: 'string',
                  display: false,
                },
                brand: {
                  type: 'string',
                  display: false,
                },
                unit: {
                  type: 'string',
                  display: false,
                },
                productId: {
                  type: 'string',
                  display: false,
                },
                materielName: {
                  type: 'string',
                  'x-component': 'Text',
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.materialName' }),
                  default: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.goodsName.default' }),
                },
                itemNo: {
                  type: 'string',
                  'x-component': 'Text',
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.itemNo' }),
                  default: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.itemNo.default' }),
                  visible: false,
                },
                materielId: {
                  type: 'string',
                  'x-component': 'Text',
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.goodsId' }),
                  default: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.goodsId.default' }),
                  visible: false,
                },
                NO_SUBMIT3: {
                  type: 'string',
                  'x-component': 'Text',
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.noSUBMIT4' }),
                },
                upperStockCount: {
                  type: 'string',
                  'x-component': 'Text',
                  title: (
                    <span>
                      {translate('web.resource.commodity.shangyoushanpingkucun')}&ensp;
                      <Tooltip title={translate('web.resource.commodity.shangyouTip')}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </span>
                  ),
                },
                inventory: {
                  type: 'number',
                  'x-mega-props': {
                    full: true,
                  },
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.inventory' }),
                  'x-rules': [
                    {
                      required: true,
                      message: getIntl().formatMessage({ id: 'common.form.input.placeholder' }),
                    },
                    {
                      // validator: value => {
                      //   return value > Number.MAX_SAFE_INTEGER
                      // },
                      pattern: /^[0-9]{1,8}$/,
                      message: getIntl().formatMessage({
                        id: 'repositories.schema.repositDetailSchema.inventory.message.1',
                      }),
                    },
                    {
                      pattern: /^\d+(\.\d{1,3})?$/,
                      message: getIntl().formatMessage({
                        id: 'repositories.schema.repositDetailSchema.inventory.message.2',
                      }),
                    },
                  ],
                },
                // inventoryDeductWay: {
                //   type: 'radio',
                //   title: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.inventoryDeductWay' }),
                //   "x-rules": [
                //     {
                //       required: true,
                //       message: getIntl().formatMessage({ id: 'common.form.input.placeholder' })
                //     }
                //   ],
                //   enum: [
                //     {
                //       label: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.inventoryDeductWay.1' }),
                //       value: 1
                //     },
                //     // {
                //     //   label: '按仓库位置远近扣除',
                //     //   value: 2
                //     // }
                //   ],
                //   default: 1
                // },
                // upperMemberName: {
                //   type: 'string',
                //   title: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.upperMemberName' }),
                //   "x-component": 'Text',
                //   default: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.upperMemberName.default' })
                // },
                // upperStockCount: {
                //   type: 'number',
                //   title: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.upperStockCount' }),
                //   "x-component": 'Text',
                //   default: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.upperStockCount.default' })
                // },
              },
            },
          },
        },
        'tab-2': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.tab.2' }),
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
                shopIds: {
                  type: 'array:number',
                  'x-component': 'CardCheckBox',
                  'x-component-props': {
                    dataSource: [],
                  },
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.shopIds' }),
                  'x-rules': [
                    {
                      required: true,
                      message: getIntl().formatMessage({ id: 'common.text.pleaseSelect' }),
                    },
                  ],
                },
              },
            },
          },
        },
        'tab-3': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.tab.3' }),
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
                isAllMemberShare: {
                  type: 'radio',
                  enum: [
                    {
                      label: getIntl().formatMessage({
                        id: 'repositories.schema.repositDetailSchema.isAllMemberShare.1',
                      }),
                      value: 1,
                    },
                    {
                      label: getIntl().formatMessage({
                        id: 'repositories.schema.repositDetailSchema.isAllMemberShare.2',
                      }),
                      value: 0,
                    },
                  ],
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositDetailSchema.isAllMemberShare' }),
                  default: 1,
                  required: true,
                  'x-linkages': [
                    {
                      type: 'value:visible',
                      target: 'applyMember',
                      condition: '{{!$value}}',
                    },
                  ],
                },
                applyMember: {
                  type: 'array:number',
                  'x-component': 'MultTable',
                  'x-component-props': {
                    rowKey: 'memberId',
                    columns: '{{tableColumns}}',
                    prefix: '{{tableAddButton}}',
                    pagination: {
                      onChange: '{{paginationChange}}',
                      total: '{{membersLength}}',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
})

// 批量新增仓位
export const batchRepositDetailSchema: ISchema = padRequiredMessage({
  type: 'object',
  properties: {
    REPOSIT_TABS: {
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
            tab: getIntl().formatMessage({ id: 'repositories.schema.batchRepositDetailSchema.tab.1' }),
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
                shopType: {
                  type: 'number',
                  default: 1,
                  display: false,
                },
                warehouseId: {
                  type: 'string',
                  title: getIntl().formatMessage({ id: 'repositories.schema.batchRepositDetailSchema.warehouseId' }),
                  enum: [],
                  'x-component-props': {
                    allowClear: true,
                  },
                },
                inventory: {
                  type: 'number',
                  'x-mega-props': {
                    full: true,
                  },
                  title: getIntl().formatMessage({ id: 'repositories.schema.batchRepositDetailSchema.inventory' }),
                  'x-rules': [
                    {
                      required: true,
                      message: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}`,
                    },
                    {
                      // validator: value => {
                      //   return value > Number.MAX_SAFE_INTEGER
                      // },
                      pattern: /^[0-9]{1,8}$/,
                      message: getIntl().formatMessage({
                        id: 'repositories.schema.batchRepositDetailSchema.inventory.message.1',
                      }),
                    },
                    {
                      pattern: /^\d+(\.\d{1,3})?$/,
                      message: getIntl().formatMessage({
                        id: 'repositories.schema.batchRepositDetailSchema.inventory.message.2',
                      }),
                    },
                  ],
                },
                // inventoryDeductWay: {
                //   type: 'radio',
                //   title: getIntl().formatMessage({ id: 'repositories.schema.batchRepositDetailSchema.inventoryDeductWay' }),
                //   'x-rules': [{
                //     required: true,
                //     message: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}`
                //   }],
                //   enum: [
                //     {
                //       label: getIntl().formatMessage({ id: 'repositories.schema.batchRepositDetailSchema.inventoryDeductWay.1' }),
                //       value: 1
                //     },
                //     // {
                //     //   label: '按仓库位置远近扣除',
                //     //   value: 2
                //     // }
                //   ],
                //   default: 1
                // }
              },
            },
          },
        },
        'tab-2': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({ id: 'repositories.schema.batchRepositDetailSchema.tab.2' }),
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
                commodityList: {
                  type: 'array:number',
                  'x-component': 'MultTable',
                  'x-component-props': {
                    rowKey: 'id',
                    columns: '{{tableProductColumns}}',
                    prefix: '{{tableAddProductButton}}',
                    // pagination: {
                    //   "onChange": "{{paginationChange}}",
                    //   "total": "{{membersLength}}"
                    // }
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
            tab: getIntl().formatMessage({ id: 'repositories.schema.batchRepositDetailSchema.tab.3' }),
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
                shopIds: {
                  type: 'array:number',
                  'x-component': 'CardCheckBox',
                  'x-component-props': {
                    dataSource: [],
                  },
                  title: getIntl().formatMessage({ id: 'repositories.schema.batchRepositDetailSchema.shopIds' }),
                  'x-rules': [
                    {
                      required: true,
                      message: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}`,
                    },
                  ],
                },
              },
            },
          },
        },
        'tab-4': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({ id: 'repositories.schema.batchRepositDetailSchema.tab.4' }),
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
                isAllMemberShare: {
                  type: 'radio',
                  enum: [
                    {
                      label: getIntl().formatMessage({
                        id: 'repositories.schema.batchRepositDetailSchema.isAllMemberShare.1',
                      }),
                      value: 1,
                    },
                    {
                      label: getIntl().formatMessage({
                        id: 'repositories.schema.batchRepositDetailSchema.isAllMemberShare.2',
                      }),
                      value: 0,
                    },
                  ],
                  title: getIntl().formatMessage({
                    id: 'repositories.schema.batchRepositDetailSchema.isAllMemberShare',
                  }),
                  default: 1,
                  'x-rules': [
                    {
                      required: true,
                      message: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}`,
                    },
                  ],
                  'x-linkages': [
                    {
                      type: 'value:visible',
                      target: 'applyMember',
                      condition: '{{!$value}}',
                    },
                  ],
                },
                applyMember: {
                  type: 'array:number',
                  'x-component': 'MultTable',
                  'x-component-props': {
                    rowKey: 'memberId',
                    columns: '{{tableColumns}}',
                    prefix: '{{tableAddButton}}',
                    pagination: {
                      onChange: '{{paginationChange}}',
                      total: '{{membersLength}}',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
})

// 仓位设置
export const repositTabOneSchema: ISchema = padRequiredMessage({
  type: 'object',
  properties: {
    REPOSIT_TABS: {
      type: 'object',
      'x-component': 'tab',
      'x-component-props': {
        tabPosition: 'left',
      },
      properties: {
        'tab-1': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.tab.1' }),
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
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.name' }),
                  'x-component-props': {
                    placeholder: getIntl().formatMessage({
                      id: 'repositories.schema.repositTabOneSchema.name.placeholder',
                    }),
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${getIntl().formatMessage({
                        id: 'repositories.schema.repositTabOneSchema.name.placeholder',
                      })}`,
                    },
                    {
                      limitByte: true,
                      maxByte: 60,
                    },
                  ],
                },
                shopType: {
                  type: 'number',
                  default: 1,
                  display: false,
                },
                productName: {
                  type: 'string',
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.productName' }),
                  editable: false,
                  'x-mega-props': {
                    full: true,
                  },
                  'x-component-props': {
                    disabled: true,
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}`,
                    },
                  ],
                },
                category: {
                  type: 'string',
                  display: false,
                },
                brand: {
                  type: 'string',
                  display: false,
                },
                unit: {
                  type: 'string',
                  display: false,
                },
                productId: {
                  type: 'string',
                  display: false,
                },
                warehouseId: {
                  type: 'string',
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.warehouseId' }),
                  editable: false,
                  enum: [],
                },
                goodsName: {
                  type: 'string',
                  'x-component': 'Text',
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.materialName' }),
                  default: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.goodsName.default' }),
                },
                NO_SUBMIT3: {
                  type: 'string',
                  'x-component': 'Text',
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.noSUBMIT4' }),
                },
                inventory: {
                  type: 'number',
                  'x-mega-props': {
                    full: true,
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}`,
                    },
                    // 正解应该用一个正则 /^\d{1,8}(\.\d{1,3})?$/ 即可。 为什么两个？ 没眼看 repositDetailSchema中已经用了搬过来
                    {
                      pattern: /^[0-9]{1,8}$/,
                      message: getIntl().formatMessage({
                        id: 'repositories.schema.repositDetailSchema.inventory.message.1',
                      }),
                    },
                    {
                      pattern: /^\d+(\.\d{1,3})?$/,
                      message: getIntl().formatMessage({
                        id: 'repositories.schema.repositDetailSchema.inventory.message.2',
                      }),
                    },
                  ],
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.inventory' }),
                },
                // inventoryDeductWay: {
                //   type: 'radio',
                //   title: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.inventoryDeductWay' }),
                //   'x-rules': [{
                //     required: true,
                //     message: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}`
                //   }],
                //   enum: [
                //     {
                //       label: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.inventoryDeductWay.1' }),
                //       value: 1
                //     },
                //     // {
                //     //   label: '按仓库位置远近扣除',
                //     //   value: 2
                //     // }
                //   ],
                //   default: 1
                // },
                // upperMemberName: {
                //   type: 'string',
                //   title: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.upperMemberName' }),
                //   "x-component": 'Text',
                //   default: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.upperMemberName.default' })
                // },
                // upperStockCount: {
                //   type: 'number',
                //   title: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.upperStockCount' }),
                //   "x-component": 'Text',
                //   default: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.upperStockCount.default' })
                // },
              },
            },
          },
        },
        'tab-2': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.tab.2' }),
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
                shopIds: {
                  type: 'array:number',
                  'x-component': 'CardCheckBox',
                  'x-component-props': {
                    dataSource: [],
                  },
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.shopIds' }),
                  'x-rules': [
                    {
                      required: true,
                      message: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}`,
                    },
                  ],
                },
              },
            },
          },
        },
        'tab-3': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.tab.3' }),
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
                isAllMemberShare: {
                  type: 'radio',
                  enum: [
                    {
                      label: getIntl().formatMessage({
                        id: 'repositories.schema.repositTabOneSchema.isAllMemberShare.1',
                      }),
                      value: 1,
                    },
                    {
                      label: getIntl().formatMessage({
                        id: 'repositories.schema.repositTabOneSchema.isAllMemberShare.2',
                      }),
                      value: 0,
                    },
                  ],
                  title: getIntl().formatMessage({ id: 'repositories.schema.repositTabOneSchema.isAllMemberShare' }),
                  default: 1,
                  required: true,
                  'x-linkages': [
                    {
                      type: 'value:visible',
                      target: 'applyMember',
                      condition: '{{!$value}}',
                    },
                  ],
                },
                applyMember: {
                  type: 'array:number',
                  'x-component': 'MultTable',
                  'x-component-props': {
                    rowKey: 'memberId',
                    columns: '{{tableColumns}}',
                    prefix: '{{tableAddButton}}',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
})

// 库存调入
export const repositInSchema: ISchema = padRequiredMessage({
  type: 'object',
  properties: {
    repos_layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        autoRow: true,
        labelCol: 8,
        labelAlign: 'left',
        columns: 2,
      },
      properties: {
        freightSpaceId: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'repositories.schema.repositInSchema.freightSpaceId' }),
          enum: [],
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'common.text.pleaseSelect' }),
            },
          ],
        },
        foldFreightSpaceId: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'repositories.schema.repositInSchema.foldFreightSpaceId' }),
          enum: [],
          'x-component-props': {
            disabled: true,
          },
          'x-rules': [
            {
              required: true,
              message: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}`,
            },
          ],
        },
        NO_SUBMIT1: {
          type: 'object',
          readOnly: true,
          'x-component': 'CircleBox',
          title: getIntl().formatMessage({ id: 'repositories.schema.repositInSchema.noSUBMIT1' }),
          default: 0,
        },
        NO_SUBMIT2: {
          type: 'object',
          'x-component': 'CircleBox',
          title: getIntl().formatMessage({ id: 'repositories.schema.repositInSchema.noSUBMIT2' }),
          default: 0,
        },
        foldInventory: {
          type: 'number',
          'x-component': 'CustomSlider',
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'common.form.input.placeholder' }),
            },
          ],
          'x-component-props': {
            width: '80%',
            isNumber: true,
            max: 0,
            min: 0,
            step: 0.001,
            span: 24,
            layout: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
        },
      },
    },
    submit: {
      type: 'object',
      'x-component': 'Children',
      'x-component-props': {
        children: '{{transforInBtn}}',
      },
    },
  },
})

// 库存调出
export const repositOutSchema: ISchema = padRequiredMessage({
  type: 'object',
  properties: {
    repos_layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        autoRow: true,
        labelCol: 8,
        labelAlign: 'left',
        columns: 2,
      },
      properties: {
        freightSpaceId: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'repositories.schema.repositOutSchema.freightSpaceId' }),
          enum: [],
          'x-rules': [
            {
              required: true,
              message: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}`,
            },
          ],
          'x-component-props': {
            disabled: true,
          },
        },
        foldFreightSpaceId: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'repositories.schema.repositOutSchema.foldFreightSpaceId' }),
          enum: [],
          'x-rules': [
            {
              required: true,
              message: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}`,
            },
          ],
        },
        NO_SUBMIT1: {
          type: 'object',
          readOnly: true,
          'x-component': 'CircleBox',
          title: getIntl().formatMessage({ id: 'repositories.schema.repositOutSchema.noSUBMIT1' }),
          default: 0,
        },
        NO_SUBMIT2: {
          type: 'object',
          'x-component': 'CircleBox',
          title: getIntl().formatMessage({ id: 'repositories.schema.repositOutSchema.noSUBMIT2' }),
          default: 0,
        },
        foldInventory: {
          type: 'number',
          'x-component': 'CustomSlider',
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'common.form.input.placeholder' }),
            },
          ],
          'x-component-props': {
            width: '80%',
            isNumber: true,
            max: 0,
            min: 0,
            step: 0.001,
            span: 24,
            layout: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
        },
      },
    },
    submit: {
      type: 'object',
      'x-component': 'Children',
      'x-component-props': {
        children: '{{transforOutBtn}}',
      },
    },
  },
})
