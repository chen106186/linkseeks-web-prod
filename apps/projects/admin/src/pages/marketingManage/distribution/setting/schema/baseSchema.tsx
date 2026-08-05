interface IOption {
  value: number | string
  label: number | string
}

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
        enableDistributionActivity: {
          type: 'number',
          title: '是否启用分销活动',
          name: 'enableDistributionActivity',
          default: 1,
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-component-props': {
            activeValue: 1,
            inactiveValue: 0,
            checkedChildren: '启用',
            unCheckedChildren: '停用',
          },
        },
        staffName: {
          name: 'staffName',
          title: '分销员名称',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '分销员名称',
          },
          'x-rules': [
            {
              required: true,
              message: '请填写分销员名称',
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
        },
        shareImage: {
          type: 'object',
          title: '分享图片',
          name: 'shareImage',
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
        commissionRebatePriority: {
          name: 'commissionRebatePriority',
          type: 'number',
          title: '佣金返利优先',
          default: 0,
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          'x-component-props': {
            options: [
              { label: '邀请人优先', value: 0 },
              { label: '分享人优先', value: 1 },
            ],
          },
          'x-validator': [
            {
              required: true,
              message: '请选择佣金返利优先',
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
            distributionPerformanceRuleDescription: {
              type: 'string',
              name: 'distributionPerformanceRuleDescription',
              title: '分销业绩规则说明',
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
