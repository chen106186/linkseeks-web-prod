import { ISchema } from '@apps/formily'

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        roleName: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: '搜索',
            align: 'flex-left',
            tip: '输入 会员角色 进行搜索',
            advanced: false,
          },
        },
      },
    },
  },
}
