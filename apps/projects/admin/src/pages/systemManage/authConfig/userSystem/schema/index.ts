import { ISchema } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'

export const UserDetailSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        labelAlign: 'left',
        full: true,
        wrapperCol: 12,
      },
      properties: {
        account: {
          type: 'string',
          title: '登录账号',
          'x-rules': [
            {
              required: true,
              message: '请输入登录账号',
            },
            {
              pattern: /^\w{6,20}$/,
              message: '请输入由数字字母或者下划线组成的6-20位账号',
            },
          ],
        },
        password: {
          type: 'password',
          title: '登录密码',
          'x-rules': [
            {
              required: true,
              message: '请输入登录密码',
            },
            {
              pattern: PATTERN_MAPS.password,
              message: '请输入由大小写字母和数字组成的8位密码',
            },
          ],
        },
        name: {
          type: 'string',
          title: '姓名',
          'x-rules': [
            {
              message: '请输入姓名',
              required: true,
            },
            {
              limitByte: true,
              maxByte: 16,
            },
          ],
        },
        phoneLayout: {
          type: 'object',
          'x-component': 'flex-box',
          title: '手机号',
          'x-component-props': {
            labelcol: 6,
            wrappercol: 12,
          },
          required: true,
          properties: {
            countryCode: {
              type: 'string',
              enum: ['+86'],
              'x-mega-props': {
                wrapperCol: 24,
              },
              'x-rules': [
                {
                  required: true,
                  message: '请选择',
                },
              ],
              'x-component-props': {
                flexcol: {
                  span: 6,
                },
              },
            },
            phone: {
              type: 'number',
              'x-mega-props': {
                wrapperCol: 24,
                full: true,
              },
              'x-rules': [
                {
                  required: true,
                  message: '请输入手机号',
                },
                {
                  pattern: PATTERN_MAPS.phone,
                  message: '请输入正确的手机号',
                },
              ],
              'x-component-props': {
                flexcol: {
                  flex: 1,
                },
              },
            },
          },
        },
        idCardNo: {
          type: 'string',
          title: '身份证号',
          'x-rules': [
            {
              pattern: PATTERN_MAPS.idCard,
              message: '请输入正确的身份证号',
            },
          ],
        },
        email: {
          type: 'string',
          title: '邮箱',
          'x-rules': [
            {
              pattern: PATTERN_MAPS.email,
              message: '请输入正确的邮箱',
            },
          ],
        },
        jobTitle: {
          type: 'string',
          title: '职位',
          'x-rules': [
            {
              limitByte: true,
              maxByte: 20,
            },
          ],
        },
        orgName: {
          type: 'string',
          title: '所属组织机构',
          'x-component-props': {
            disabled: true,
            addonAfter: '{{connectCategory}}',
          },
          'x-rules': [
            {
              required: true,
              message: '请关联组织机构',
            },
          ],
        },
        orgId: {
          type: 'string',
          visible: false,
        },
        memberRoleIds: {
          type: 'array:string',
          'x-component': 'tableTagList',
          'x-component-props': {
            extra: '{{addRoles}}',
            callback: '{{callback}}',
          },
          title: '关联角色',
          'x-rules': [
            {
              required: true,
              message: '请选择关联角色',
            },
          ],
        },
      },
    },
  },
}
