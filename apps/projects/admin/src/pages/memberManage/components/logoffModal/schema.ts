import { ISchema } from '@apps/formily'

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
        verify: {
          type: 'string',
          default: true,
          enum: [
            { label: '审核通过', value: true },
            { label: '审核不通过', value: false },
          ],
          'x-component': 'radio',
          'x-component-props': {},
        },
        cancellationComments: {
          type: 'string',
          title: '审核意见',
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
