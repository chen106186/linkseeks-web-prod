import { ISchema } from '@apps/formily'

export const menuSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        columns: 1,
        labelAlign: 'top',
      },
      properties: {
        noField1: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: 'top',
          },
          'x-mega-props': {
            span: 2,
            full: true,
          },
          properties: {
            title: {
              type: 'string',
              title: '菜单名称',
              'x-rules': [
                {
                  required: true,
                  message: '请输入菜单名称',
                },
                {
                  limitByte: true,
                  maxByte: 16,
                },
              ],
              'x-component-props': {
                placeholder: '请输入菜单名称',
              },
            },
            url: {
              type: 'string',
              title: '菜单链接',
              'x-rules': [
                {
                  required: true,
                  message: '请输入菜单链接',
                },
              ],
            },
            code: {
              type: 'string',
              title: '菜单编码',
            },
            order: {
              type: 'number',
              title: '菜单排序',
              'x-rules': [
                {
                  required: true,
                  message: `请输入菜单排序`,
                },
                {
                  pattern: /^([1-9]|[0-9][0-9]|[1-9][0-9][0-9]|1000)$/,
                  message: '排序必须大于0小于10000',
                },
              ],
              'x-mega-props': {
                full: true,
              },
            },
            dataAuthConfig: {
              type: 'boolean',
              title: '是否可配置数据权限',
            },
          },
        },
        noField2: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: 'top',
          },
          'x-mega-props': {
            span: 2,
            full: true,
          },
          properties: {
            remark: {
              type: 'textarea',
              title: '菜单描述',
              'x-rules': [
                {
                  limitByte: true,
                  maxByte: 100,
                },
              ],
              default: '',
              'x-component-props': {
                rows: 5,
                placeholder: '最多100个字符,50个汉字',
              },
            },
            attrs: {
              type: 'textarea',
              title: '菜单属性',
              'x-rules': [
                {
                  required: true,
                  message: '请输入菜单属性',
                },
              ],
              'x-component-props': {
                rows: 5,
              },
            },
            up: {
              type: 'boolean',
              title: '是否需要合并到上一级',
              default: 0,
            },
          },
        },
      },
    },
  },
}
