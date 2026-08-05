import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const auditModalSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        isPass: {
          type: 'string',
          default: 1,
          enum: [
            {
              label: intl.formatMessage({
                id: 'afterService.components.VerifyModal.agree.pass',
                defaultMessage: '审核通过',
              }),
              value: 1,
            },
            {
              label: intl.formatMessage({
                id: 'afterService.components.VerifyModal.agree.noPass',
                defaultMessage: '审核不通过',
              }),
              value: 0,
            },
          ],
          'x-component': 'radio',
          'x-component-props': {},
        },
        opinion: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.VerifyModal.reason.noPass',
            defaultMessage: '审核不通过原因',
          }),
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'afterService.components.VerifyModal.reason.placeholder',
              defaultMessage: '在此输入你的内容，最长120个字符，60个汉字',
            }),
            rows: 5,
          },
          'x-rules': [
            {
              required: true,
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 120,
            },
          ],
        },
      },
    },
  },
}
