import { ANNOUNCE_COLUMN_TYPE, transfer2Options } from '../../utils/utils'
import { getIntl } from '@linkseeks/i18n'

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
          title: getIntl().formatMessage({ id: 'common.text.title' }),
          'x-component': 'Input',
          'x-component-props': {
            placeholder: `30${getIntl().formatMessage({
              id: 'common.unit.individual.chinese',
            })}, 60${getIntl().formatMessage({ id: 'common.unit.individual.character' })}`,
          },
          'x-rules': [
            {
              required: true,
              message: `30${getIntl().formatMessage({
                id: 'common.unit.individual.chinese',
              })}, 60${getIntl().formatMessage({ id: 'common.unit.individual.character' })}`,
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
            label: '{{label}}',
            wrapperCol: 24, //
            grid: true,
            columns: 6,
            autoRow: false,
            layoutProps: {
              wrapperCol: 16,
            },
            style: {
              marginBottom: 0,
            },
          },
          properties: {
            columnType: {
              name: 'columnType',
              type: 'string',
              'x-component': 'Select',
              'x-mega-props': {
                span: 2,
              },
              'x-component-props': {
                style: {
                  width: '101%',
                  marginBottom: '20px',
                },
                options: columnsList,
              },
              'x-rules': [
                {
                  required: true,
                  message: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}${getIntl().formatMessage({
                    id: 'content.info.column',
                  })}`,
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
                children: getIntl().formatMessage({ id: 'content.notice.topping' }),
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
              title: getIntl().formatMessage({ id: 'content.info.content' }),
              'x-component': 'CustomEditor',
              'x-component-parent-props': {
                style: {
                  border: '1px solid #DCDFE6',
                },
              },
              'x-rules': {
                required: true,
                message: `${getIntl().formatMessage({ id: 'common.form.input.placeholder' })}${getIntl().formatMessage({
                  id: 'content.info.content',
                })}`,
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
