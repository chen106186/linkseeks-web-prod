import { ISchema } from '@apps/formily'
import moment from 'moment'
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
        receiptsType: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.danjuleixing', defaultMessage: '单据类型' }),
          'x-component': 'text',
          default: intl.formatMessage({ id: 'saleOrder.xiaoshoufahuodan', defaultMessage: '销售发货单' }),
        },
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
        orderTime: {
          type: 'string',
          'x-component': 'date',
          title: intl.formatMessage({ id: 'saleOrder.danjushijian', defaultMessage: '单据时间' }),
          required: true,
          'x-component-props': {
            disabledDate: (current) => {
              return current && current < moment().startOf('day')
            },
            showTime: true,
            style: { width: '100%' },
          },
          'x-mega-props': {
            span: 1,
          },
        },
        inventoryName: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.duiyingcangku', defaultMessage: '对应仓库' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
          'x-mega-props': {
            span: 1,
          },
        },
        inventoryRole: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.cangkurenyuan', defaultMessage: '仓库人员' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 24,
            },
          ],
          'x-mega-props': {
            span: 1,
          },
        },
        remark: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.beizhu', defaultMessage: '备注' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 200,
            },
          ],
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
        receipts: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.duiyingdanju', defaultMessage: '对应单据' }),
          'x-component': 'text',
        },
        orderNo: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.guanliandanju', defaultMessage: '关联单据' }),
          'x-component': 'text',
        },
        buyerMemberName: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.huiyuanmingcheng', defaultMessage: '会员名称' }),
          'x-component': 'text',
        },
        address: {
          type: 'string',
          title: intl.formatMessage({ id: 'saleOrder.shouhuodizhi', defaultMessage: '收货地址' }),
          'x-component': 'addressText',
        },
        orderId: {
          type: 'number',
          title: '订单号',
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
    title: getIntl().formatMessage({ id: 'saleOrder.danjumingxi', defaultMessage: '单据明细' }),
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
  },
}
