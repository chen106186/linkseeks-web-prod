import { ISchema } from '@apps/formily'

export const schema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'ControllerBtns',
            },
            layout: {
              type: 'object',
              'x-component': 'flex-layout',
              'x-component-props': {
                colStyle: {
                  marginLeft: 20,
                },
              },
              properties: {
                '[startDate, endDate]': {
                  type: 'daterange',
                  'x-component-props': {
                    placeholder: ['发布开始时间', '发布结束时间'],
                    allowClear: true,
                  },
                },
                submit: {
                  'x-component': 'Submit',
                  'x-mega-props': {
                    span: 1,
                  },
                  'x-component-props': {
                    children: '查询',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}
