import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  ORDER_TYPE2_INQUIRY,
  ORDER_TYPE2_DEMAND,
  ORDER_TYPE2_SPOT,
  ORDER_TYPE2_CENTRALIZED,
  ORDER_TYPE2_POINTS,
  ORDER_TYPE2_CHANNEL_DIRECT,
  ORDER_TYPE2_CHANNEL_SPOT,
  ORDER_TYPE2_CHANNEL_POINTS,
  ORDER_TYPE2,
} from '@/constants/order'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getIntl } from '@linkseeks/i18n'
import { getProductSelectGetSelectBrand, getProductSelectGetSelectCustomerCategory } from '@apps/apis'

const basicsInfo: ISchema = {
  'x-index': 0,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    id: 'basicsInfo',
    title: getIntl().formatMessage({ id: 'stockSellStorage.jibenxinxi' }),
  },
  properties: {
    MEGA_LAYOUT1: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 16,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 2,
      },
      properties: {
        invoicesNo: {
          type: 'text',
          title: getIntl().formatMessage({ id: 'stockSellStorage.danjubianhao' }),
        },
        invoicesTypeId: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'stockSellStorage.danjuleixing' }),
          enum: [],
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'stockSellStorage.qingxuanze' }),
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'common.text.pleaseSelect' }),
            },
          ],
        },
        warehouseId: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'stockSellStorage.duiyingcangku' }),
          enum: [],
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'stockSellStorage.qingxuanze' }),
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'common.text.pleaseSelect' }),
            },
          ],
        },
        invoicesAbstract: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'stockSellStorage.danjuzhaiyao' }),
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'common.form.input.placeholder' }),
            },
          ],
        },
        invoicesTime: {
          type: 'date',
          title: getIntl().formatMessage({ id: 'stockSellStorage.danjushijian' }),
          'x-component-props': {
            format: 'YYYY-MM-DD HH:mm:ss',
            showTime: true,
          },
          required: true,
        },
        warehouseRole: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'stockSellStorage.cangkurenyuan' }),
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'common.form.input.placeholder' }),
            },
          ],
        },
      },
    },
  },
}

const DocumentDetail: ISchema = {
  'x-index': 1,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    id: 'DocumentDetail',
    title: getIntl().formatMessage({ id: 'stockSellStorage.danjumingxi' }),
    showTotal: true,
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
        addBtn: {
          type: 'object',
          'x-component': 'Children',
          'x-component-props': {
            children: '{{TableAddButton}}',
          },
        },
        invoicesDetailsDTOList: {
          type: 'array',
          'x-component': 'ArrayTable',
          'x-component-props': {
            renderAddition: () => null,
            renderRemove: '{{renderListTableRemove}}',
            scroll: {
              x: '900px',
            },
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'stockSellStorage.qingtianjiadanjumingxi' }),
            },
          ],
          items: {
            type: 'object',
            properties: {
              // 额外的数据，用于收集不需要展示的数据
              materielNo: {
                type: 'string',
                title: getIntl().formatMessage({ id: 'stockSellStorage.huohao' }),
                'x-props': {
                  width: 150,
                },
                'x-component': 'Text',
                'x-component-props': {
                  ellipsis: true,
                },
              },
              materielName: {
                type: 'string',
                title: getIntl().formatMessage({ id: 'stockSellStorage.huopinmingcheng' }),
                'x-props': {
                  width: 150,
                },
                'x-component': 'Text',
                'x-component-props': {
                  ellipsis: true,
                },
              },
              materielGroup: {
                type: 'string',
                title: getIntl().formatMessage({ id: 'stockSellStorage.materialGroup' }),
                'x-props': {
                  width: 150,
                },
                'x-component': 'Text',
                'x-component-props': {
                  ellipsis: true,
                },
              },
              specifications: {
                type: 'string',
                title: getIntl().formatMessage({ id: 'stockSellStorage.guigexinghao' }),
                'x-props': {
                  width: 150,
                },
                'x-component': 'Text',
                'x-component-props': {
                  ellipsis: true,
                },
              },
              category: {
                type: 'string',
                title: getIntl().formatMessage({ id: 'stockSellStorage.pinlei' }),
                'x-props': {
                  width: 150,
                },
                'x-component': 'Text',
                'x-component-props': {
                  ellipsis: true,
                },
              },
              brand: {
                type: 'string',
                title: getIntl().formatMessage({ id: 'stockSellStorage.pinpai' }),
                'x-props': {
                  width: 150,
                },
                'x-component': 'Text',
                'x-component-props': {
                  ellipsis: true,
                },
              },
              unit: {
                type: 'string',
                title: getIntl().formatMessage({ id: 'stockSellStorage.danwei' }),
                'x-props': {
                  width: 150,
                },
                'x-component': 'Text',
                'x-component-props': {
                  ellipsis: true,
                },
              },
              costPrice: {
                type: 'string',
                title: getIntl().formatMessage({ id: 'stockSellStorage.chengbenjia' }),
                'x-props': {
                  width: 150,
                },
                'x-component': 'Text',
                'x-component-props': {
                  ellipsis: true,
                },
              },
              invoicesCount: {
                type: 'string',
                title: getIntl().formatMessage({ id: 'stockSellStorage.danjushuliang' }),
                'x-props': {
                  width: 150,
                },
                'x-component-props': {
                  allowClear: true,
                  style: {
                    width: 80,
                  },
                },
                'x-rules': [
                  // 大于0.001
                  {
                    validator(value) {
                      return Number(value) < 0.001 ? '大于等于0.001' : ''
                    },
                  },
                  {
                    required: true,
                    message: getIntl().formatMessage({ id: 'stockSellStorage.qingshurudanjushuliang' }),
                  },
                  {
                    pattern: PATTERN_MAPS.weight,
                    message: getIntl().formatMessage({
                      id: 'stockSellStorage.qingshuruzhengquedeshuliang',
                    }),
                  },
                ],
              },
              totalPrice: {
                type: 'string',
                title: getIntl().formatMessage({ id: 'stockSellStorage.jine' }),
                'x-props': {
                  width: 100,
                },
                'x-component': 'Text',
                'x-component-props': {
                  ellipsis: true,
                },
              },
            },
          },
        },
      },
    },
  },
}

export const addBillSchema: ISchema = {
  type: 'object',
  properties: {
    basicsInfo,
    DocumentDetail,
  },
}

// 采购入库单、销售发货单订单 弹窗 search schema
export const purchaseOrderBillSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'Mega-Layout',
      properties: {
        search: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'stockSellStorage.sousuo' }),
            align: 'flex-start',
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 3,
          },
          properties: {
            orderNo: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.dingdanhaoquanbu' }),
                allowClear: true,
              },
            },
            orderThe: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.dingdanzhaiyaoquanbu' }),
                allowClear: true,
              },
            },
            supplyMembersName: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.huiyuanmingchengquanbu' }),
                allowClear: true,
              },
            },
            '[startCreateTime, endCreateTime]': {
              type: 'string',
              'x-component': 'DateSelect',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.xiadanshijianquanbu' }),
                allowClear: true,
              },
            },
            type: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.dingdanleixingquanbu' }),
                allowClear: true,
              },
              enum: [
                { label: ORDER_TYPE2[ORDER_TYPE2_INQUIRY], value: ORDER_TYPE2_INQUIRY },
                { label: ORDER_TYPE2[ORDER_TYPE2_DEMAND], value: ORDER_TYPE2_DEMAND },
                { label: ORDER_TYPE2[ORDER_TYPE2_SPOT], value: ORDER_TYPE2_SPOT },
                { label: ORDER_TYPE2[ORDER_TYPE2_CENTRALIZED], value: ORDER_TYPE2_CENTRALIZED },
                { label: ORDER_TYPE2[ORDER_TYPE2_POINTS], value: ORDER_TYPE2_POINTS },
                {
                  label: ORDER_TYPE2[ORDER_TYPE2_CHANNEL_DIRECT],
                  value: ORDER_TYPE2_CHANNEL_DIRECT,
                },
                { label: ORDER_TYPE2[ORDER_TYPE2_CHANNEL_SPOT], value: ORDER_TYPE2_CHANNEL_SPOT },
                {
                  label: ORDER_TYPE2[ORDER_TYPE2_CHANNEL_POINTS],
                  value: ORDER_TYPE2_CHANNEL_POINTS,
                },
              ],
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'stockSellStorage.chaxun' }),
              },
            },
          },
        },
      },
    },
  },
}

// 加工入库单 弹窗 search schema
export const machiningWarehousingBillSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'Mega-Layout',
      properties: {
        search: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'stockSellStorage.sousuo' }),
            align: 'flex-start',
            tip: getIntl().formatMessage({ id: 'stockSellStorage.shurutongzhidanhao' }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 3,
          },
          properties: {
            summary: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.tongzhidanzhaiyao' }),
                allowClear: true,
              },
            },
            processName: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.jiagongqiye' }),
                allowClear: true,
              },
            },
            '[startTime, endTime]': {
              type: 'string',
              'x-component': 'DateSelect',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.danjushijian' }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'stockSellStorage.chaxun' }),
              },
            },
          },
        },
      },
    },
  },
}

// 加工发货单 弹窗 search schema
export const machiningDeliveryBillSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'Mega-Layout',
      properties: {
        search: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'stockSellStorage.sousuo' }),
            align: 'flex-start',
            tip: getIntl().formatMessage({ id: 'stockSellStorage.shurutongzhidanhao' }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 3,
          },
          properties: {
            summary: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.tongzhidanzhaiyao' }),
                allowClear: true,
              },
            },
            supplierName: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.gongyinghuiyuan' }),
                allowClear: true,
              },
            },
            '[startTime, endTime]': {
              type: 'string',
              'x-component': 'DateSelect',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.danjushijian' }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'stockSellStorage.chaxun' }),
              },
            },
          },
        },
      },
    },
  },
}

// 售后发货、入库 弹窗 search schema
export const afterSaleBillSchema = (isPurchaser: boolean): ISchema => {
  return {
    type: 'object',
    properties: {
      megaLayout: {
        type: 'object',
        'x-component': 'Mega-Layout',
        properties: {
          search: {
            type: 'string',
            'x-component': 'Search',
            'x-mega-props': {},
            'x-component-props': {
              placeholder: getIntl().formatMessage({ id: 'stockSellStorage.sousuo' }),
              align: 'flex-start',
              tip: getIntl().formatMessage({ id: 'stockSellStorage.shurutongzhidanhao' }),
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'Mega-Layout',
            'x-component-props': {
              grid: true,
              full: true,
              autoRow: true,
              columns: 3,
            },
            properties: {
              applyAbstract: {
                type: 'string',
                'x-component-props': {
                  placeholder: getIntl().formatMessage({ id: 'stockSellStorage.shenqingdanzhaiyao' }),
                  allowClear: true,
                },
              },
              ...(isPurchaser
                ? {
                    supplierName: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: getIntl().formatMessage({ id: 'stockSellStorage.gongyinghuiyuan' }),
                        allowClear: true,
                      },
                    },
                  }
                : {
                    consumerName: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: getIntl().formatMessage({ id: 'stockSellStorage.caigouhuiyuan' }),
                        allowClear: true,
                      },
                    },
                  }),
              '[startTime, endTime]': {
                type: 'string',
                'x-component': 'DateSelect',
                'x-component-props': {
                  placeholder: getIntl().formatMessage({ id: 'stockSellStorage.danjushijian' }),
                  allowClear: true,
                },
              },
              submit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: getIntl().formatMessage({ id: 'stockSellStorage.chaxun' }),
                },
              },
            },
          },
        },
      },
    },
  }
}

export const goodsSearchSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'Mega-Layout',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'stockSellStorage.sousuo' }),
            align: 'flex-start',
            tip: getIntl().formatMessage({ id: 'stockSellStorage.shuruhuopinmingcheng' }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 3,
          },
          properties: {
            code: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.huohao' }),
                allowClear: true,
              },
            },
            type: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'stockSellStorage.guigexinghao' }),
                allowClear: true,
              },
            },
            // customerCategoryId: {
            //   type: 'string',
            //   'x-component': 'CustomCategorySearch',
            //   'x-component-props': {
            //     placeholder: getIntl().formatMessage({id: 'stockSellStorage.pinlei'}),
            //     showSearch: true,
            //     notFoundContent: null,
            //     dataoption: [],
            //     fieldNames: { label: 'name', value: 'id', children: 'children' },
            //   },
            // },
            customerCategoryId: {
              type: 'string',
              'x-component': 'SearchSelect',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'detail.purchase.message28' }),
                className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在select下, 只有这里出现问题, ??
                fetchSearch: getProductSelectGetSelectCustomerCategory,
                style: {
                  width: 160,
                },
              },
            },
            brandId: {
              type: 'string',
              'x-component': 'SearchSelect',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'detail.purchase.message31' }),
                fetchSearch: getProductSelectGetSelectBrand,
                style: {
                  width: 160,
                },
              },
            },
            materialGroupId: {
              type: 'string',
              'x-component': 'Cascader',
              'x-component-props': {
                placeholder: '物料组',
                allowClear: true,
                fieldNames: { label: 'name', value: 'id', children: 'children' },
                style: { width: '150px' },
                showSearch: true,
              },
            },
            // materialGroupId: {
            //   type: 'string',
            //   'x-component': 'CustomCategorySearch',
            //   'x-component-props': {
            //     placeholder: getIntl().formatMessage({ id: 'commodity.goods.schema.goodsSchema.goodsGroupId' }),
            //     showSearch: true,
            //     notFoundContent: null,
            //     dataoption: [],
            //     fieldNames: { label: 'name', value: 'id', children: 'children' },
            //   },
            // },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'stockSellStorage.chaxun' }),
              },
            },
          },
        },
      },
    },
  },
}
