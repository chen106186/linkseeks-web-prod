import { ISchema } from '@apps/formily'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

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
              title: translate('web.resource.member.level'),
              type: 'string',
              editable: false,
            },
            levelTag: {
              title: translate('web.resource.member.levelTag'),
              type: 'string',
              editable: false,
            },
            levelTypeName: {
              title: translate('web.resource.member.levelType'),
              type: 'string',
              editable: false,
            },
            scoreTag: {
              title: translate('web.resource.member.levelSouceTag'),
              type: 'string',
              editable: false,
            },
            remark: {
              title: translate('web.resource.member.huiyuandengjishuoming'),
              type: 'string',
              editable: false,
            },
            roleName: {
              title: translate('web.resource.member.memberRoleName'),
              type: 'string',
              editable: false,
            },
            roleTypeName: {
              title: translate('web.resource.member.roleType'),
              type: 'string',
              editable: false,
            },
            memberTypeName: {
              title: translate('web.resource.member.memberSupperType'),
              type: 'string',
              editable: false,
            },
            point: {
              title: translate('web.resource.member.shengjiyuzhi'),
              type: 'string',
              'x-rules': [
                {
                  required: true,
                  message: translate('web.resource.member.qingshurushengjiyuzhi'),
                },
                {
                  pattern: /^[1-9]?[0-9]*$/,
                  message: translate('web.resource.member.qingshuruzhengshu'),
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
