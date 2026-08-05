/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-02 17:53:48
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-15 14:22:03
 * @Description:
 */
import { ISchema } from '@apps/formily'
import moment from 'moment'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

function range(start, end) {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

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
        '[releaseTimeStart, releaseTimeEnd]': {
          title: intl.formatMessage({ id: 'merchantCoupon.giveCouponTime' }),
          type: 'string',
          required: true,
          'x-component': 'RangePicker',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'merchantCoupon.giveCouponStartTime' }) +
                ',' +
                intl.formatMessage({ id: 'merchantCoupon.giveCouponEndTime' }),
            ],
            showTime: true,
            style: {
              width: '100%',
            },
            disabledDate: (current) => current && current < moment().startOf('day'),
            disabledTime: (current, type) => {
              if ((type === 'start' || type === 'end') && moment().isSame(current, 'day')) {
                return {
                  disabledHours: () => range(0, 24).splice(0, moment().get('hour')),
                  disabledMinutes: () => range(0, 60).splice(0, moment().get('minute')),
                  disabledSeconds: () => range(0, 60).splice(0, moment().get('second')),
                }
              }
              return {}
            },
          },
        },
        quantity: {
          title: `${intl.formatMessage({ id: 'merchantCoupon.couponAmount' })}`,
          type: 'string',
          required: true,
          'x-component-props': {
            allowClear: false,
          },
          'x-rules': [
            {
              pattern: PATTERN_MAPS.quantity,
              message: `${intl.formatMessage({ id: 'merchantCoupon.Pleaseentertheinteger' })}`,
            },
          ],
        },
      },
    },
  },
}

export default schema
