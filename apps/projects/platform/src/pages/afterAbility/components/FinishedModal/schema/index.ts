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
        level: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.FinishedModal.level',
            defaultMessage: '售后满意度',
          }),
          default: 5,
          enum: [
            {
              label: intl.formatMessage({ id: 'afterService.components.FinishedModal.level.5', defaultMessage: '5分' }),
              value: 5,
            },
            {
              label: intl.formatMessage({ id: 'afterService.components.FinishedModal.level.4', defaultMessage: '4分' }),
              value: 4,
            },
            {
              label: intl.formatMessage({ id: 'afterService.components.FinishedModal.level.3', defaultMessage: '3分' }),
              value: 3,
            },
            {
              label: intl.formatMessage({ id: 'afterService.components.FinishedModal.level.2', defaultMessage: '2分' }),
              value: 2,
            },
            {
              label: intl.formatMessage({ id: 'afterService.components.FinishedModal.level.1', defaultMessage: '1分' }),
              value: 1,
            },
          ],
          'x-component': 'radio',
          'x-component-props': {},
        },
        content: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.FinishedModal.content',
            defaultMessage: '售后评价',
          }),
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'afterService.components.FinishedModal.content.placeholder',
              defaultMessage: '在此输入你的内容，最长120个字符，60个汉字',
            }),
            rows: 5,
          },
          'x-rules': [
            {
              required: true, // 写外边不生效了？？？
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
