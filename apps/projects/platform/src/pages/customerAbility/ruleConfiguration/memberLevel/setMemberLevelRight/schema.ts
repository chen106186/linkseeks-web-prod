import { ISchema } from '@apps/formily'

import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

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
              title: intl.formatMessage({ id: 'member.memberLevel.level', defaultMessage: '会员等级' }),
              type: 'string',
              editable: false,
            },
            levelTag: {
              title: intl.formatMessage({ id: 'member.memberLevel.levelTag', defaultMessage: '会员等级标签' }),
              type: 'string',
              editable: false,
            },
            levelTypeName: {
              title: intl.formatMessage({ id: 'member.memberLevel.levelTypeName', defaultMessage: '会员等级类型' }),
              type: 'string',
              editable: false,
            },
            scoreTag: {
              title: intl.formatMessage({ id: 'member.memberLevel.scoreTag', defaultMessage: '升级分值标签' }),
              type: 'string',
              editable: false,
            },
            remark: {
              title: intl.formatMessage({ id: 'member.memberLevel.remark', defaultMessage: '会员等级说明' }),
              type: 'string',
              editable: false,
            },
            roleName: {
              title: intl.formatMessage({
                id: 'member.memberLevel.roleName.placeholder',
                defaultMessage: '会员角色名称',
              }),
              type: 'string',
              editable: false,
            },
            roleTypeName: {
              title: intl.formatMessage({ id: 'member.memberLevel.roleTypeName', defaultMessage: '角色类型' }),
              type: 'string',
              editable: false,
            },
            memberTypeName: {
              title: intl.formatMessage({ id: 'member.memberLevel.memberTypeName', defaultMessage: '会员类型' }),
              type: 'string',
              editable: false,
            },
            point: {
              title: intl.formatMessage({ id: 'member.memberLevel.point', defaultMessage: '升级阀值' }),
              type: 'string',
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'member.memberLevel.point.required',
                    defaultMessage: '请输入升级阀值',
                  }),
                },
                {
                  pattern: /^[1-9]?[0-9]*$/,
                  message: intl.formatMessage({ id: 'member.memberLevel.point.legal', defaultMessage: '请输入整数' }),
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
