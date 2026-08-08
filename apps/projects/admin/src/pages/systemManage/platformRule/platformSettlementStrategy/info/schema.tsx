import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
/**
 * 新增会员结算策略schema
 *
 */

export const memberSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: '搜索会员名称',
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
    //         placeholder: '选择会员角色',
    //         style: {width: '200px'},
    //         allowClear: true,
    //       }
    //     },
    //     memberType: {
    //       type: 'string',
    //       enum: [],
    //       "x-component-props": {
    //         placeholder: '选择会员类型',
    //         style: {width: '200px'},
    //         allowClear: true,
    //       }
    //     },
    //     level: {
    //       type: 'string',
    //       enum: [],
    //       "x-component-props": {
    //         placeholder: '选择会员等级',
    //         style: {width: '200px'},
    //         allowClear: true,
    //       }
    //     },
    //     submit: {
    //       "x-component": 'Submit',
    //       "x-mega-props": {
    //         span: 1
    //       },
    //       "x-component-props": {
    //         children: '查询'
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
        title: '基本信息',
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
              span: 10,
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
                labelCol: 4,
                full: true,
                labelAlign: 'left',
                position: 'left',
              },
              properties: {
                name: {
                  title: '策略名称',
                  type: 'string',
                  'x-rules': [
                    { required: true, message: '请填写策略名称' },
                    {
                      limitByte: true,
                      maxByte: 48,
                    },
                  ],
                },
                settlementWay: {
                  title: '结算方式',
                  'x-component': 'SettleMethod',
                  'x-rules': [
                    {
                      required: true,
                      message: '请选择结算方式',
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
                labelCol: 4,
                full: true,
                labelAlign: 'left',
                position: 'right',
              },
              properties: {
                settlementOrderType: {
                  type: 'string',
                  enum: [],
                  title: '结算单据',
                  'x-rules': [
                    {
                      required: true,
                      message: '请选择结算单据',
                    },
                  ],
                },
                settlementPaymentType: {
                  type: 'string',
                  enum: [],
                  title: '结算方式',
                  'x-rules': [
                    {
                      required: true,
                      message: '请选择结算方式',
                    },
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
        title: '适用会员',
        style: {
          marginTop: '12px',
        },
      },
      properties: {
        isDefault: {
          type: 'radio',
          enum: [
            { label: '所有会员(默认)', value: 1 },
            { label: '指定会员', value: 0 },
          ],
          // default: 1,
          title: '适用会员',
          'x-linkages': [
            {
              type: 'value:visible',
              target: '*(someLists)',
              condition: '{{$value === 0}}',
            },
          ],
        },
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
              message: '请选择适用会员',
            },
          ],
        },
      },
    },
  },
}
