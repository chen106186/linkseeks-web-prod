import type { ISchema } from '@apps/formily'
import moment from 'moment'
import { getPaymentInfo, schemas } from '../../../componentSchema'
import { getIntl } from '@linkseeks/i18n'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

enum Indexs {
  zero = 0,
  one_,
  one,
  two,
  three,
  Index,
  four,
  five,
}
const { electronicInfo } = schemas(Indexs.Index)
const paymentInfo = getPaymentInfo(Indexs.one_)
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
        // grid: true,
        full: true,
        autoRow: true,
        columns: 2,
      },
      properties: {
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
              label: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.type' }),
              value: 15,
            },
          ],
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.orderMode' }),
          default: 15,
          'x-component-props': {
            disabled: true,
          },
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
        requisitionNo: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'purchaseOrder.orderCollect.requisition.requisitionNo',
          }),
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'common.bitian' }),
            },
          ],
          'x-component-props': {
            disabled: true,
            addonAfter: '{{orderRequisition}}',
          },
        },
        vendorMemberName: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'purchaseOrder.orderCollect.schema.vendorMemberName',
            defaultMessage: '供应商',
          }),
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
        requisitionId: {
          type: 'object',
          title: '请购单ID',
          visible: false,
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
          default: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.typeText' }),
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
          },
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
        warehouseName: {
          type: 'string',
          title: '下单仓库名称',
          visible: false,
        },
      },
    },
  },
}

// 合同下单 订单物料
export const orderMaterial: ISchema = {
  'x-index': Indexs.two,
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
        rowKey: 'orderProductId',
        columns: '{{materialColumns}}',
        components: '{{materialComponents}}',
        prefix: '{{materialAddButton}}',
        pagination: {
          size: 'small',
        },
        scroll: { x: '100%' },
      },
    },
    NO_SUBMIT_SPY: {
      type: 'object',
      'x-component': 'moneyTotalBox',
    },
  },
}

// 送货信息
const submitInfo: ISchema = {
  'x-index': Indexs.one,
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
                placeholder: '请选择日期',
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
