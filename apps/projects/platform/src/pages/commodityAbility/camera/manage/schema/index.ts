import { ISchema } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

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
          title: intl.formatMessage({ id: 'authConfig.loginAccount' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.form.input.placeholder' }),
            },
            {
              pattern: /^\w{6,20}$/,
              message: intl.formatMessage({ id: 'authConfig.inputbetween6and20' }),
            },
          ],
        },
        password: {
          type: 'password',
          title: intl.formatMessage({ id: 'authConfig.loginPsw' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.form.input.placeholder' }),
            },
            {
              pattern: PATTERN_MAPS.password,
              message: intl.formatMessage({ id: 'authConfig.input8Psw' }),
            },
          ],
        },
        name: {
          type: 'string',
          title: intl.formatMessage({ id: 'authConfig.personName' }),
          maxLength: 16,
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.form.input.placeholder' }),
            },
          ],
        },
        phoneLayout: {
          type: 'object',
          'x-component': 'flex-box',
          title: intl.formatMessage({ id: 'authConfig.tel' }),
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
              'x-component-props': {
                flexcol: {
                  span: 6,
                },
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'common.text.pleaseSelect' }),
                },
              ],
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
                  message: intl.formatMessage({ id: 'common.form.input.placeholder' }),
                },
                {
                  pattern: PATTERN_MAPS.phone,
                  message: intl.formatMessage({ id: 'authConfig.correntTel' }),
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
          title: intl.formatMessage({ id: 'authConfig.indentifyCode' }),
        },
        email: {
          type: 'string',
          title: intl.formatMessage({ id: 'authConfig.email' }),
          'x-rules': [
            {
              pattern: PATTERN_MAPS.email,
              message: intl.formatMessage({ id: 'authConfig.correntEmail' }),
            },
          ],
        },
        jobTitle: {
          type: 'string',
          title: intl.formatMessage({ id: 'authConfig.zhiwei' }),
          maxLength: 20,
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'authConfig.inputzhiwei' }),
            },
          ],
        },
        orgName: {
          type: 'string',
          title: intl.formatMessage({ id: 'authConfig.belongOrigan' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.text.pleaseSelect' }),
            },
          ],
          'x-component-props': {
            disabled: true,
            addonAfter: '{{connectCategory}}',
          },
        },
        orgId: {
          type: 'string',
          visible: false,
        },
        memberRoleIds: {
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.text.pleaseSelect' }),
            },
          ],
          type: 'array:string',
          'x-component': 'tableTagList',
          'x-component-props': {
            extra: '{{addRoles}}',
            callback: '{{callback}}',
          },
          title: intl.formatMessage({ id: 'authConfig.relatePerson' }),
        },
      },
    },
  },
}
