import type { ISchema } from '@apps/formily'
import moment from 'moment'
import { getIntl } from '@linkseeks/i18n'
import { schemas } from '../../../componentSchema'
import { getWebIntl } from '@apps/locales'
import { dateLocale } from '@/components/NiceForm/utils/locale'

const translate = getWebIntl()
enum Indexs {
  zero = 0,
  one,
  two,
  three,
  Index,
  four,
  five,
}
const { electronicInfo } = schemas(Indexs.Index)
// 基本信息
const basicInfo: ISchema = {
  'x-index': Indexs.zero,
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
        wrapperCol: 18,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 2,
      },
      properties: {
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
        orderMode: {
          type: 'string',
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'common.bitian' }),
            },
          ],
          enum: [
            {
              label: getIntl().formatMessage({
                id: 'purchaseOrder.orderCollect.materialOrder.mode1',
              }),
              value: 17,
            },
            {
              label: getIntl().formatMessage({
                id: 'purchaseOrder.orderCollect.materialOrder.mode2',
              }),
              value: 18,
            },
          ],
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.orderMode' }),
          default: 17,
        },
        vendorMemberName: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'purchaseOrder.orderCollect.materialOrder.schema.vendorMemberName',
          }),
          'x-component-props': {
            disabled: true,
            addonAfter: '{{orderMember}}',
            className: 'custom_addon_bg_color',
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'common.bitian' }),
            },
          ],
        },
        type: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.type' }),
          'x-component': 'text',
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
          title: translate('web.resource.order.dingdanbianhao'),
          'x-component': 'text',
          visible: false,
        },
        createTime: {
          type: 'string',
          title: translate('web.resource.order.xiadanshijian'),
          visible: false,
        },
        interiorState: {
          type: 'string',
          title: translate('web.common.neibuzhuangtai'),
          visible: false,
        },
        externalState: {
          type: 'string',
          title: translate('web.common.waibuzhuangtai'),
          visible: false,
        },
      },
    },
  },
}

// 付款信息
const paymentInfo: ISchema = {
  'x-index': Indexs.one,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.paymentInfo' }),
    id: 'paymentInfo',
  },
  properties: {
    NO_SUBMIT_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 18,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 2,
      },
      properties: {
        currencyType: {
          type: 'string',
          enum: [],
          title: translate('web.resource.member.bibie'),
          'x-component-props': {
            getPopupContainer: '{{getPopupPaymentContainer}}',
            dropdownStyle: {
              zIndex: 998,
            },
          },
        },
        paymentType: {
          type: 'string',
          enum: [],
          title: translate('web.resource.member.fukuanfangshi'),
          'x-component-props': {
            getPopupContainer: '{{getPopupPaymentContainer}}',
            dropdownStyle: {
              zIndex: 998,
            },
          },
        },
      },
    },
  },
}

// 送货信息
const submitInfo: ISchema = {
  'x-index': Indexs.two,
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
          },
          properties: {
            deliverDate: {
              type: 'string',
              'x-component': 'date',
              title: getIntl().formatMessage({
                id: 'purchaseOrder.orderCollect.schema.deliverDate',
              }),
              'x-rules': [
                {
                  required: true,
                  message: getIntl().formatMessage({ id: 'common.bitian' }),
                },
              ],
              'x-component-props': {
                showTime: true,
                format: 'YYYY-MM-DD HH:mm',
                style: { width: 400 },
                locale: dateLocale(),
                disabledDate: (current) => {
                  return current && current < moment().startOf('day')
                },
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

// 合同下单 订单物料
export const orderMaterial: ISchema = {
  'x-index': Indexs.three,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.requisition.requisitionMaterial',
    }),
    id: 'orderMaterial',
    showTotal: true,
  },
  properties: {
    products: {
      type: 'array',
      'x-component': 'MultTable',
      'x-rules': [
        {
          required: true,
          message: getIntl().formatMessage({ id: 'common.bitian' }),
        },
      ],
      'x-component-props': {
        rowKey: 'productId',
        columns: '{{materialColumns}}',
        components: '{{materialComponents}}',
        prefix: '{{materialAddButton}}',
        scroll: { x: '100%' },
      },
    },
    NO_SUBMIT_SPY: {
      type: 'object',
      'x-component': 'moneyTotalBox',
    },
  },
}

// 发票信息
const invoiceInfo: ISchema = {
  'x-index': Indexs.four,
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
            labelCol: 2,
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
const ortherInfo: ISchema = {
  'x-index': Indexs.five,
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
    paymentInfo,
    submitInfo,
    orderMaterial,
    electronicInfo,
    invoiceInfo,
    ortherInfo,
  },
}
