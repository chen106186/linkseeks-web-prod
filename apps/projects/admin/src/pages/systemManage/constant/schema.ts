export const schema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'space-between',
        },
      },
      properties: {
        ctl: {
          type: 'object',
          'x-component': 'controllerBtns',
        },
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: '流程规则名称',
            advanced: false,
          },
        },
      },
    },
  },
}
