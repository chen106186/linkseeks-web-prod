import { QuestionCircleOutlined } from '@ant-design/icons'
import { ISchema } from '@apps/formily'
import { Upload, message, Tooltip } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'

const schema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelWidth: 150,
        // "wrapperWidth": 600,
        labelAlign: 'left',
        full: true,
      },
      properties: {
        version: {
          title: `{{ text('版本号',help('当前填写的版本号需要跟上传的安装包一致')) }}`,
          type: 'string',
          'x-rules': [
            {
              required: true,
              message: '请填写版本号，版本号规则为V1.0.0, 且必须大于上一个版本号',
            },
            {
              pattern: /^V[1-9]\d?(\.(0|[1-9]\d?)){2}$/,
              message: '请填写正确的版本规则， 版本号规则为V1.0.0， 且必须大于上一个版本号',
            },
          ],
          'x-component-props': {
            style: {
              width: 320,
            },
          },
        },
        releaseTime: {
          title: '发布时间',
          type: 'date',
          'x-component-props': {
            format: 'YYYY-MM-DD HH:mm:ss',
            style: {
              width: 320,
            },
            showTime: true,
            disabledDate: '{{disabledDate}}',
            disabledTime: '{{disabledTime}}',
          },
          'x-rules': [
            {
              required: true,
              message: '请选择发布时间，发布时间需要大于等于当前时间',
            },
          ],
        },
        type: {
          title: '升级类型',
          type: 'string',
          'x-component': 'RadioGroup',
          enum: [
            { label: '强制更新', value: 1 },
            { label: '非强制更新', value: 2 },
          ],
          'x-rules': [
            {
              required: true,
              message: '请选择升级类型',
            },
          ],
        },
        contentLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          properties: {
            content: {
              type: 'string',
              title: '升级内容',
              'x-component': 'Editor',
              'x-rules': {
                required: true,
                message: '请输入内容',
              },
              'x-props': {},
              'x-component-props': {
                contentStyle: {
                  height: 256,
                  width: 720,
                },
                style: {
                  border: '1px solid #DCDFE6',
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
        installPack: {
          type: 'string',
          title: '上传安卓文件',
          'x-component': 'FormilyUploadFiles',
          'x-component-props': {
            maxCount: 1,
            beforeUpload: (file: UploadFile) => {
              console.log(file)
              if (file.type !== 'application/vnd.android.package-archive') {
                message.error('上传文件是apk 文件')
                return Upload.LIST_IGNORE
              }
              return true
            },
          },

          'x-rules': [
            {
              required: true,
              message: '请上传apk文件',
            },
          ],
        },
      },
    },
  },
}

export default schema
