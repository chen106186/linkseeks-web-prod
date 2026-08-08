/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-02 15:55:18
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-02 17:30:00
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
        date: {
          type: 'string',
          title: `${intl.formatMessage({ id: 'merchantCoupon.time' })}`,
          required: true,
          'x-component': 'DatePicker',
          'x-component-props': {
            showTime: true,
            style: {
              width: '100%',
            },
            disabled: true,
          },
        },
        reason: {
          type: 'string',
          title: `${intl.formatMessage({ id: 'merchantCoupon.reason' })}`,
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: `${intl.formatMessage({ id: 'merchantCoupon.between50and100' })}`,
            rows: 4,
          },
          'x-rules': [
            {
              required: true,
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 100,
            },
          ],
        },
      },
    },
  },
}

export default schema
