import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

export const auditSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'ControllerBtns',
            },
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: '搜索',
                tip: '输入 会员名称 进行搜索',
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            memberType: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '会员类型(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            // status: {
            //   type: 'string',
            //   default: undefined,
            //   enum: [],
            //   'x-component-props': {
            //     placeholder: '会员状态(全部)',
            //     allowClear: true,
            //   },
            // },
            roleId: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '会员角色(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            level: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '会员等级(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            source: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '申请来源(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            '[startDate, endDate]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '时间范围(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: '查询',
              },
            },
          },
        },
      },
    },
  },
}

export const auditModalSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        agree: {
          type: 'string',
          default: 1,
          enum: [
            { label: '审核通过', value: 1 },
            { label: '审核不通过', value: 0 },
          ],
          'x-component': 'radio',
          'x-component-props': {},
        },
        reason: {
          type: 'string',
          title: '审核不通过原因',
          'x-component': 'textarea',
          required: true,
          'x-component-props': {
            placeholder: '在此输入你的内容，最长120个字符，60个汉字',
            rows: 5,
          },
          'x-rules': [
            {
              limitByte: true, // 自定义校验规则
              maxByte: 120,
            },
          ],
        },
      },
    },
  },
}
