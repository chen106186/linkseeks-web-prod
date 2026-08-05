import type { ISchema } from '@apps/formily'

export const classSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        columns: 16,
        labelAlign: 'top',
      },
      properties: {
        noField1: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            full: true,
          },
          'x-mega-props': {
            span: 1,
          },
          properties: {
            name: {
              type: 'string',
              title: '品类名称',
              required: true,
              'x-component-props': {
                placeholder: '请输入品类名称',
              },
              'x-rules': [
                {
                  // false 报错
                  pattern: /^(?![0-9])/,
                  message: '不能数字开头',
                },
                {
                  pattern:
                    /^[^`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]*$/,
                  message: '不能包含特殊字符',
                },
                {
                  limitByte: true,
                  maxByte: 16,
                },
              ],
            },
            type: {
              type: 'number',
              title: '品类类型',
              required: true,
              'x-component-props': {
                placeholder: '请选择品类类型',
              },
              enum: [
                { label: '实物商品', value: 1 },
                { label: '虚拟商品', value: 2 },
                { label: '服务商品', value: 3 },
                { label: '积分兑换商品', value: 4 },
              ],
            },
            imageUrl: {
              title: '品类图片',
              'x-component': 'CustomUpload',
            },
            sort: {
              type: 'number',
              title: '品类排序',
              required: true,
              'x-component-props': {
                placeholder: '请输入品类排序',
              },
            },
          },
        },
      },
    },
  },
}
