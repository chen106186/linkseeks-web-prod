/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-06 14:20:17
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-13 11:23:45
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
const intl = getIntl()

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
            tab: intl.formatMessage({
              id: 'afterService.components.ReturnInfoDrawer.orderInfo',
              defaultMessage: '订单信息',
            }),
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
                  title: intl.formatMessage({
                    id: 'afterService.components.ReturnInfoDrawer.orderNo',
                    defaultMessage: '订单号',
                  }),
                  'x-component': 'Text',
                },
                productName: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'afterService.components.ReturnInfoDrawer.productName',
                    defaultMessage: 'productName',
                  }),
                  'x-component': 'Text',
                },
                category: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'afterService.components.ReturnInfoDrawer.category',
                    defaultMessage: '品类',
                  }),
                  'x-component': 'Text',
                },
                brand: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'afterService.components.ReturnInfoDrawer.brand',
                    defaultMessage: '品牌',
                  }),
                  'x-component': 'Text',
                },
                unit: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'afterService.components.ReturnInfoDrawer.unit',
                    defaultMessage: '单位',
                  }),
                  'x-component': 'Text',
                },
                purchaseCount: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'afterService.components.ReturnInfoDrawer.purchaseCount',
                    defaultMessage: '采购数量',
                  }),
                  'x-component': 'Text',
                },
                purchasePrice: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'afterService.components.ReturnInfoDrawer.purchasePrice',
                    defaultMessage: '采购单价',
                  }),
                  editable: false,
                  'x-component-props': {
                    addonBefore: translate('web.common.currencySymbol'),
                  },
                },
                purchaseAmount: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'afterService.components.ReturnInfoDrawer.purchaseAmount',
                    defaultMessage: '采购金额',
                  }),
                  editable: false,
                  'x-component-props': {
                    addonBefore: translate('web.common.currencySymbol'),
                  },
                },
                returnCount: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'afterService.components.ReturnInfoDrawer.returnCount',
                    defaultMessage: '退货数量',
                  }),
                  'x-component-props': {
                    allowClear: true,
                    style: {
                      maxWidth: 150,
                    },
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'afterService.components.ReturnInfoDrawer.returnCount.required',
                        defaultMessage: '请填写退货数量',
                      }),
                    },
                    {
                      pattern: PATTERN_MAPS.weight,
                      message: intl.formatMessage({
                        id: 'afterService.components.ReturnInfoDrawer.returnCount.legal',
                        defaultMessage: '请填写正数，最多保留3位小数',
                      }),
                    },
                  ],
                },
                remaining: {
                  type: 'string',
                  display: false,
                },
                orderType: {
                  type: 'string',
                  display: false,
                },
              },
            },
          },
        },
        'tab-2': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: intl.formatMessage({
              id: 'afterService.components.ReturnInfoDrawer.payInfo',
              defaultMessage: '支付信息',
            }),
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
                      // labelCol: 6,
                      // wrapperCol: 14,
                      grid: true,
                      columns: 2,
                      autoRow: true,
                    },
                    properties: {
                      payCount: {
                        type: 'string',
                        title: intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.payCount',
                          defaultMessage: '支付次数',
                        }),
                        'x-component': 'Text',
                      },
                      payNode: {
                        type: 'string',
                        title: intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.payNode',
                          defaultMessage: '支付环节',
                        }),
                        'x-component': 'Text',
                      },
                      payRatio: {
                        type: 'string',
                        title: intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.payRatio',
                          defaultMessage: '支付比例',
                        }),
                        editable: false,
                        'x-component-props': {
                          addonAfter: '%',
                        },
                      },
                      payAmount: {
                        type: 'string',
                        title: intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.payAmount',
                          defaultMessage: '支付金额',
                        }),
                        editable: false,
                        'x-component-props': {
                          addonBefore: translate('web.common.currencySymbol'),
                        },
                      },
                      payWay: {
                        type: 'string',
                        title: intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.payWayName',
                          defaultMessage: '支付方式',
                        }),
                        display: false,
                        'x-component': 'Text',
                      },
                      payWayName: {
                        type: 'string',
                        title: intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.payWayName',
                          defaultMessage: '支付方式',
                        }),
                        'x-component': 'Text',
                      },
                      channel: {
                        type: 'string',
                        title: intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.channelName',
                          defaultMessage: '支付渠道',
                        }),
                        display: false,
                        'x-component': 'Text',
                      },
                      channelName: {
                        type: 'string',
                        title: intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.channelName',
                          defaultMessage: '支付渠道',
                        }),
                        'x-component': 'Text',
                      },
                      refundAmount: {
                        type: 'string',
                        title: `${intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.refundAmount',
                          defaultMessage: '退款金额',
                        })}(${translate('web.common.currencySymbol')})`,
                        'x-component': 'Text',
                      },
                      payTime: {
                        type: 'string',
                        title: intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.payTime',
                          defaultMessage: '支付时间',
                        }),
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
            tab: intl.formatMessage({
              id: 'afterService.components.ReturnInfoDrawer.refundInfo',
              defaultMessage: '退款信息',
            }),
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
                  title: `${intl.formatMessage({
                    id: 'afterService.components.ReturnDetailInfo.refundAmount',
                    defaultMessage: '退款金额',
                  })}(${translate('web.common.currencySymbol')})`,
                  editable: false,
                },
                returnReason: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'afterService.components.ReturnInfoDrawer.returnReason',
                    defaultMessage: '退货原因',
                  }),
                  'x-component': 'textarea',
                  'x-component-props': {
                    rows: 4,
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'afterService.components.ReturnInfoDrawer.returnReason.required',
                        defaultMessage: '请填写退货原因',
                      }),
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
