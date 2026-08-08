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
            member: {
              title: '会员名称',
              type: 'string',
              required: true,
              'x-component': 'MemberSelect',
            },
          },
        },
      },
    },
    curMemberApplicableRole: {
      title: '',
      type: 'string',
      enum: [],
      required: true,
      'x-component': 'CurMemberApplicableRole',
    },
    subMemberApplicableRole: {
      title: '',
      type: 'string',
      enum: [],
      required: true,
      'x-component': 'SubMemberApplicableRole',
    },
  },
}

export default schema
