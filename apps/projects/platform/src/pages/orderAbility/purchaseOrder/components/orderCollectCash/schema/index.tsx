import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { Tooltip, Empty } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import styles from '../index.less'
import locale from 'antd/es/locale/zh_CN'
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
        wrapperCol: 18,
        labelAlign: 'left',
        // grid: true,
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
        vendorMemberName: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.vendorMemberName' }),
          'x-component-props': {
            disabled: true,
            addonAfter: '{{orderMember}}',
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'common.bitian' }),
            },
          ],
        },
        shopId: {
          type: 'number',
          enum: [],
          'x-component-props': {
            notFoundContent: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '12px 0' }} />,
          },
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.shopId' }),
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'common.bitian' }),
            },
          ],
        },
        orderMode: {
          type: 'number',
          required: true,
          enum: [],
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.orderMode' }),
          'x-component-props': {
            notFoundContent: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '12px 0' }} />,
          },
        },
        vendorMemberId: {
          type: 'string',
          display: false,
        },
        vendorRoleId: {
          type: 'string',
          display: false,
        },
        type: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.type' }),
          'x-component': 'text',
        },
        warehouseId: {
          type: 'string',
          title: (
            <Tooltip title={getIntl().formatMessage({ id: 'order.warehouseHouse.tips' })}>
              {getIntl().formatMessage({ id: 'order.warehouseHouse' })}
              <QuestionCircleOutlined style={{ color: '#909399', marginLeft: 5 }} />
            </Tooltip>
          ),
          enum: [],
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            allowClear: true,
            notFoundContent: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '12px 0' }} />,
          },
        },
        digest: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.digest' }),
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.digestMessage' }),
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
        },
        buyerMemberName: {
          type: 'string',
          display: false,
        },
        buyerRoleId: {
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
        warehouseName: {
          type: 'string',
          title: '下单仓库名称',
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
      'x-rules': [
        {
          required: true,
          message: getIntl().formatMessage({ id: 'common.bitian' }),
        },
      ],
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
              title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.deliverDate' }),
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
              },
            },
            timeLine: {
              title: ' ',
              type: 'radio',
              enum: [],
              visible: false,
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
                  message: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.deliveryAddresIdMessage' }),
                },
              ],
              title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.deliveryAddresId' }),
            },
          },
        },
        // deliveryAddresId: {
        //   type: 'string',
        //   "x-component": 'SelectAddress',
        //   "x-component-props": {
        //     dataSource: [],
        //     times: 0,
        //   },
        //   "x-rules": [
        //     {
        //       required: true,
        //       message: '请选择送货地址'
        //     }
        //   ],
        //   title: '送货地址'
        // }
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
            children: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.hasInvoiceChildren' }),
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
    ortherInfo,
  },
}

// 根据传入的query参数 判断当前使用哪个schema
export const mergeAllSchemas = {
  // 新增订单详情
  ...orderAddSchema,
}
