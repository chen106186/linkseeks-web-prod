/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-04 13:59:33
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-24 11:15:07
 * @Description:
 */
import { ISchema } from '@apps/formily'
import moment from 'moment'
import themeConfig from '@apps/config/lingxi.theme.config'
import { PATTERN_MAPS } from '@/constants/regExp'
import {
  DOC_TYPE_PURCHASE_RECEIPT,
  DOC_TYPE_SALES_INVOICE,
  DOC_TYPE_PROCESS_RECEIPT,
  DOC_TYPE_PROCESS_INVOICE,
  DOC_TYPE_RETURN_INVOICE,
  DOC_TYPE_RETURN_RECEIPT,
  DOC_TYPE_EXCHANGE_RETURN_INVOICE,
  DOC_TYPE_EXCHANGE_RETURN_RECEIPT,
  DOC_TYPE_EXCHANGE_INVOICE,
  DOC_TYPE_EXCHANGE_RECEIPT,
  DEPENDENT_DOC_ORDER,
  DEPENDENT_DOC_EXCHANGE,
  DEPENDENT_DOC_RETURN,
  DEPENDENT_DOC_PRODUCTION,
  DEPENDENT_DOC_INTERNAL,
} from '@/constants/commodity'
import { ORDER_TYPE_BIDDING_CONTRACT, ORDER_TYPE_INQUIRY_CONTRACT, ORDER_TYPE_TENDER_CONTRACT } from '@/constants/order'
import { getIntl } from '@linkseeks/i18n'

export type BillDetailSchemaType = {
  [key: string]: ISchema
}
const intl = getIntl()
export type RelatedType = 1 | 2

// 关联单据名称
// '退货' | '换货'
const RELATED_TYPE_NAME: { [key: number]: any } = {
  1: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName2' }),
  2: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName1' }),
}

// 单据类型 换 关联单据类型
const RELATED_BILL_TYPE_MAP = {
  [DOC_TYPE_PURCHASE_RECEIPT]: DEPENDENT_DOC_ORDER,
  [DOC_TYPE_SALES_INVOICE]: DEPENDENT_DOC_ORDER,
  [DOC_TYPE_PROCESS_RECEIPT]: DEPENDENT_DOC_PRODUCTION,
  [DOC_TYPE_PROCESS_INVOICE]: DEPENDENT_DOC_PRODUCTION,
  [DOC_TYPE_RETURN_INVOICE]: DEPENDENT_DOC_RETURN,
  [DOC_TYPE_RETURN_RECEIPT]: DEPENDENT_DOC_RETURN,
  [DOC_TYPE_EXCHANGE_RETURN_INVOICE]: DEPENDENT_DOC_EXCHANGE,
  [DOC_TYPE_EXCHANGE_RETURN_RECEIPT]: DEPENDENT_DOC_EXCHANGE,
  [DOC_TYPE_EXCHANGE_INVOICE]: DEPENDENT_DOC_EXCHANGE,
  [DOC_TYPE_EXCHANGE_RECEIPT]: DEPENDENT_DOC_EXCHANGE,
}

// 单据类型 换 单据类型名称 '订单' | '加工' | '退货' | '换货'
const BILL_NAME_MAP: { [key: number]: any } = {
  [DOC_TYPE_PURCHASE_RECEIPT]: intl.formatMessage({ id: 'logistics.dingdan' }),
  [DOC_TYPE_SALES_INVOICE]: intl.formatMessage({ id: 'logistics.dingdan' }),
  [DOC_TYPE_PROCESS_RECEIPT]: intl.formatMessage({ id: 'menu.handling' }),
  [DOC_TYPE_PROCESS_INVOICE]: intl.formatMessage({ id: 'menu.handling' }),
  [DOC_TYPE_RETURN_INVOICE]: intl.formatMessage({ id: 'afterService.components.DeliverDrawer.type.refund' }),
  [DOC_TYPE_RETURN_RECEIPT]: intl.formatMessage({ id: 'afterService.components.DeliverDrawer.type.refund' }),
  [DOC_TYPE_EXCHANGE_RETURN_INVOICE]: intl.formatMessage({ id: 'afterService.components.DeliverDrawer.type.refund' }),
  [DOC_TYPE_EXCHANGE_RETURN_RECEIPT]: intl.formatMessage({ id: 'afterService.components.DeliverDrawer.type.refund' }),
  [DOC_TYPE_EXCHANGE_INVOICE]: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName1' }),
  [DOC_TYPE_EXCHANGE_RECEIPT]: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName1' }),
}

// 单据类型 换 单据方向名称 '收货' | '入库' | '发货'
const BILL_DIRECTION_NAME_MAP: { [key: number]: any } = {
  [DOC_TYPE_PURCHASE_RECEIPT]: intl.formatMessage({ id: 'components.shouhuo' }),
  [DOC_TYPE_SALES_INVOICE]: intl.formatMessage({ id: 'components.fahuo' }),
  [DOC_TYPE_PROCESS_RECEIPT]: intl.formatMessage({ id: 'common.ruku' }),
  [DOC_TYPE_PROCESS_INVOICE]: intl.formatMessage({ id: 'components.fahuo' }),
  [DOC_TYPE_RETURN_INVOICE]: intl.formatMessage({ id: 'components.fahuo' }),
  [DOC_TYPE_RETURN_RECEIPT]: intl.formatMessage({ id: 'components.shouhuo' }),
  [DOC_TYPE_EXCHANGE_RETURN_INVOICE]: intl.formatMessage({ id: 'components.fahuo' }),
  [DOC_TYPE_EXCHANGE_RETURN_RECEIPT]: intl.formatMessage({ id: 'components.shouhuo' }),
  [DOC_TYPE_EXCHANGE_INVOICE]: intl.formatMessage({ id: 'components.fahuo' }),
  [DOC_TYPE_EXCHANGE_RECEIPT]: intl.formatMessage({ id: 'components.shouhuo' }),
}

// 单据类型 换 单据反方向名称 '收货' | '入库' | '发货'
const BILL_DIRECTION_REVER_NAME_MAP: { [key: number]: any } = {
  [DOC_TYPE_PURCHASE_RECEIPT]: intl.formatMessage({ id: 'components.fahuo' }),
  [DOC_TYPE_SALES_INVOICE]: intl.formatMessage({ id: 'common.ruku' }),
  [DOC_TYPE_PROCESS_RECEIPT]: intl.formatMessage({ id: 'components.fahuo' }),
  [DOC_TYPE_PROCESS_INVOICE]: intl.formatMessage({ id: 'common.ruku' }),
  [DOC_TYPE_RETURN_INVOICE]: intl.formatMessage({ id: 'components.shouhuo' }),
  [DOC_TYPE_RETURN_RECEIPT]: intl.formatMessage({ id: 'components.fahuo' }),
  [DOC_TYPE_EXCHANGE_RETURN_INVOICE]: intl.formatMessage({ id: 'components.shouhuo' }),
  [DOC_TYPE_EXCHANGE_RETURN_RECEIPT]: intl.formatMessage({ id: 'components.fahuo' }),
  [DOC_TYPE_EXCHANGE_INVOICE]: intl.formatMessage({ id: 'components.shouhuo' }),
  [DOC_TYPE_EXCHANGE_RECEIPT]: intl.formatMessage({ id: 'components.fahuo' }),
}

const createSchema = (relatedType: RelatedType, billType: number, orderType: number): ISchema => {
  // 是否是收件人
  const isConsignee =
    billType === DOC_TYPE_PURCHASE_RECEIPT ||
    billType === DOC_TYPE_RETURN_RECEIPT ||
    billType === DOC_TYPE_EXCHANGE_RETURN_RECEIPT ||
    billType === DOC_TYPE_EXCHANGE_RECEIPT
  // 是否是合同订单
  const isMateriel =
    orderType === ORDER_TYPE_INQUIRY_CONTRACT ||
    orderType === ORDER_TYPE_BIDDING_CONTRACT ||
    orderType === ORDER_TYPE_TENDER_CONTRACT
  return {
    type: 'object',
    properties: {
      BASIC_INFO: {
        type: 'object',
        'x-component': 'MellowCardBox',
        'x-component-props': {
          title: intl.formatMessage({ id: 'stockSellStorage.jibenxinxi' }),
          id: 'basicInfo',
          style: {
            marginBottom: themeConfig['@margin-md'],
          },
        },
        properties: {
          COlUMN_LAYOUT: {
            type: 'object',
            'x-component': 'ColumnLayout',
            'x-component-props': {
              column: 2,
              gutter: 128,
            },
            properties: {
              MEGA_LADYOUT_1: {
                type: 'object',
                'x-component': 'Mega-Layout',
                'x-component-props': {
                  grid: true,
                  full: true,
                  columns: 1,
                  autoRow: true,
                  labelCol: 6,
                  labelAlign: 'left',
                },
                properties: {
                  billType: {
                    title: intl.formatMessage({ id: 'stockSellStorage.danjuleixing' }),
                    type: 'string',
                    enum: [],
                    required: true,
                    'x-component-props': {
                      allowClear: false,
                      disabled: true,
                    },
                    default: billType,
                  },
                  inventoryId: {
                    title: intl.formatMessage({ id: 'stockSellStorage.duiyingcangku' }),
                    type: 'string',
                    enum: [],
                    'x-component-props': {
                      allowClear: false,
                    },
                    // 'x-rules': [
                    //   {
                    //     required: true,
                    //     message: intl.formatMessage({ id: 'stockSellStorage.qingxuanzeduiyingcangku' }),
                    //   },
                    // ],
                  },
                  digest: {
                    title: intl.formatMessage({ id: 'stockSellStorage.danjuzhaiyao' }),
                    type: 'string',
                    'x-component-props': {
                      allowClear: false,
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'stockSellStorage.qingshurudanjuzhaiyao' }),
                      },
                    ],
                  },
                  createTime: {
                    type: 'date',
                    title: intl.formatMessage({ id: 'stockSellStorage.danjushijian' }),
                    'x-component-props': {
                      format: 'YYYY-MM-DD HH:mm:ss',
                      showTime: true,
                    },
                    required: true,
                    default: moment().format('YYYY-MM-DD HH:mm:ss'),
                  },
                  inventoryRole: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'stockSellStorage.cangkurenyuan' }),
                    // 'x-rules': [
                    //   {
                    //     required: true,
                    //     message: intl.formatMessage({ id: 'stockSellStorage.qingshurucangkurenyuan' }),
                    //   },
                    // ],
                  },
                  remark: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'stockSellStorage.beizhu' }),
                    'x-component': 'textarea',
                    'x-rules': [
                      {
                        limitByte: true, // 自定义校验规则
                        maxByte: 200,
                      },
                    ],
                  },
                  // 收集值用
                  inventoryName: {
                    type: 'string',
                    display: false,
                  },
                },
              },
              MEGA_LADYOUT_2: {
                type: 'object',
                'x-component': 'Mega-Layout',
                'x-component-props': {
                  grid: true,
                  full: true,
                  columns: 1,
                  autoRow: true,
                  labelCol: 6,
                  labelAlign: 'left',
                },
                properties: {
                  relatedBillType: {
                    title: intl.formatMessage({ id: 'stockSellStorage.duiyingdanju' }),
                    type: 'string',
                    'x-rules': [
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'stockSellStorage.qingxuanzeduiyingdanju' }),
                      },
                    ],
                    enum: [
                      {
                        label: intl.formatMessage({ id: 'stockSellStorage.dingdan' }),
                        value: DEPENDENT_DOC_ORDER,
                      },
                      {
                        label: intl.formatMessage({ id: 'stockSellStorage.huanhuoshenqingdan' }),
                        value: DEPENDENT_DOC_EXCHANGE,
                      },
                      {
                        label: intl.formatMessage({ id: 'stockSellStorage.tuihuoshenqingdan' }),
                        value: DEPENDENT_DOC_RETURN,
                      },
                      {
                        label: intl.formatMessage({ id: 'stockSellStorage.shengchantongzhidan' }),
                        value: DEPENDENT_DOC_PRODUCTION,
                      },
                      {
                        label: intl.formatMessage({ id: 'stockSellStorage.neibudanju' }),
                        value: DEPENDENT_DOC_INTERNAL,
                      },
                    ],
                    default: RELATED_BILL_TYPE_MAP[billType],
                    editable: false,
                  },
                  // 关联单据的编号，例如订单编号、售后编号、加工编号
                  relatedNo: {
                    title: intl.formatMessage({ id: 'stockSellStorage.guanliandanju' }),
                    type: 'string',
                    required: true,
                    editable: false,
                  },
                  memberName: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'stockSellStorage.huiyuanmingcheng' }),
                    editable: false,
                  },
                  // 收货地址 或 发货地址
                  address: {
                    type: 'string',
                    title: `${BILL_DIRECTION_REVER_NAME_MAP[billType]}${intl.formatMessage({
                      id: 'stockSellStorage.dizhi',
                    })}`,
                    editable: false,
                  },
                  logisticsTypeName: {
                    type: 'string',
                    title: intl.formatMessage({ id: 'stockSellStorage.wuliufangshi' }),
                    editable: false,
                  },
                },
              },
            },
          },
        },
      },
      BILL_DETAIL: {
        type: 'object',
        'x-component': 'MellowCardBox',
        'x-component-props': {
          title: intl.formatMessage({ id: 'stockSellStorage.danjumingxi' }),
          id: 'billDetail',
          style: {
            marginBottom: themeConfig['@margin-md'],
          },
        },
        properties: {
          billDetails: {
            type: 'array',
            'x-component': 'ArrayTable',
            'x-component-props': {
              renderAddition: () => null,
            },
            'x-rules': [
              {
                required: true,
                message: intl.formatMessage({ id: 'stockSellStorage.qingtianjiadanjumingxi' }),
              },
            ],
            items: {
              type: 'object',
              properties: {
                orderNo: {
                  title: intl.formatMessage({ id: 'stockSellStorage.dingdanhao' }),
                  type: 'string',
                  'x-component': 'Text',
                  'x-component-props': {
                    ellipsis: true,
                  },
                },
                productId: {
                  title: !isMateriel
                    ? intl.formatMessage({ id: 'stockSellStorage.shangpinID' })
                    : intl.formatMessage({ id: 'stockSellStorage.wuliaobianhao' }),
                  type: 'string',
                  'x-component': 'Text',
                  'x-component-props': {
                    ellipsis: true,
                  },
                },
                productName: {
                  title: !isMateriel
                    ? `${BILL_NAME_MAP[billType]}${intl.formatMessage({ id: 'stockSellStorage.shangpinmingcheng' })}`
                    : `${BILL_NAME_MAP[billType]}${intl.formatMessage({
                        id: 'stockSellStorage.wuliaomingchengguige',
                      })}`,
                  type: 'string',
                  'x-component': 'Text',
                  'x-component-props': {
                    ellipsis: true,
                    style: {
                      width: 90,
                    },
                  },
                },
                // 商品品类
                category: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'stockSellStorage.pinlei' }),
                  'x-component': 'Text',
                  'x-component-props': {
                    ellipsis: true,
                  },
                },
                // 商品品牌
                brand: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'stockSellStorage.pinpai' }),
                  'x-component': 'Text',
                  'x-component-props': {
                    ellipsis: true,
                  },
                },
                // 商品单位
                unit: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'stockSellStorage.danwei' }),
                  'x-component': 'Text',
                  'x-component-props': {
                    ellipsis: true,
                  },
                },
                // 商品单价
                price: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'stockSellStorage.danjia' }),
                  'x-component': 'Text',
                  'x-component-props': {
                    ellipsis: true,
                  },
                },
                // 关联单据商品数量
                relatedCount: {
                  type: 'string',
                  title: `${RELATED_TYPE_NAME[relatedType]}${intl.formatMessage({ id: 'stockSellStorage.shuliang' })}`,
                  'x-component': 'Text',
                  'x-component-props': {
                    ellipsis: true,
                  },
                },
                ...(isConsignee
                  ? {
                      billCount: {
                        type: 'string',
                        title: `${BILL_NAME_MAP[billType]}${
                          BILL_DIRECTION_REVER_NAME_MAP[billType]
                        }${intl.formatMessage({ id: 'stockSellStorage.shuliang' })}`,
                        'x-component': 'Text',
                        'x-component-props': {
                          ellipsis: true,
                        },
                      },
                    }
                  : {}),
                // 单据数量
                count: {
                  type: 'string',
                  title: `${BILL_NAME_MAP[billType]}${BILL_DIRECTION_NAME_MAP[billType]}${intl.formatMessage({
                    id: 'stockSellStorage.shuliang',
                  })}`,
                  'x-component-props': {
                    allowClear: true,
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'stockSellStorage.qingshuru' })}${BILL_NAME_MAP[billType]}${
                        BILL_DIRECTION_NAME_MAP[billType]
                      }${intl.formatMessage({ id: 'stockSellStorage.shuliang' })}`,
                    },
                    {
                      pattern: PATTERN_MAPS.weight,
                      message: intl.formatMessage({ id: 'stockSellStorage.qingshuruzhengquedeshuliang' }),
                    },
                  ],
                },
                // 单据金额
                amount: {
                  type: 'string',
                  title: `${BILL_NAME_MAP[billType]}${BILL_DIRECTION_NAME_MAP[billType]}${intl.formatMessage({
                    id: 'stockSellStorage.jine',
                  })}`,
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
}

export default createSchema
