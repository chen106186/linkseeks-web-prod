import { ISchema } from '@apps/formily'

const schema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        full: true,
        labelAlign: 'top',
      },
      properties: {
        statusLayout: {
          type: 'object',
          'x-component': 'VerticalLayout',
          'x-component-props': {
            title: '状态',
          },
          properties: {
            status: {
              type: 'string',
              title: '',
              'x-component': 'FormilyCheckBox',
              'x-component-props': {
                isRadio: true,
              },
              enum: [
                {
                  label: '待上线',
                  value: 1,
                },
                {
                  label: '已上线',
                  value: 2,
                },
                {
                  label: '进行中',
                  value: 3,
                },
                {
                  label: '已下线',
                  value: 4,
                },
                {
                  label: '已结束',
                  value: 5,
                },
              ],
            },
          },
        },
        timeLayout: {
          type: 'string',
          'x-component': 'VerticalLayout',
          'x-component-props': {
            title: '有效期',
          },
          properties: {
            startTime: {
              title: '开始',
              'x-component': 'DatePicker',
              'x-component-props': {
                showTime: true,
                format: 'YYYY-MM-DD HH:mm:ss',
              },
            },
            endTime: {
              title: '结束：',
              type: 'string',
              'x-component': 'DatePicker',
              'x-component-props': {
                showTime: true,
                format: 'YYYY-MM-DD HH:mm:ss',
              },
            },
          },
        },
        environmentLayout: {
          type: 'object',
          'x-component': 'VerticalLayout',
          'x-component-props': {
            title: '适用环境',
          },
          properties: {
            environment: {
              type: 'string',
              title: '',
              'x-component': 'FormilyCheckBox',
              'x-component-props': {
                isRadio: true,
              },
              enum: [
                {
                  label: 'WEB',
                  value: 1,
                },
                {
                  label: 'H5',
                  value: 2,
                },
                {
                  label: '小程序',
                  value: 3,
                },
                {
                  label: 'APP',
                  value: 4,
                },
              ],
            },
          },
        },
      },
    },
  },
}

export default schema
