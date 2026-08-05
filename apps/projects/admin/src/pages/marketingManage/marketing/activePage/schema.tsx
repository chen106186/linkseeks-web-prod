import { ISchema } from '@apps/formily'

const schema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        // full: true,
        // columns: 2,
        // grid: true,
        // labelCol: 4,
        // wrapperCol: 17,
      },
      properties: {
        left: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: 'left',
            columns: 2,
            labelCol: 5,
            wrapperCol: 17,
          },
          properties: {
            name: {
              type: 'string',
              title: '活动页名称',
              'x-rules': [
                {
                  required: true,
                  message: '请填写活动名称',
                },
                {
                  limitByte: true,
                  maxByte: 60,
                },
              ],
            },
            environment: {
              type: 'string',
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
              title: '活动页使用环境',
              required: true,
              'x-linkages': [
                {
                  type: 'value:visible',
                  target: 'template',
                  condition: '{{!!$value}}',
                },
              ],
            },
          },
        },
        right: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: 'left',
            columns: 2,
            labelCol: 5,
            wrapperCol: 17,
          },
          properties: {
            '[startTime, endTime]': {
              type: 'object',
              title: '活动页有效时间',
              'x-component': 'RangeTime',
              'x-component-props': {
                showTime: true,
              },
              required: true,
            },
            shopId: {
              type: 'string',
              title: '活动页适用商城',
              enum: [],
              required: true,
            },
            shopName: {
              type: 'string',
              title: '商城名',
              display: false,
            },
          },
        },
      },
    },
  },
}

export default schema
