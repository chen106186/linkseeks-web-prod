import { ISchema } from '@apps/formily'
import { MEMBER_LEVEL_ENUM } from '@/constants/member'
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
              enum: MEMBER_LEVEL_ENUM,
              required: true,
              'x-component-props': {
                placeholder: translate('web.common.qingxuanze'),
              },
            },
            levelTag: {
              title: translate('web.resource.member.levelTag'),
              type: 'string',
              'x-component-props': {
                placeholder: translate('web.common.tip_byteLengthLimit', { byteNum: 16, chineseNum: 8 }),
              },
              'x-rules': [
                {
                  required: true,
                  message: translate('web.common.qingshuru'),
                },
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 16,
                },
              ],
            },
            levelType: {
              title: translate('web.resource.member.levelType'),
              type: 'string',
              enum: [],
              required: true,
              'x-component-props': {
                placeholder: translate('web.common.qingxuanze'),
              },
            },
            scoreTag: {
              title: translate('web.resource.member.levelSouceTag'),
              type: 'string',
              'x-component-props': {
                placeholder: translate('web.common.tip_byteLengthLimit', { byteNum: 16, chineseNum: 8 }),
              },
              'x-rules': [
                {
                  required: true,
                  message: translate('web.resource.member.qingshurushengjifenzhibiaoqian'),
                },
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 16,
                },
              ],
            },
            remark: {
              title: translate('web.resource.member.huiyuandengjishuoming'),
              type: 'string',
              'x-component': 'TextArea',
              'x-component-props': {
                placeholder: translate('web.common.tip_byteLengthLimit', { byteNum: 80, chineseNum: 40 }),
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
