import { ISchema } from '@apps/formily'

export const menuSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
        wrapperCol: 12,
      },
      properties: {
        code: {
          type: 'string',
          title: '组织代码',
          'x-rules': [
            {
              message: '请输入组织代码',
              required: true,
            },
            {
              limitByte: true,
              maxByte: 12,
            },
          ],
        },
        title: {
          type: 'string',
          title: '组织机构',
          'x-rules': [
            {
              message: '请输入组织机构',
              required: true,
            },
            {
              limitByte: true,
              maxByte: 40,
            },
          ],
        },
        remark: {
          type: 'textarea',
          title: '描述',
          'x-component-props': {
            rows: 4,
          },
          'x-rules': [
            {
              limitByte: true,
              maxByte: 64,
            },
          ],
        },
      },
    },
  },
}
