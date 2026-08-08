/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-02 17:53:48
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-26 14:59:25
 * @Description:
 */
import { ISchema } from '@apps/formily'
import moment from 'moment'
import { PATTERN_MAPS } from '@/constants/regExp'

function range(start, end) {
  const result: number[] = []
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
          title: '领(发)券时间',
          type: 'string',
          required: true,
          'x-component': 'RangePicker',
          'x-component-props': {
            placeholder: ['领(发)券起始时间', '领(发)券截止时间'],
            showTime: true,
            style: {
              width: '100%',
            },
            disabledDate: (current) => current && current < moment().startOf('day'),
            disabledTime: (current, type) => {
              if ((type === 'start' || type || 'end') && moment().isSame(current, 'day')) {
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
          title: '发券数量',
          type: 'string',
          required: true,
          'x-component-props': {
            allowClear: false,
          },
          'x-rules': [
            {
              pattern: PATTERN_MAPS.quantity,
              message: '请输入正整数',
            },
          ],
        },
      },
    },
  },
}

export default schema
