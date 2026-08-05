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
        agree: {
          type: 'string',
          default: 1,
          enum: [
            {
              label: intl.formatMessage({
                id: 'payandSettle.creditManage.components.verifyModal.schema.auditModalSchema.agree.1',
              }),
              value: 1,
            },
            {
              label: intl.formatMessage({
                id: 'payandSettle.creditManage.components.verifyModal.schema.auditModalSchema.agree.2',
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
            id: 'payandSettle.creditManage.components.verifyModal.schema.auditModalSchema.opinion',
          }),
          'x-component': 'textarea',
          required: true,
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'payandSettle.creditManage.components.verifyModal.schema.auditModalSchema.opinion.placeholder',
            }),
            rows: 5,
          },
          'x-rules': [
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
