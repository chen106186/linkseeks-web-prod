import { getIntl } from '@linkseeks/i18n'

import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'

const intl = getIntl()

/**
 * index.tsx schem
 * 列表页搜索schema
 */

export const indexSchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        columns: 6,
      },
      properties: {
        createBtn: {
          type: 'object',
          'x-component': 'Children',
          'x-component-props': {
            children: '{{createBtn}}',
          },
          'x-mega-props': {
            span: 4,
          },
        },
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {
            span: 2,
          },
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'balance.settleRules.memberSettle.info.schema.indexSchema.name' }),
            advanced: false,
          },
        },
      },
    },
  },
}

/**
 * 新增会员结算策略schema
 *
 */

export const memberSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'balance.settleRules.memberSettle.info.schema.memberSchema.name' }),
        align: 'flex-left',
        advanced: false,
      },
    },
    // [FORM_FILTER_PATH]: {
    //   type: 'object',
    //   'x-component': 'flex-layout',
    //   'x-component-props': {
    //     rowStyle: {
    //       flexWrap: 'nowrap',
    //       style: {
    //         marginRight: 0
    //       }
    //     },
    //     colStyle: {
    //       marginTop: 20,
    //     },
    //   },
    //   properties: {
    //     roleId: {
    //       type: 'string',
    //       enum: [],
    //       "x-component-props": {
    //         placeholder: intl.formatMessage({ id: 'balance.settleRules.memberSettle.info.schema.memberSchema.roleId' }),
    //         style: { width: '200px' }
    //       }
    //     },

    //     submit: {
    //       "x-component": 'Submit',
    //       "x-mega-props": {
    //         span: 1
    //       },
    //       "x-component-props": {
    //         children: intl.formatMessage({ id: 'balance.settleRules.memberSettle.info.schema.memberSchema.submit' })
    //       }
    //     }
    //   }
    // }
  },
}

export const infoSchema: ISchema = {
  type: 'object',
  properties: {
    card: {
      type: 'object',
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: intl.formatMessage({
          id: 'balance.settleRules.memberSettle.info.schema.addSchema.basicTab',
          defaultMessage: '基本信息',
        }),
      },
      properties: {
        layout: {
          type: 'object',
          'x-component': 'LeftRightLayout',
          'x-component-props': {
            leftProps: {
              span: 12,
            },
            rightProps: {
              span: 11,
            },
            wrapProps: {
              align: 'start',
              justify: 'space-between',
            },
          },
          properties: {
            leftLayout: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 5,
                full: true,
                labelAlign: 'left',
                position: 'left',
              },
              properties: {
                name: {
                  title: intl.formatMessage({
                    id: 'balance.settleRules.memberSettle.info.schema.addSchema.basicTab.name',
                  }),
                  type: 'string',
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'balance.settleRules.memberSettle.info.schema.addSchema.basicTab.name.message',
                      }),
                    },
                    {
                      limitByte: true,
                      maxByte: 48,
                    },
                  ],
                },
                settlementWay: {
                  title: intl.formatMessage({
                    id: 'balance.settleRules.memberSettle.info.schema.addSchema.basicTab.settlementWay',
                  }),
                  'x-component': 'SettleMethod',
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'balance.settleRules.memberSettle.info.schema.addSchema.basicTab.settlementWay.message',
                      }),
                    },
                    {
                      settleMethodRule: true,
                    },
                  ],
                  'x-component-props': {
                    options: {
                      days: true,
                      month: true,
                    },
                    default: {
                      active: 1,
                      otherValues: [30, 1],
                    },
                  },
                },
              },
            },
            rightLayout: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 8,
                full: true,
                labelAlign: 'left',
                position: 'right',
              },
              properties: {
                settlementOrderType: {
                  type: 'string',
                  enum: [],
                  title: intl.formatMessage({
                    id: 'balance.settleRules.memberSettle.info.schema.addSchema.basicTab.settlementOrderType',
                  }),
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'balance.settleRules.memberSettle.info.schema.addSchema.basicTab.settlementOrderType.message',
                      }),
                    },
                  ],
                },
                settlementPaymentType: {
                  type: 'string',
                  enum: [],
                  title: intl.formatMessage({ id: 'balance.jiesuanzhifufangshi' }),
                  'x-rules': [
                    { required: true, message: intl.formatMessage({ id: 'balance.qingtianxiejiesuanzhifufang' }) },
                  ],
                },
              },
            },
          },
        },
      },
    },
    memberCard: {
      type: 'object',
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: intl.formatMessage({
          id: 'balance.settleRules.memberSettle.info.schema.addSchema.memberTab',
          defaultMessage: '适用会员',
        }),
        style: {
          marginTop: '12px',
        },
      },
      properties: {
        someLists: {
          type: 'array:number',
          'x-mega-props': {
            wrapperCol: 24,
          },
          'x-component': 'MultTable',
          'x-component-props': {
            rowKey: 'uniqueId',
            prefix: '{{tableAddButton}}',
            columns: '{{tableColumns}}',
            // columns: "{{tableColumns}}",
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'balance.settleRules.memberSettle.info.schema.addSchema.memberTab.someLists',
              }),
            },
          ],
        },
      },
    },
  },
}
