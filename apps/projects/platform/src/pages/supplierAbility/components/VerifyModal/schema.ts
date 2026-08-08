/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-25 11:50:00
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 18:21:06
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'

const intl = getIntl()

const schema: ISchema = {
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
            { label: intl.formatMessage({ id: 'member.components.VerifyModal.agree.pass' }), value: 1 },
            { label: intl.formatMessage({ id: 'member.components.VerifyModal.agree.noPass' }), value: 0 },
          ],
          'x-component': 'radio',
          'x-component-props': {},
        },
        reason: {
          type: 'string',
          title: intl.formatMessage({ id: 'member.components.VerifyModal.reason.noPass' }),
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'member.components.VerifyModal.reason.placeholder' }),
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

export default schema
