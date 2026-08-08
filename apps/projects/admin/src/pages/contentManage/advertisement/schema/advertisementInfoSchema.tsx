import { sortedList } from '../../utils/utils'

const sortListOptions = sortedList(1, 6)

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
        channel: {
          title: '投放渠道',
          type: 'string',
          enum: [
            { label: 'Web', value: 1 },
            { label: 'App', value: 2 },
          ],
          'x-rules': [
            {
              required: true,
              message: '请选择投放渠道',
            },
          ],
        },
        columnType: {
          title: '栏目',
          type: 'string',
          enum: [],
          // 'x-component': 'Select',
          // 'x-component-props': {
          //   options: []
          // },
          'x-rules': [
            {
              required: true,
              message: '请选择栏目',
            },
          ],
        },
        sort: {
          title: '广告排序',
          type: 'string',
          enum: sortListOptions,
          'x-rules': [
            {
              required: true,
              message: '请选择广告排序',
            },
          ],
        },
        link: {
          title: '跳转链接',
          type: 'string',
          'x-rules': [
            {
              limitByte: true, // 自定义校验规则
              maxByte: 100,
            },
          ],
        },
        imageUrl: {
          type: 'object',
          title: '广告图片',
          name: 'imageUrl',
          'x-component': 'CustomUpload',
          'x-component-props': {
            size: '无',
            fileMaxSize: 300,
          },
          'x-rules': {
            required: true,
            message: '请上传图片',
          },
        },
      },
    },
  },
}

export default schema
