import { ISchema } from '@apps/formily'

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    memberName: {
      type: 'string',
      'x-mega-props': {
        wrapperCol: 12,
      },
      'x-component': 'Search',
      'x-component-props': {
        placeholder: '搜索',
        align: 'flex-left',
        tip: '输入 会员名称 进行搜索',
        advanced: false,
      },
    },
  },
}
