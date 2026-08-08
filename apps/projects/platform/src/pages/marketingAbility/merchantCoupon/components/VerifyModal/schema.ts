/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 16:37:02
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-28 16:37:02
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
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
            { label: intl.formatMessage({ id: 'merchantCoupon.examinationpassed' }), value: 1 },
            { label: intl.formatMessage({ id: 'merchantCoupon.Auditnotpassed' }), value: 0 },
          ],
          'x-component': 'radio',
          'x-component-props': {},
        },
        reason: {
          type: 'string',
          title: intl.formatMessage({ id: 'merchantCoupon.Notpassingthereason' }),
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'merchantCoupon.up120characters60characters' }),
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
