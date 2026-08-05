import { ISchema } from '@apps/formily'

const schema: ISchema = {
  type: 'object',
  properties: {
    BASIC_INFO: {
      type: 'object',
      'x-component': 'BasicInfoVirtualFieldItem',
      properties: {
        MEGA_LADYOUT_1: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
            full: true,
            columns: 2,
            autoRow: true,
            labelCol: 6,
            labelAlign: 'left',
          },
          properties: {
            level: {
              title: '会员等级',
              type: 'string',
              editable: false,
            },
            levelTag: {
              title: '会员等级标签',
              type: 'string',
              editable: false,
            },
            levelTypeName: {
              title: '会员等级类型',
              type: 'string',
              editable: false,
            },
            scoreTag: {
              title: '升级分值标签',
              type: 'string',
              editable: false,
            },
            remark: {
              title: '会员等级说明',
              type: 'string',
              editable: false,
            },
            roleName: {
              title: '会员角色名称',
              type: 'string',
              editable: false,
            },
            roleTypeName: {
              title: '角色类型',
              type: 'string',
              editable: false,
            },
            memberTypeName: {
              title: '会员类型',
              type: 'string',
              editable: false,
            },
            point: {
              title: '升级阀值',
              type: 'string',
              'x-rules': [
                {
                  required: true,
                  message: '请输入升级阀值',
                },
                {
                  // pattern: /^[1-9]?[0-9]*$/,
                  pattern: /^[1-9]?[0-9]{0,8}$/,
                  message: '请输入整数，最长为9位',
                },
              ],
            },
          },
        },
      },
    },
    memberRights: {
      title: '',
      type: 'array',
      'x-component': 'MemberRightSettting',
      'x-component-props': {
        onStatusChange: '{{handleRightStatusChange}}',
        onChangeParameter: '{{handleRightChangeParameter}}',
      },
    },
  },
}

export default schema
