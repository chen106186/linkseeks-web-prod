import { ISchema } from '@apps/formily'

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
            labelCol: 4,
            wrapperWidth: 507,
          },
          'x-mega-props': {
            span: 1,
          },
          properties: {
            name: {
              type: 'string',
              title: '分类名称',
              required: true,
              'x-component-props': {
                placeholder: '请输入品类名称',
              },
              'x-rules': [
                {
                  limitByte: true,
                  maxByte: 16,
                },
              ],
            },
            describe: {
              type: 'textarea',
              title: '类型',
              required: true,
              'x-component-props': {
                placeholder: '最多100个字符，50个汉字',
              },
              'x-rules': [
                {
                  limitByte: true,
                  maxByte: 100,
                },
              ],
            },
            level: {
              type: 'string',
              visible: false,
              'x-linkages': [
                {
                  type: 'value:visible',
                  target: '*(inlineLayout)',
                  condition: '{{$value === 3}}',
                },
              ],
            },
            inlineLayout: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                inline: true,
              },
              properties: {
                status: {
                  title: '',
                  'x-component': 'CheckboxGroup',
                  enum: [{ label: '推荐分类', value: 1 }],
                  'x-mega-props': {
                    addonAfter: '{{showWarn}}',
                    // wrapperWidth: 130
                  },
                },
              },
            },

            // status1: {
            //   title: '',
            //   'x-component': 'Children',
            //   "x-component-props": {
            //     "children": "{{renderCheckBox()}}"
            //   }
            // }
          },
        },
      },
    },
  },
}
