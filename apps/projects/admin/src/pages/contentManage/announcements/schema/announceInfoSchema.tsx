import { ANNOUNCE_COLUMN_TYPE, transfer2Options } from '../../utils/utils'
const columnsList = transfer2Options(ANNOUNCE_COLUMN_TYPE)

const schema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 3,
        wrapperCol: 10,
        labelAlign: 'left',
      },
      properties: {
        title: {
          type: 'string',
          title: '标题',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '最长60个字符，30个汉字',
          },
          'x-rules': [
            {
              required: true,
              message: '最长60个字符，30个汉字',
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 60,
            },
          ],
        },
        columnTypeLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            required: true,
            label: '栏目',
            wrapperCol: 24, //
            grid: true,
            columns: 6,
            autoRow: false,
            layoutProps: {
              wrapperCol: 17,
            },
          },
          properties: {
            columnType: {
              name: 'columnType',
              type: 'string',
              enum: [],
              // 'x-component': 'Select',
              'x-mega-props': {
                span: 2,
              },
              'x-component-props': {
                style: {
                  width: '95%',
                },
                // options: columnsList,
              },
              'x-rules': [
                {
                  required: true,
                  message: '请选择栏目',
                },
              ],
            },
            top: {
              name: 'top',
              type: 'string',
              'x-component': 'CustomCheckbox',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: '置顶',
              },
            },
          },
        },
        contentLayout: {
          'x-component': 'mega-layout',
          'x-component-props': {
            layoutProps: {
              wrapperCol: 21,
            },
            wrapperCol: 23,
          },
          properties: {
            content: {
              type: 'string',
              name: 'content',
              title: '内容',
              'x-component': 'CustomEditor',
              'x-component-parent-props': {
                style: {
                  border: '1px solid #DCDFE6',
                },
              },
              'x-rules': {
                required: true,
                message: '请输入内容',
              },
              'x-component-props': {
                contentStyle: {
                  height: 256,
                },
                // onChange: "{{editorChange}}",
                excludeControls: [
                  'letter-spacing',
                  'line-height',
                  'clear',
                  'headings',
                  'list-ol',
                  'list-ul',
                  'remove-styles',
                  'superscript',
                  'subscript',
                  'hr',
                ],
                media: {
                  // 如果要允许上传视频的话，需要重写uploadFn, https://www.yuque.com/braft-editor/be/gz44tn
                  accepts: {
                    video: false,
                    audio: false,
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

export default schema
