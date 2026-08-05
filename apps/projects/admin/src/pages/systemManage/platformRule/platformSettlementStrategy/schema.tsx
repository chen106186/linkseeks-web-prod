import { ISchema } from '@apps/formily'

const schema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        columns: 2,
        // columns: 6,
      },
      properties: {
        createBtn: {
          type: 'object',
          'x-component': 'Children',
          'x-component-props': {
            children: '{{createBtn}}',
          },
          'x-mega-props': {
            span: 4,
          },
        },
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {
            span: 2,
          },
          'x-component-props': {
            placeholder: '搜索策略名称',
            advanced: false,
          },
        },
      },
    },
  },
}

export default schema
