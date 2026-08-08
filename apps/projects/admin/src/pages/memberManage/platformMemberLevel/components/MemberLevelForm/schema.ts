import { ISchema } from '@apps/formily'
import { MEMBER_LEVEL_ENUM } from '@/constants/const/member'

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
              enum: MEMBER_LEVEL_ENUM,
              required: true,
              'x-component-props': {
                placeholder: '请选择',
              },
            },
            levelTag: {
              title: '会员等级标签',
              type: 'string',
              'x-component-props': {
                placeholder: '请输入，最长16个字符，8个汉字',
              },
              'x-rules': [
                {
                  required: true,
                  message: '请输入会员等级标签',
                },
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 16,
                },
              ],
            },
            levelType: {
              title: '会员等级类型',
              type: 'string',
              enum: [],
              required: true,
              'x-component-props': {
                placeholder: '请选择',
              },
            },
            scoreTag: {
              title: '升级分值标签',
              type: 'string',
              'x-component-props': {
                placeholder: '请输入，最长16个字符，8个汉字',
              },
              'x-rules': [
                {
                  required: true,
                  message: '请输入升级分值标签',
                },
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 16,
                },
              ],
            },
            remark: {
              title: '会员等级说明',
              type: 'string',
              'x-component': 'TextArea',
              'x-component-props': {
                placeholder: '在此输入你的内容，最长80个字符，40个汉字',
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
