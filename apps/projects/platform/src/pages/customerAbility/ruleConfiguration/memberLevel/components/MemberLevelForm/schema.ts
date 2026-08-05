import { ISchema } from '@apps/formily'
import { MEMBER_LEVEL_ENUM } from '@/constants/member'
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
              enum: MEMBER_LEVEL_ENUM,
              required: true,
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberLevel.level.placeholder',
                  defaultMessage: '请选择',
                }),
              },
            },
            levelTag: {
              title: intl.formatMessage({ id: 'member.memberLevel.levelTag', defaultMessage: '会员等级标签' }),
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberLevel.levelTag.tip2',
                  defaultMessage: '请输入，最长16个字符，8个汉字',
                }),
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'member.memberLevel.levelTag.required',
                    defaultMessage: '请输入会员等级标签',
                  }),
                },
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 16,
                },
              ],
            },
            levelType: {
              title: intl.formatMessage({ id: 'member.memberLevel.levelTypeName', defaultMessage: '会员等级类型' }),
              type: 'string',
              enum: [],
              required: true,
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberLevel.levelTypeName.placeholder',
                  defaultMessage: '请选择',
                }),
              },
            },
            scoreTag: {
              title: intl.formatMessage({ id: 'member.memberLevel.scoreTag', defaultMessage: '升级分值标签' }),
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberLevel.scoreTag.placeholder',
                  defaultMessage: '请输入，最长16个字符，8个汉字',
                }),
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'member.memberLevel.scoreTag.required',
                    defaultMessage: '请输入升级分值标签',
                  }),
                },
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 16,
                },
              ],
            },
            remark: {
              title: intl.formatMessage({ id: 'member.memberLevel.remark', defaultMessage: '会员等级说明' }),
              type: 'string',
              'x-component': 'TextArea',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberLevel.remark.placeholder',
                  defaultMessage: '在此输入你的内容，最长80个字符，40个汉字',
                }),
                rows: 5,
              },
              'x-rules': [
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 80,
                },
              ],
            },
          },
        },
      },
    },
    memberApplicableRole: {
      title: '',
      type: 'string',
      enum: [],
      required: true,
      'x-component': 'MemberApplicableRole',
    },
  },
}

export default schema
