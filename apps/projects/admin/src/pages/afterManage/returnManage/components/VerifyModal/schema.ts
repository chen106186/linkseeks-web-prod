import { ISchema } from '@apps/formily'

const schema: ISchema = {
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
          title: '不通过原因',
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

export default schema
