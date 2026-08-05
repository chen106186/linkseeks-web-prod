import { ISchema } from '@apps/formily'

export const menuSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        noField1: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            full: true,
            span: 1,
          },
          properties: {
            name: {
              type: 'string',
              title: '菜单名称',
              'x-rules': [
                {
                  required: true,
                  message: '请输入菜单名称',
                },
                {
                  limitByte: true,
                  maxByte: 32,
                },
              ],
              'x-component-props': {
                placeholder: '请输入菜单名称',
              },
            },
            path: {
              type: 'string',
              title: '菜单链接',
              'x-rules': [
                {
                  required: true,
                  message: '请输入菜单链接',
                },
              ],
            },
            languageList: {
              type: 'array',
              title: '多语言配置',
              'x-component': 'arraytable',
              'x-component-props': {},
              items: {
                type: 'object',
                properties: {
                  lanauage: {
                    type: 'string',
                    title: '语言',
                  },
                  content: {
                    type: 'string',
                    title: '翻译',
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
