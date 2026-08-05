import { ISchema } from '@apps/formily'
import { padRequiredMessage } from '@/utils'
import { getIntl } from '@linkseeks/i18n'

// 新增规则
export const ruleDetailSchema: ISchema = padRequiredMessage({
  type: 'object',
  properties: {
    REPOSIT_TABS: {
      type: 'object',
      'x-component': 'tab',
      'x-component-props': {
        type: 'card',
      },
      properties: {
        'tab-1': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({ id: 'processRuleSetting.jibenxinxi', defaultMessage: '基本信息' }),
          },
          properties: {
            MEGA_LAYOUT1: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 8,
                labelAlign: 'left',
              },
              properties: {
                name: {
                  type: 'string',
                  title: getIntl().formatMessage({
                    id: 'processRuleSetting.guizemingcheng',
                    defaultMessage: '规则名称',
                  }),
                  'x-component-props': {
                    placeholder: getIntl().formatMessage({
                      id: 'processRuleSetting.qingshuruguize',
                      defaultMessage: '请输入规则名称',
                    }),
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: getIntl().formatMessage({
                        id: 'processRuleSetting.qingshuruguize',
                        defaultMessage: '请输入规则名称',
                      }),
                    },
                    {
                      limitByte: true,
                      maxByte: 48,
                    },
                  ],
                },
                baseProcessId: {
                  type: 'string',
                  title: getIntl().formatMessage({
                    id: 'processRuleSetting.liuchengxuanze',
                    defaultMessage: '流程选择',
                  }),
                  'x-component': 'SelectProcesss',
                  'x-mega-props': {
                    style: {
                      full: true,
                    },
                  },
                  'x-component-props': {
                    dataSource: [],
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: getIntl().formatMessage({
                        id: 'processRuleSetting.qingxuanzeliucheng',
                        defaultMessage: '请选择流程配置',
                      }),
                    },
                  ],
                },
                expireHours: {
                  type: 'string',
                  title: `{{help('${getIntl().formatMessage({
                    id: 'processRuleSetting.dingdanquxiaoshi',
                    defaultMessage: '订单取消时间',
                  })}', '${getIntl().formatMessage({
                    id: 'processRuleSetting.xiadanhouchaoguoduo',
                    defaultMessage: '单后超过多少小时未支付后自动取消订单',
                  })}')}}`,
                  'x-component-props': {
                    placeholder: getIntl().formatMessage({
                      id: 'processRuleSetting.qingtianxiedingdan',
                      defaultMessage: '请填写订单取消时间',
                    }),
                    style: { width: '100%' },
                    suffix: getIntl().formatMessage({ id: 'processRuleSetting.xiaoshi', defaultMessage: '小时' }),
                  },
                  visible: false,
                  'x-rules': [
                    {
                      pattern: /^\d+(\.\d{1})?$/,
                      message: getIntl().formatMessage({
                        id: 'processRuleSetting.shuzhijinxianyi',
                        defaultMessage: '数值仅限一位小数',
                      }),
                    },
                  ],
                },
                MEGA_LAYOUT1_1: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  'x-component-props': {
                    label: getIntl().formatMessage({
                      id: 'processRuleSetting.dianzihetong',
                      defaultMessage: '电子合同',
                    }),
                    wrapperCol: 24,
                  },
                  properties: {
                    hasContract: {
                      type: 'string',
                      'x-component-props': {
                        children: getIntl().formatMessage({
                          id: 'processRuleSetting.shiyongdianzihe',
                          defaultMessage: '使用电子合同',
                        }),
                      },
                      'x-component': 'checkboxsingle',
                      default: false,
                      'x-linkages': [
                        {
                          type: 'value:visible',
                          target: 'contractTempleId',
                          condition: '{{$value}}',
                        },
                      ],
                    },
                    contractTempleId: {
                      type: 'string',
                      required: true,
                      enum: [],
                      'x-component-props': {
                        placeholder: getIntl().formatMessage({
                          id: 'processRuleSetting.qingxuanzedianzi',
                          defaultMessage: '请选择电子合同模板',
                        }),
                      },
                      visible: false,
                    },
                  },
                },
                // 处理成多个表格
                payments: {
                  type: 'array',
                  title: getIntl().formatMessage({ id: 'processRuleSetting.zhifupeizhi', defaultMessage: '支付配置' }),
                  'x-component': 'CustomPayments',
                  visible: false,
                },
                // "payments": {
                //   type: 'array:number',
                //   title: '支付配置',
                //   "x-component": 'MultTable',
                //   "x-component-props": {
                //     rowKey: 'batchNo',
                //     columns: "{{paymentColumns}}",
                //     components: "{{paymentComponents}}",
                //     pagination: false,
                //   },
                //   visible: false
                // },
                processType: {
                  type: 'number',
                  title: getIntl().formatMessage({
                    id: 'processRuleSetting.liuchengleixing',
                    defaultMessage: '流程类型',
                  }),
                  visible: false,
                },
              },
            },
          },
        },
        'tab-2': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({ id: 'processRuleSetting.shiyongshangcheng', defaultMessage: '适用商城' }),
          },
          properties: {
            MEGA_LAYOUT2: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                labelAlign: 'left',
              },
              properties: {
                shopIds: {
                  type: 'array:number',
                  'x-component': 'CardCheckBox',
                  'x-component-props': {
                    dataSource: [],
                    type: 'radio', // CardCheckBox 单选模式
                  },
                  title: getIntl().formatMessage({
                    id: 'processRuleSetting.shiyongshangcheng',
                    defaultMessage: '适用商城',
                  }),
                  'x-rules': [
                    {
                      required: true,
                      message: getIntl().formatMessage({ id: 'common.text.pleaseSelect' }),
                    },
                  ],
                },
              },
            },
          },
        },
        'tab-3': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({ id: 'processRuleSetting.shiyongshangpin', defaultMessage: '适用商品' }),
          },
          properties: {
            MEGA_LAYOUT3: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                labelAlign: 'left',
              },
              properties: {
                allProducts: {
                  type: 'radio',
                  enum: [
                    {
                      label: getIntl().formatMessage({
                        id: 'processRuleSetting.suoyoushangpin',
                        defaultMessage: '所有商品(默认)',
                      }),
                      value: true,
                    },
                    {
                      label: getIntl().formatMessage({
                        id: 'processRuleSetting.zhidingshangpin',
                        defaultMessage: '指定商品',
                      }),
                      value: false,
                    },
                  ],
                  title: getIntl().formatMessage({
                    id: 'processRuleSetting.shiyongshangpin',
                    defaultMessage: '适用商品',
                  }),
                  default: true,
                  required: true,
                  'x-linkages': [
                    {
                      type: 'value:visible',
                      target: 'products',
                      condition: '{{$value === false}}',
                    },
                  ],
                },
                products: {
                  type: 'array:number',
                  'x-component': 'MultTable',
                  'x-component-props': {
                    rowKey: 'id',
                    columns: '{{tableColumns}}',
                    prefix: '{{tableAddButton}}',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
})
