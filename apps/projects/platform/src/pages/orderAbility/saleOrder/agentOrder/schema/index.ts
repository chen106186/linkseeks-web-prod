import type { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import styles from '../index.less'
import { dateLocale } from '@/components/NiceForm/utils/locale'

// 基本信息
const basicInfo: ISchema = {
  'x-index': 0,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.title1' }),
    id: 'basicInfo',
  },
  properties: {
    NO_SUBMIT_LAYOUT: {
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
        // orderModeName: {
        //   type: 'string',
        //   title: getIntl().formatMessage({id: 'purchaseOrder.orderCollect.schema.orderMode'}),
        //   "x-component": 'text',
        // },
        shopId: {
          type: 'number',
          enum: [],
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.shopId' }),
          required: true,
        },
        orderMode: {
          type: 'number',
          required: true,
          enum: [],
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.orderMode' }),
        },
        digest: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.digest' }),
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'purchaseOrder.orderCollect.schema.digestMessage',
              }),
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
        },
        buyerMemberMajorId: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'purchaseOrder.orderCollect.schema.buyerMemberMajorId',
          }),
          enum: [],
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'purchaseOrder.orderCollect.schema.buyerMemberMajorIdPh',
            }),
            showSearch: true,
            showArrow: true,
            allowClear: true,
            defaultActiveFirstOption: false,
            filterOption: false,
            onSearch: '{{handleMemberSearch}}',
          },
          required: true,
        },
        buyerMemberId: {
          type: 'string',
          display: false,
        },
        buyerMemberName: {
          type: 'string',
          display: false,
        },
        buyerRoleId: {
          type: 'string',
          display: false,
        },
        vendorMemberName: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'purchaseOrder.orderCollect.schema.vendorMemberName',
          }),
          'x-component-props': {
            disabled: true,
          },
          required: true,
        },
        vendorMemberId: {
          type: 'string',
          display: false,
        },
        vendorRoleId: {
          type: 'string',
          display: false,
        },
        idList: {
          type: 'array',
          display: false,
        },
        productType: {
          type: 'number',
          display: false,
        },

        orderNo: {
          type: 'string',
          title: '订单编号',
          'x-component': 'text',
          visible: false,
        },
        type: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.type' }),
          'x-component': 'text',
        },
        createTime: {
          type: 'string',
          title: '下单时间',
          visible: false,
        },
        interiorState: {
          type: 'string',
          title: '内部状态',
          visible: false,
        },
        externalState: {
          type: 'string',
          title: '外部状态',
          visible: false,
        },
        sumPrice: {
          type: 'number',
          title: '总价',
          visible: false,
        },
        freight: {
          type: 'number',
          title: '运费',
          visible: false,
        },
      },
    },
  },
}

// 订单商品
export const orderProducts: ISchema = {
  'x-index': 2,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.title2' }),
    id: 'orderProducts',
    showTotal: true,
  },
  properties: {
    products: {
      type: 'array',
      'x-component': 'MultTable',
      required: true,
      'x-component-props': {
        rowKey: 'id',
        columns: '{{productColumns}}',
        components: '{{productComponents}}',
        prefix: '{{productAddButton}}',
      },
    },
    NO_SUBMIT_SPY: {
      type: 'object',
      'x-component': 'moneyTotalBox',
    },
  },
}

// 支付信息
export const payInfo: ISchema = {
  'x-index': 3,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.title3' }),
    id: 'payInfo',
  },
  properties: {
    payments: {
      type: 'array',
      'x-component': 'MultTable',
      'x-component-props': {
        rowKey: 'payCount',
        columns: '{{paymentColumns}}',
        components: '{{paymentComponents}}',
      },
    },
  },
}

// 送货信息
const submitInfo: ISchema = {
  'x-index': 1,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.title4' }),
    id: 'deliveryInfo',
  },
  properties: {
    NO_SUBMIT_LAYOUT_2: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 3,
        wrapperCol: 9,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 1,
      },
      properties: {
        FLEX_LAYOUT_LEFT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelCol: 3,
            wrapperCol: 21,
          },
          properties: {
            deliverDate: {
              type: 'string',
              'x-component': 'date',
              title: getIntl().formatMessage({
                id: 'purchaseOrder.orderCollect.schema.deliverDate',
              }),
              required: true,
              'x-component-props': {
                style: { width: 400 },
                locale: dateLocale(),
              },
            },
            timeLine: {
              title: ' ',
              type: 'radio',
              enum: [],
              visible: false,
              required: true,
              'x-component-props': {
                disabled: false,
                optionType: 'button',
                className: styles.adjustFormItem,
              },
            },
          },
        },
        FLEX_LAYOUT_RIGHT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelCol: 3,
            wrapperCol: 21,
          },
          properties: {
            deliveryAddresId: {
              type: 'string',
              'x-component': 'SelectAddress',
              'x-mega-props': {
                style: {
                  full: true,
                },
              },
              'x-component-props': {
                dataSource: [],
                times: 0,
              },
              'x-rules': [
                {
                  required: true,
                  message: getIntl().formatMessage({
                    id: 'purchaseOrder.orderCollect.schema.deliveryAddresIdMessage',
                  }),
                },
              ],
              title: getIntl().formatMessage({
                id: 'purchaseOrder.orderCollect.schema.deliveryAddresId',
              }),
            },
          },
        },
      },
    },
  },
}

// 发票信息
const invoiceInfo: ISchema = {
  'x-index': 4,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.title5' }),
    id: 'invoiceInfo',
  },
  properties: {
    NO_SUBMIT_LAYOUT_ORTHER: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 3,
        wrapperCol: 9,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 1,
      },
      properties: {
        hasInvoice: {
          type: 'boolean',
          'x-component': 'CheckboxSingle',
          'x-component-props': {
            children: getIntl().formatMessage({
              id: 'purchaseOrder.orderCollect.schema.hasInvoiceChildren',
            }),
            style: {
              marginTop: 4,
            },
          },
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.hasInvoice' }),
          default: false,
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'theInvoiceId',
              condition: '{{$value}}',
            },
          ],
        },
        FLEX_LAYOUT_RIGHT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelCol: 3,
            wrapperCol: 22,
          },
          properties: {
            theInvoiceId: {
              type: 'number',
              title: ' ',
              'x-component': 'theInvoiceList',
              'x-component-props': {
                times: 0,
              },
            },
          },
        },
      },
    },
  },
}

// 其他信息
const otherInfo: ISchema = {
  'x-index': 5,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.title6' }),
    id: 'otherInfo',
  },
  properties: {
    NO_SUBMIT_LAYOUT_ORTHER: {
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
        pack: {
          type: 'string',
          'x-component': 'textarea',
          'x-component-props': {
            rows: 1,
          },
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.pack' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
        remark: {
          type: 'string',
          'x-component': 'textarea',
          'x-component-props': {
            rows: 1,
          },
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.remark' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
      },
    },
  },
}

// 新增时使用的schema
export const orderAddSchema: ISchema = {
  type: 'object',
  properties: {
    basicInfo,
    submitInfo,
    orderProducts,
    payInfo,
    invoiceInfo,
    otherInfo,
  },
}

export const mergeAllSchemas = {
  ...orderAddSchema,
}
