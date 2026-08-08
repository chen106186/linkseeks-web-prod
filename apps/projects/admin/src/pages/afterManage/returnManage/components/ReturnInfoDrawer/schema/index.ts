/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-06 14:20:17
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-07 16:18:56
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'

const schema: ISchema = {
  type: 'object',
  properties: {
    REPOSIT_TABS: {
      type: 'object',
      'x-component': 'tab',
      'x-component-props': {
        tabPosition: 'left',
        hiddenKeys: ['tab-2'],
      },
      properties: {
        'tab-1': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: '订单信息',
          },
          properties: {
            MEGA_LAYOUT_1: {
              type: 'object',
              'x-component': 'Mega-Layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 20,
              },
              properties: {
                orderNo: {
                  type: 'string',
                  title: '订单号',
                  'x-component': 'Text',
                },
                productName: {
                  type: 'string',
                  title: '商品名称',
                  'x-component': 'Text',
                },
                category: {
                  type: 'string',
                  title: '品类',
                  'x-component': 'Text',
                },
                brand: {
                  type: 'string',
                  title: '品牌',
                  'x-component': 'Text',
                },
                unit: {
                  type: 'string',
                  title: '单位',
                  'x-component': 'Text',
                },
                purchaseCount: {
                  type: 'string',
                  title: '采购数量',
                  'x-component': 'Text',
                },
                purchasePrice: {
                  type: 'string',
                  title: '采购单价',
                  editable: false,
                  'x-component-props': {
                    addonBefore: '¥ ',
                  },
                },
                purchaseAmount: {
                  type: 'string',
                  title: '采购金额',
                  editable: false,
                  'x-component-props': {
                    addonBefore: '¥ ',
                  },
                },
                returnCount: {
                  type: 'string',
                  title: '退货数量',
                  'x-component-props': {
                    allowClear: true,
                    style: {
                      maxWidth: 150,
                    },
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: '请填写退货数量',
                    },
                    {
                      pattern: PATTERN_MAPS.weight,
                      message: '请填写正数，最多保留3位小数',
                    },
                  ],
                },
              },
            },
          },
        },
        'tab-2': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: '支付信息',
          },
          properties: {
            payList: {
              type: 'array',
              'x-component': 'SteamerTicket',
              items: {
                type: 'object',
                properties: {
                  MEGA_LAYOUT_2: {
                    'x-component': 'Mega-Layout',
                    'x-component-props': {
                      labelCol: 6,
                      wrapperCol: 14,
                      grid: true,
                      columns: 2,
                      autoRow: true,
                    },
                    properties: {
                      payCount: {
                        type: 'string',
                        title: '支付次数',
                        'x-component': 'Text',
                      },
                      payNode: {
                        type: 'string',
                        title: '支付环节',
                        'x-component': 'Text',
                      },
                      payRatio: {
                        type: 'string',
                        title: '支付比例',
                        editable: false,
                        'x-component-props': {
                          addonAfter: '%',
                        },
                      },
                      payAmount: {
                        type: 'string',
                        title: '支付金额',
                        editable: false,
                        'x-component-props': {
                          addonBefore: '¥ ',
                        },
                      },
                      payWay: {
                        type: 'string',
                        title: '支付方式',
                        display: false,
                        'x-component': 'Text',
                      },
                      payWayName: {
                        type: 'string',
                        title: '支付方式',
                        'x-component': 'Text',
                      },
                      channel: {
                        type: 'string',
                        title: '支付渠道',
                        display: false,
                        'x-component': 'Text',
                      },
                      channelName: {
                        type: 'string',
                        title: '支付渠道',
                        'x-component': 'Text',
                      },
                      refundAmount: {
                        type: 'string',
                        title: '退款金额(元)',
                      },
                      payTime: {
                        type: 'string',
                        title: '支付时间',
                        'x-component': 'Text',
                      },
                    },
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
            tab: '退款信息',
          },
          properties: {
            MEGA_LAYOUT_3: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
              },
              properties: {
                refundAmount: {
                  type: 'string',
                  title: '退款金额(元)',
                  editable: false,
                  'x-component-props': {
                    addonBefore: '¥ ',
                  },
                },
                returnReason: {
                  type: 'string',
                  title: '退货原因',
                  'x-component': 'textarea',
                  'x-component-props': {
                    rows: 4,
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: '请填写退货原因',
                    },
                    {
                      limitByte: true, // 自定义校验规则
                      maxByte: 60,
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
}

export default schema
