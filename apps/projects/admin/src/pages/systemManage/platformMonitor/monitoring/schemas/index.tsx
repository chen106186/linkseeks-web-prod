import { ISchema } from '@apps/formily'

export const monitoringIndexQuerySchema: ISchema = {
  type: 'object',
  properties: {
    FLEX_LAYOUT: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'flex-start',
          // flexWrap: 'nowrap',
          columnGap: 16,
        },
      },
      properties: {
        body: {
          type: 'string',
          'x-component-props': {
            placeholder: '信息体（json）',
            allowClear: true,
          },
        },
        remark: {
          type: 'string',
          'x-component-props': {
            placeholder: '错误日志（告警内容）',
            allowClear: true,
          },
        },
        type: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            style: {
              width: 138,
            },
            placeholder: '数据流向(全部)',
            allowClear: true,
          },
        },
        url: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            style: {
              width: 198,
            },
            placeholder: '主题(全部)',
            allowClear: true,
          },
        },
        '[startTime, endTime]': {
          type: 'string',
          'x-component': 'RangePicker',
          'x-component-props': {
            style: {
              width: 268,
            },
            placeholder: ['起始时间', '截止时间'],
            allowEmpty: [true, true],
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-component-props': {
            children: '查询',
          },
        },
      },
    },
  },
}

export const monitoringBodyJsonEditSchema: ISchema = {
  type: 'object',
  properties: {
    body: {
      type: 'string',
      default: '',
      'x-component': 'textarea',
      'x-component-props': {
        placeholder: '消息体（json）',
        rows: 30,
      },
      'x-rules': [
        {
          validator: (value) => {
            try {
              return !JSON.parse(value)
            } catch (error) {
              return true
            }
          },
          message: '请输入合法的JSON字符串',
        },
      ],
    },
  },
}
