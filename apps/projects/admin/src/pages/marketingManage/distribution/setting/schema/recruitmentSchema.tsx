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
        showApplicationEntry: {
          type: 'number',
          title: '是否显示申请入口',
          name: 'showApplicationEntry',
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
        applicationConditions: {
          name: 'applicationConditions',
          type: 'number',
          title: '申请条件',
          default: 0,
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          'x-component-props': {
            options: [
              { label: '商城消费', value: 0 },
              { label: '邀请注册', value: 1 },
            ],
          },
          'x-validator': [
            {
              required: true,
              message: '请选择申请条件',
            },
          ],
        },
        requiredSuccessfulInviteCount: {
          name: 'requiredSuccessfulInviteCount',
          title: '达到人数',
          'x-component': 'InputNumber',
          'x-component-props': {
            placeholder: '达到人数',
          },
          'x-rules': [
            {
              required: true,
              message: '请填写达到达到人数',
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
        },
        requiredOrderAmount: {
          name: 'requiredOrderAmount',
          title: '达到订单金额',
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-component-props': {
            placeholder: '请输入金额',
            min: 0,
            step: 0.01,
            precision: 2,
          },
          'x-validator': [
            {
              required: true,
              message: '请填写达到订单金额',
            },
            {
              validator(value) {
                if (value !== undefined && !/^\d+(\.\d{1,2})?$/.test(String(value))) {
                  return '最多保留两位小数'
                }
              },
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
            ruleDescription: {
              type: 'string',
              name: 'ruleDescription',
              title: '规则说明',
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
