import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

// 基本信息
const basicInfo: ISchema = {
  'x-index': 0,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: intl.formatMessage({ id: 'saleOrder.jibenxinxi', defaultMessage: '基本信息' }),
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
        digest: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.danjuzhaiyao', defaultMessage: '单据摘要' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'saleOrder.qingshurudanju', defaultMessage: '请输入单据摘要' }),
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
          'x-mega-props': {
            span: 1,
          },
        },
        companyId: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.wuliufuwushang', defaultMessage: '物流服务商' }),
          enum: [],
          required: true,
        },
        companyName: {
          type: 'string',
          title: '物流服务商名称',
          visible: false,
        },
        shipperAddressId: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.fahuodizhi', defaultMessage: '发货地址' }),
          enum: [],
          required: true,
        },
        shipperName: {
          type: 'string',
          title: '发货方名称',
          visible: false,
        },
        shipperPhone: {
          type: 'string',
          title: '发货方手机',
          visible: false,
        },
        shipperFullAddress: {
          type: 'string',
          title: '发货方全地址',
          visible: false,
        },
      },
    },
  },
}

// 相关信息
const relatedInfo: ISchema = {
  'x-index': 1,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'saleOrder.xiangguanxinxi', defaultMessage: '相关信息' }),
    id: 'relatedInfo',
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
        shipmentOrderCode: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.duiyingfahuodan', defaultMessage: '对应发货单号' }),
          'x-component': 'text',
        },
        shipmentOrderId: {
          type: 'string',
          title: '发货单号ID',
          visible: false,
        },
        receiverAddress: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.shouhuodizhi', defaultMessage: '收货地址' }),
          'x-component': 'addressText',
        },
        receiverAddressId: {
          type: 'string',
          title: '收货地址ID',
          visible: false,
        },
        relevanceOrderCode: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.duiyingdingdanhao', defaultMessage: '对应订单号/售后单' }),
          'x-component': 'text',
        },
        relevanceOrderId: {
          type: 'string',
          title: '对应订单号ID',
          visible: false,
        },
        receiverName: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.shouhuofang', defaultMessage: '收货人' }),
          'x-component': 'text',
        },
        receiverPhone: {
          type: 'string',
          title: '收货人手机',
          visible: false,
        },
        receiverFullAddress: {
          type: 'string',
          title: '收货人全地址',
          visible: false,
        },
        // @此字段名称文档注释“收货方会员名称”与receiverName有异议，可能是采购会员名称、物流服务商名称，待确定后再做处理。
        receiverMemberName: {
          type: 'string',
          title: '采购会员名称',
          visible: false,
        },
        receiverMemberId: {
          type: 'string',
          title: '采购会员ID',
          visible: false,
        },
        receiverRoleId: {
          type: 'string',
          title: '采购会员角色ID',
          visible: false,
        },
      },
    },
  },
}

// 单据明细
const material: ISchema = {
  'x-index': 2,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: intl.formatMessage({ id: 'saleOrder.wuliudanmingxi', defaultMessage: '物流单明细' }),
    id: 'orderMaterial',
  },
  properties: {
    detailList: {
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

// 运费信息
const freightInfo: ISchema = {
  'x-index': 3,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: intl.formatMessage({ id: 'saleOrder.yunfeixinxi', defaultMessage: '运费信息' }),
    id: 'freightInfo',
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
        freight: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.yunfei', defaultMessage: '运费' }),
          'x-component': 'text',
        },
        settlementWay: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.jiesuanfangshi', defaultMessage: '结算方式' }),
          'x-component': 'text',
        },
      },
    },
  },
}

export const increaseSchema: ISchema = {
  type: 'object',
  properties: {
    basicInfo,
    relatedInfo,
    material,
    freightInfo,
  },
}
