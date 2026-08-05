interface IOption {
  value: number | string
  label: number | string
}

const sortedList = (() => {
  const res: IOption[] = []
  for (let i = 1; i <= 10; i++) {
    const data: IOption = {
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
          title: '标题',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '最长30个汉字，60个字符',
          },
          'x-rules': [
            {
              required: true,
              message: '请填写标题',
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
        },
        columnId: {
          name: 'columnId',
          title: '栏目',
          'x-component': 'Select',
          'x-component-props': {
            style: {
              marginBottom: '8px',
              width: '100%',
            },
          },
          description: '栏目分类',
          'x-rules': {
            required: true,
            message: '请选择咨询说明',
          },
        },
        recommendLabel: {
          name: 'recommendLabel',
          title: '推荐标签',
          type: 'string',
          'x-component': 'Select',
          'x-component-props': {
            style: {
              marginTop: '12px',
              width: '100%',
            },
            allowClear: true,
            options: [
              { label: '头条文章', value: 1 },
              { label: '轮播新闻', value: 2 },
              { label: '图片新闻', value: 3 },
              { label: '推荐阅读', value: 4 },
              { label: '行情推荐', value: 5 },
              { label: '本栏推荐', value: 6 },
            ],
          },
        },
        // sortLayout: {
        //   type: 'object',
        //   'x-component': 'mega-layout',
        //   "x-component-props": {
        //     "label": "推荐排序",
        //     // wrapperCol: 23,
        //     // layoutProps: {
        //     //   "wrapperCol": 12,
        //     // },
        //     style: {
        //       marginBottom: 0
        //     },
        //     // addonAfter: "{{isTop}}"
        //   },
        //   properties: {
        //     sort: {
        //       name: 'sort',
        //       type: 'string',
        //       'x-component': 'Select',
        //       'x-component-props': {
        //         // style: {
        //         //   width: '100%'
        //         // },
        //         options: sortedList,
        //         allowClear: true,

        //       }
        //     },
        //   }
        // },
        sort: {
          name: 'sort',
          type: 'string',
          title: '推荐排序',
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
          title: '浏览数',
          type: 'string',
          'x-component': 'Input',
          'x-component-props': {
            style: {
              width: '100%',
            },
          },
          'x-rules': [
            {
              required: false,
              // isInteger: true,
            },
            {
              pattern: /^[1-9]?[0-9]{0,8}$/,
              message: '请输入整数，最长为9位',
            },
          ],
        },
        categoryLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            label: '行情资讯分类：',
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
          title: '咨询标签',
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
          title: '图片',
          name: 'imageUrl',
          'x-component': 'CustomUpload',
          'x-component-props': {
            size: '无',
            // onChange: "{{uploadImage}}",
            fileMaxSize: 300,
          },
          'x-rules': {
            required: true,
            message: '请上传图片',
          },
        },
        digest: {
          type: 'string',
          name: 'digest',
          title: '摘要',
          'x-component': 'TextArea',
          'x-component-props': {
            placeholder: '最长300个字符，150个汉字',
            rows: 5,
          },
          'x-rules': [
            {
              required: true,
              message: '最长300个字符，150个汉字',
            },
            {
              limitByte: true,
              maxByte: 300,
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
