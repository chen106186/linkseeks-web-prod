import type { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import moment from 'moment'
import { getPaymentInfo, schemas } from '../../../componentSchema'

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
const paymentInfo = getPaymentInfo(Indexs.one)
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
        contractNo: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.contractNo' }),
          'x-component-props': {
            disabled: true,
          },
          'x-linkages': [
            {
              type: 'value:schema',
              target: 'vendorMemberName',
              condition: `{{$self.editable && !!$value}}`,
              schema: {
                'x-component-props': {
                  disabled: true,
                  addonAfter: '',
                },
              },
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
          enum: [],
          title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.orderMode' }),
          'x-linkages': [
            // 联动显示选择合同按钮
            {
              type: 'value:schema',
              target: 'contractNo',
              condition: `{{!!$value && orderCombination.showPurchaseContractBtn.includes($value)}}`,
              schema: {
                'x-component-props': {
                  disabled: true,
                  addonAfter: '{{orderContract}}',
                },
              },
              otherwise: {
                visible: true,
                'x-component-props': {
                  disabled: true,
                  addonAfter: '',
                },
              },
            },
          ],
        },
        vendorMemberName: {
          type: 'string',
          title: getIntl().formatMessage({
            id: 'purchaseOrder.orderCollect.schema.vendorMemberName',
          }),
          'x-component-props': {
            disabled: true,
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
        contract: {
          type: 'object',
          title: '采购合同信息',
          visible: false,
        },
      },
    },
  },
}

// 合同下单 订单物料
export const orderMaterials: ISchema = {
  'x-index': Indexs.two,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.requisition.requisitionMaterial',
    }),
    id: 'orderMaterials',
    showTotal: true,
  },
  properties: {
    products: {
      type: 'array',
      'x-component': 'MultTable',
      'x-component-props': {
        // rowKey: 'materialId',
        rowKey: 'productId',
        columns: '{{materialColumns}}',
        components: '{{materialComponents}}',
        prefix: '{{materialAddButton}}',
        scroll: { x: 1400 },
        expandable: '{{expandable}}',
      },
    },
    // 仅合同下单时备用参数数据
    ordeProducts: {
      type: 'array',
      title: '合同下单记录',
      visible: false,
    },
    NO_SUBMIT_SPY: {
      type: 'object',
      'x-component': 'moneyTotalBox',
    },
  },
}

// 送货信息
const submitInfo: ISchema = {
  'x-index': Indexs.three,
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
                disabledDate: (current) => {
                  return current && current < moment().startOf('m')
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
          // title: getIntl().formatMessage({id: 'purchaseOrder.orderCollect.schema.hasInvoice'}),
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
            placeholder: '最长100个字符，50个汉字',
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
            placeholder: '最长100个字符，50个汉字',
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
    orderMaterials,
    submitInfo,
    electronicInfo,
    invoiceInfo,
    ortherInfo,
  },
}

export const mergeAllSchemas = {
  ...orderAddSchema,
}
