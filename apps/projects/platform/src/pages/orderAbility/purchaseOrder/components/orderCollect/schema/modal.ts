import { ISchema } from '@apps/formily'

export const memberSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'Search',
      'x-component-props': {
        placeholder: '请输入会员名称',
      },
    },
  },
}
