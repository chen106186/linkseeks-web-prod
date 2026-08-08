import { SCENE, POSITION, transfer2Options, sortedList } from '../../utils/utils'

const SCENEOPTIONS = transfer2Options(SCENE)
const POSITIONOPTIONS = transfer2Options(POSITION)
const SORTLISTOPTIONS = sortedList(1, 11)
/**
 * 内容管理 - 图片详情
 * 下面就是一个mega-layout 布局
 */

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
        name: {
          type: 'string',
          title: '图片名称',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '最长30个字符，15个汉字',
          },
          'x-rules': [
            {
              required: true,
              message: '最长30个字符，15个汉字',
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 30,
            },
          ],
        },
        useScene: {
          title: '使用场景',
          type: 'string',
          'x-component': 'Select',
          'x-component-props': {
            options: SCENEOPTIONS,
            style: {
              width: '100%',
            },
          },
          'x-rules': [
            {
              required: true,
              message: '请选择栏目',
            },
          ],
        },
        position: {
          title: '所在位置',
          type: 'string',
          'x-component': 'Select',
          'x-component-props': {
            options: POSITIONOPTIONS,
            style: {
              width: '100%',
            },
          },
          'x-rules': [
            {
              required: true,
              message: '请选择广告排序',
            },
          ],
        },
        sort: {
          title: '图片排序',
          type: 'string',
          'x-component': 'Select',
          'x-component-props': {
            options: SORTLISTOPTIONS,
            style: {
              width: '100%',
            },
          },
          'x-rules': [
            {
              required: true,
              message: '请选择图片排序',
            },
          ],
        },
        imageUrl: {
          type: 'object',
          title: '图片',
          name: 'imageUrl',
          'x-component': 'CustomUpload',
          'x-component-props': {
            size: '无',
            fileMaxSize: 300,
          },
          'x-rules': [
            {
              required: true,
              message: '请上传图片',
            },
          ],
        },
      },
    },
  },
}

export default schema
