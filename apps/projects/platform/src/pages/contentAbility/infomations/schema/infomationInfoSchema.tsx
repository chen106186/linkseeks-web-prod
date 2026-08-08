import { getIntl } from '@linkseeks/i18n'

interface IOption {
  value: number | string
  label: number | string
}

const sortedList = (() => {
  let res: IOption[] = []
  for (let i = 1; i <= 10; i++) {
    let data: IOption = {
      label: i,
      value: i,
    }
    res.push(data)
  }
  return res
})()

const schema = {
  type: 'object',
  properties: {
    layout: {
      name: 'layout',
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 3,
        wrapperCol: 10,
        labelAlign: 'left',
      },
      properties: {
        title: {
          name: 'title',
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
              message: `${getIntl().formatMessage({ id: 'common.form.input.placeholder' })}${getIntl().formatMessage({
                id: 'common.text.title',
              })}`,
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
        },
        columnId: {
          name: 'columnId',
          title: getIntl().formatMessage({ id: 'content.info.column' }),
          'x-component': 'Select',
          'x-component-props': {
            style: {
              marginBottom: '8px',
              width: '100%',
            },
          },
          description: getIntl().formatMessage({ id: 'content.columns.category' }),
          'x-rules': {
            required: true,
            message: `${getIntl().formatMessage({ id: 'common.text.pleaseSelect' })}${getIntl().formatMessage({
              id: 'content.columns.category',
            })}`,
          },
        },
        recommendLabel: {
          name: 'recommendLabel',
          title: getIntl().formatMessage({ id: 'content.info.recommendTag' }),
          type: 'string',
          'x-component': 'Select',
          'x-component-props': {
            style: {
              marginTop: '12px',
              width: '100%',
            },
            allowClear: true,
            options: [
              { label: getIntl().formatMessage({ id: 'content.info.label1' }), value: 1 },
              { label: getIntl().formatMessage({ id: 'content.info.label2' }), value: 2 },
              { label: getIntl().formatMessage({ id: 'content.info.label3' }), value: 3 },
              { label: getIntl().formatMessage({ id: 'content.info.label4' }), value: 4 },
              { label: getIntl().formatMessage({ id: 'content.info.label5' }), value: 5 },
              { label: getIntl().formatMessage({ id: 'content.info.label6' }), value: 6 },
            ],
          },
        },
        sort: {
          name: 'sort',
          type: 'string',
          title: getIntl().formatMessage({ id: 'content.info.recommendSort' }),
          'x-component': 'Select',
          'x-component-props': {
            options: sortedList,
            allowClear: true,
            style: {
              width: '100%',
            },
          },
        },
        readCount: {
          name: 'readCount',
          title: getIntl().formatMessage({ id: 'content.info.views' }),
          type: 'string',
          'x-component': 'Input',
          'x-component-props': {
            style: {
              width: '100%',
            },
          },
          'x-rules': [
            {
              isInteger: true,
            },
          ],
        },
        categoryLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            label: getIntl().formatMessage({ id: 'content.info.category' }),
            wrapperCol: 24,
          },
          properties: {
            firstCategoryId: {
              type: 'string',
              'x-component': 'Select',
              'x-component-props': {
                options: [],
              },
              'x-linkages': [
                {
                  type: 'value:visible',
                  target: '*(secondCategoryId)',
                  condition: `{{!!$value}}`,
                },
              ],
            },
            firstCategoryName: {
              type: 'string',
              display: false,
            },
            secondCategoryId: {
              type: 'string',
              'x-component': 'Select',
              'x-component-props': {
                options: [],
              },
              'x-linkages': [
                {
                  type: 'value:visible',
                  target: '*(thirdlyCategoryId)',
                  condition: '{{!!$value}}',
                },
              ],
            },
            secondCategoryName: {
              type: 'string',
              display: false,
            },
            thirdlyCategoryId: {
              type: 'string',
              'x-component': 'Select',
              'x-component-props': {
                options: [],
              },
            },
            thirdlyCategoryName: {
              type: 'string',
              display: false,
            },
          },
        },
        labelIds: {
          name: 'labelIds',
          title: getIntl().formatMessage({ id: 'content.info.tag' }),
          'x-component': 'CustomTags',
          'x-component-props': {
            layoutProps: {
              wrapperCol: 12,
            },
            onChange: '{{tagOnChange}}',
          },
        },
        imageUrl: {
          type: 'object',
          title: '{{label}}',
          name: 'imageUrl',
          'x-component': 'CustomUpload',
          'x-component-props': {
            size: getIntl().formatMessage({ id: 'commodity.products.viewProducts.card.6.isMemberPrice.2' }),
            // onChange: "{{uploadImage}}",
            fileMaxSize: 300,
          },
        },
        digest: {
          type: 'string',
          name: 'digest',
          title: getIntl().formatMessage({ id: 'content.info.abstract' }),
          'x-component': 'TextArea',
          'x-component-props': {
            placeholder: `200${getIntl().formatMessage({
              id: 'common.unit.individual.chinese',
            })}, 400${getIntl().formatMessage({ id: 'common.unit.individual.character' })}`,
            rows: 5,
          },
          'x-rules': [
            {
              required: true,
              message: `200${getIntl().formatMessage({
                id: 'common.unit.individual.chinese',
              })}, 400${getIntl().formatMessage({ id: 'common.unit.individual.character' })}`,
            },
            {
              limitByte: true,
              maxByte: 400,
            },
          ],
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
